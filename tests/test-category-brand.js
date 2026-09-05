const BASE_URL = "http://127.0.0.1:4000/api";

export async function runCategoryBrandTests(cookie) {
  console.log("\n--- CATEGORY & BRAND TESTS ---");
  const results = [];
  function record(name, expected, actual, pass) {
    results.push({ name, expected, actual, pass });
    console.log(`[${pass ? "PASS" : "FAIL"}] [CAT/BRAND] ${name} -> HTTP: ${actual} (Expected: ${expected})`);
  }

  // 1. Category Create No Auth
  const r1 = await fetch(`${BASE_URL}/category`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "تست", image: "https://example.com/c.jpg" })
  });
  record("Category Create Unauthenticated (403)", 403, r1.status, r1.status === 403);

  // 2. Category Create Valid
  const r2 = await fetch(`${BASE_URL}/category`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ name: "لوازم دیجیتال", en_name: "Digital", image: "https://example.com/c.jpg" })
  });
  const catData = await r2.json();
  const categoryId = catData._id;
  record("Category Create Valid", 201, r2.status, r2.status === 201 && Boolean(categoryId));

  // 3. Category Validation Error
  const r3 = await fetch(`${BASE_URL}/category`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ image: "" })
  });
  record("Category Create Missing Name (422)", 422, r3.status, r3.status === 422);

  // 4. Category List
  const r4 = await fetch(`${BASE_URL}/category`);
  record("Category List", 200, r4.status, r4.status === 200);

  // 5. Category Update
  const r5 = await fetch(`${BASE_URL}/category/${categoryId}`, {
    method: "PUT", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ name: "کالای دیجیتال پیشرفته" })
  });
  record("Category Update Valid", 201, r5.status, r5.status === 201);

  // 6. Brand Create Valid
  const r6 = await fetch(`${BASE_URL}/brand`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ name: "سامسونگ", en_name: "Samsung", logo: "https://example.com/logo.jpg" })
  });
  const brandData = await r6.json();
  const brandId = brandData._id;
  record("Brand Create Valid", 201, r6.status, r6.status === 201 && Boolean(brandId));

  // 7. Brand Validation Error
  const r7 = await fetch(`${BASE_URL}/brand`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ logo: "" })
  });
  record("Brand Create Missing Logo (422)", 422, r7.status, r7.status === 422);

  // 8. Brand List
  const r8 = await fetch(`${BASE_URL}/brand`);
  record("Brand List", 200, r8.status, r8.status === 200);

  // 9. Brand Update
  const r9 = await fetch(`${BASE_URL}/brand/${brandId}`, {
    method: "PUT", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ en_name: "Samsung Group" })
  });
  record("Brand Update Valid", 201, r9.status, r9.status === 201);

  return { categoryId, brandId, allPassed: results.every(r => r.pass) };
}
