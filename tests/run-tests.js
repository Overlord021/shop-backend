const BASE_URL = "http://127.0.0.1:4000/api";

async function runTests() {
  console.log("=== STARTING COMPREHENSIVE BACKEND API TESTS ===");
  const results = [];
  function record(name, status, expected, actual, passed) {
    results.push({ name, status, expected, actual, passed });
    console.log(`[${passed ? "PASS" : "FAIL"}] ${name} | HTTP: ${status} | Expected: ${expected} | Actual: ${actual}`);
  }

  let cookie = "";
  const email = `user_${Date.now()}@example.com`;

  // 1. SignUp
  const r1 = await fetch(`${BASE_URL}/auth/sign-up`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Tester", email, password: "123456" })
  });
  record("AUTH Sign-Up", r1.status, 201, r1.status, r1.status === 201);

  // 2. SignIn
  const r2 = await fetch(`${BASE_URL}/auth/sign-in`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "123456" })
  });
  cookie = r2.headers.get("set-cookie")?.split(";")[0] || "";
  record("AUTH Sign-In", r2.status, 200, r2.status, r2.status === 200 && Boolean(cookie));

  // 3. Session
  const r3 = await fetch(`${BASE_URL}/auth/session`, { headers: { Cookie: cookie } });
  record("AUTH Session", r3.status, 200, r3.status, r3.status === 200);

  // 4. Category
  const r4 = await fetch(`${BASE_URL}/category`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ name: "موبایل", en_name: "Mobile", image: "https://example.com/c.jpg" })
  });
  const catData = await r4.json();
  record("CATEGORY Create", r4.status, 201, r4.status, r4.status === 201 && Boolean(catData._id));

  // 5. Brand
  const r5 = await fetch(`${BASE_URL}/brand`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ name: "اپل", en_name: "Apple", logo: "https://example.com/l.jpg" })
  });
  const brandData = await r5.json();
  record("BRAND Create", r5.status, 201, r5.status, r5.status === 201 && Boolean(brandData._id));

  // 6. Media & Mass Assignment protection
  const r6 = await fetch(`${BASE_URL}/media`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ url: "https://example.com/m.jpg", labels: ["phone"] })
  });
  const mediaData = await r6.json();
  record("MEDIA Create", r6.status, 201, r6.status, r6.status === 201 && Boolean(mediaData._id));

  const r7 = await fetch(`${BASE_URL}/media/${mediaData._id}`, {
    method: "PUT", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ labels: ["smartphone"], url: "https://hack.com/h.jpg" })
  });
  const updatedMedia = await r7.json();
  record("MEDIA Mass Assignment Protection", r7.status, 200, r7.status, r7.status === 200 && updatedMedia.url === "https://example.com/m.jpg");

  // 7. Product
  const r8 = await fetch(`${BASE_URL}/product`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      name: "آیفون", en_name: "iPhone", price: 50000000, dollar_price: 1000, sale: 5,
      media: [mediaData._id], category: catData._id, brand: brandData._id
    })
  });
  const prodData = await r8.json();
  record("PRODUCT Create", r8.status, 201, r8.status, r8.status === 201 && Boolean(prodData._id));

  const r9 = await fetch(`${BASE_URL}/product`);
  const prodList = await r9.json();
  record("PRODUCT List", r9.status, 200, r9.status, r9.status === 200 && prodList.data.length > 0);

  // 8. SignOut
  const r10 = await fetch(`${BASE_URL}/auth/sign-out`, { method: "DELETE", headers: { Cookie: cookie } });
  record("AUTH Sign-Out", r10.status, 200, r10.status, r10.status === 200);

  console.log("=== TESTS COMPLETED ===");
}
runTests();
