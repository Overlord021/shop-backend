const BASE_URL = "http://127.0.0.1:4000/api";

async function testRateLimit() {
  console.log("\n--- RATE LIMITER STRESS TEST ---");
  let rateLimit429Hit = false;
  for (let i = 0; i < 30; i++) {
    const res = await fetch(`${BASE_URL}/auth/sign-in`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "flood@example.com", password: "wrongpassword" })
    });
    if (res.status === 429) {
      rateLimit429Hit = true;
      break;
    }
  }
  console.log(`[${rateLimit429Hit ? "PASS" : "FAIL"}] [RATE LIMIT] Exceeding Max Requests returns 429: ${rateLimit429Hit}`);
}

testRateLimit();
