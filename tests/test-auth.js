const BASE_URL = "http://127.0.0.1:4000/api";

export async function runAuthTests() {
  console.log("\n--- AUTH & RATE LIMIT TESTS ---");
  const results = [];
  function record(name, expected, actual, pass) {
    results.push({ name, expected, actual, pass });
    console.log(`[${pass ? "PASS" : "FAIL"}] [AUTH] ${name} -> HTTP: ${actual} (Expected: ${expected})`);
  }

  const uniqueId = Date.now();
  const email = `auth_${uniqueId}@example.com`;

  // 1. Sign Up Valid
  const r1 = await fetch(`${BASE_URL}/auth/sign-up`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "User1", email, password: "password1" })
  });
  record("Sign-Up Valid", 201, r1.status, r1.status === 201);

  // 2. Sign Up Duplicate
  const r2 = await fetch(`${BASE_URL}/auth/sign-up`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "User2", email, password: "password1" })
  });
  record("Sign-Up Duplicate (409 Conflict)", 409, r2.status, r2.status === 409);

  // 3. Sign Up Validation Error
  const r3 = await fetch(`${BASE_URL}/auth/sign-up`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "U", email: "bad-email", password: "1" })
  });
  record("Sign-Up Validation Error (422)", 422, r3.status, r3.status === 422);

  // 4. Sign In Wrong Password
  const r4 = await fetch(`${BASE_URL}/auth/sign-in`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "wrongpass" })
  });
  record("Sign-In Wrong Password (403)", 403, r4.status, r4.status === 403);

  // 5. Sign In Valid
  const r5 = await fetch(`${BASE_URL}/auth/sign-in`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "password1" })
  });
  const cookie = r5.headers.get("set-cookie")?.split(";")[0] || "";
  record("Sign-In Valid", 200, r5.status, r5.status === 200 && Boolean(cookie));

  // 6. Session Authenticated
  const r6 = await fetch(`${BASE_URL}/auth/session`, { headers: { Cookie: cookie } });
  const sData = await r6.json();
  record("Session Valid", 200, r6.status, r6.status === 200 && sData.authorized === true);

  // 7. Session Malformed
  const r7 = await fetch(`${BASE_URL}/auth/session`, { headers: { Cookie: "token=bad.token.here" } });
  record("Session Malformed (403)", 403, r7.status, r7.status === 403);

  // 8. Sign Out
  const r8 = await fetch(`${BASE_URL}/auth/sign-out`, { method: "DELETE", headers: { Cookie: cookie } });
  record("Sign-Out", 200, r8.status, r8.status === 200);

  return { cookie, allPassed: results.every(r => r.pass) };
}
