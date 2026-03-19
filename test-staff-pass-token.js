async function testChangePassword() {
  try {
    const rawToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVNUDAwMSIsImVtcGxveWVlX2lkIjoiRU1QMDAxIiwibmFtZSI6ImtvZmlnbyBsYXMiLCJlbWFpbCI6ImxvdWl4bWVAZ21haWwuY29tIiwidHlwZSI6InN0YWZmIiwidGVtcF9hY2Nlc3MiOnRydWUsInJlcXVpcmVzX3Bhc3N3b3JkX2NoYW5nZSI6dHJ1ZSwiaWF0IjoxNzczNzAyNjMzLCJleHAiOjE3NzM3MDYyMzN9.yO1Dwgrx04TpNEjFr6yAC3yqJQFApbCwOf0PCJ_A2hU";
    
    console.log("1. Changing password...");
    const changeRes = await fetch('http://localhost:5173/api/staff-auth/change-password', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': rawToken
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
testChangePassword();
