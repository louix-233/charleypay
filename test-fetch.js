async function testApi() {
  try {
    const res = await fetch('http://localhost:5173/api/sql/payroll-runs/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        month: 'March',
        year: 2026,
        runType: 'Regular',
        confirm: true
      })
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}
testApi();
