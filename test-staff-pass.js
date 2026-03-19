async function testStaffPass() {
  try {
    console.log("1. Logging in...");
    const loginRes = await fetch('http://localhost:5173/api/staff-auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_id: 'EMP001',
        password: 'password123'
      })
    });
    
    const loginData = await loginRes.json();
    console.log("Login Response:", loginData);
    
    if (!loginData.requires_password_change || !loginData.temp_token) {
        console.log("No temp token found. Exiting test.");
        return;
    }

    console.log("\n2. Changing password...");
    const changeRes = await fetch('http://localhost:5173/api/staff-auth/change-password', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': loginData.temp_token
      },
      body: JSON.stringify({
        new_password: 'NewPassword123!'
      })
    });
    
    const changeText = await changeRes.text();
    console.log("Change Pass Status:", changeRes.status);
    console.log("Change Pass Response:", changeText);
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}
testStaffPass();
