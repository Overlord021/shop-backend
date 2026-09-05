const BASE_URL = "http://127.0.0.1:4000/api";

export async function runProductTests(cookie, categoryId, brandId, mediaId) {
  console.log("\n--- PRODUCT API & BUSINESS RULES TESTS ---");
  const results = [];
  function record(name, expected, actual, pass, details = "") {
    results.push({ name, expected, actual, pass, details });
    console.log(`[${pass ? "PASS" : "FAIL"}] [PRODUCT] ${name} -> HTTP: ${actual} (Expected: ${expected}) ${details ? "| " + details : ""}`);
  }

  // 1. Product Create (Persian Dashboard: name + en_name + price)
  const r1 = await fetch(`${BASE_URL}/product`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      name: "گوشی سامسونگ گلکسی",
      en_name: "Samsung Galaxy Phone",
      price: 45000000,
      dollar_price: 800,
      sale: 10,
      media: [mediaId],
      category: categoryId,
      brand: brandId
    })
  });
  const prodData1 = await r1.json();
  const prodId1 = prodData1._id;
  record("Product Create (Persian Dashboard)", 201, r1.status, r1.status === 201 && Boolean(prodId1));

  // 2. Product Create (English Dashboard: en_name + dollar_price, name/price optional)
  const r2 = await fetch(`${BASE_URL}/product`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      en_name: "Galaxy Ultra Flagship",
      dollar_price: 1100,
      sale: 0,
      media: [mediaId],
      category: categoryId,
      brand: brandId
    })
  });
  const prodData2 = await r2.json();
  const prodId2 = prodData2._id;
  record("Product Create (English Dashboard)", 201, r2.status, r2.status === 201 && Boolean(prodId2));

  // 3. Product Validation: Price below 10,000 Rials
  const r3 = await fetch(`${BASE_URL}/product`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      name: "ارزان",
      en_name: "Cheap",
      price: 100,
      media: [mediaId],
      category: categoryId,
      brand: brandId
    })
  });
  record("Product Minimum Price Validation (422)", 422, r3.status, r3.status === 422);

  // 4. Product List & Pagination
  const r4 = await fetch(`${BASE_URL}/product?page=1&limit=20`);
  const listData = await r4.json();
  const validPagination = listData.data && listData.pagination && listData.pagination.limit === 20;
  record("Product List & Default Pagination", 200, r4.status, r4.status === 200 && validPagination);

  // 5. Product Search (lang=fa searches name and en_name)
  const r5 = await fetch(`${BASE_URL}/product?q=سامسونگ&lang=fa`);
  const searchFa = await r5.json();
  record("Product Search (lang=fa)", 200, r5.status, r5.status === 200 && searchFa.data.length > 0);

  // 6. Product Search (lang=en searches en_name)
  const r6 = await fetch(`${BASE_URL}/product?q=Flagship&lang=en`);
  const searchEn = await r6.json();
  record("Product Search (lang=en)", 200, r6.status, r6.status === 200 && searchEn.data.length > 0);

  // 7. Product Search Regex Injection Safety
  const r7 = await fetch(`${BASE_URL}/product?q=Galaxy+[Ultra]*(Special)&lang=en`);
  record("Product Search Regex Safety", 200, r7.status, r7.status === 200);

  // 8. Currency Toman Filter
  const r8 = await fetch(`${BASE_URL}/product?currency=toman`);
  const tomanData = await r8.json();
  const onlyToman = tomanData.data.every(p => p.price !== null && p.price !== undefined);
  record("Product Filter Currency (Toman Only)", 200, r8.status, r8.status === 200 && onlyToman);

  // 9. Currency USD Filter
  const r9 = await fetch(`${BASE_URL}/product?currency=usd`);
  const usdData = await r9.json();
  const onlyUsd = usdData.data.every(p => p.dollar_price !== null && p.dollar_price !== undefined);
  record("Product Filter Currency (USD Only)", 200, r9.status, r9.status === 200 && onlyUsd);

  // 10. Product Detail
  const r10 = await fetch(`${BASE_URL}/product/${prodId1}`);
  record("Product Detail (Valid ObjectId)", 200, r10.status, r10.status === 200);

  // 11. Product Sale Endpoint
  const r11 = await fetch(`${BASE_URL}/product/sale`);
  const saleData = await r11.json();
  const onlySale = saleData.data && saleData.data.every(p => p.sale > 0);
  record("Product Sale Endpoint", 200, r11.status, r11.status === 200 && onlySale);

  // 12. Product Category Endpoint
  const r12 = await fetch(`${BASE_URL}/product/category/${categoryId}`);
  record("Product Category Endpoint", 200, r12.status, r12.status === 200);

  // 13. Clean up (Delete products)
  const r13 = await fetch(`${BASE_URL}/product/${prodId1}`, { method: "DELETE", headers: { Cookie: cookie } });
  const r14 = await fetch(`${BASE_URL}/product/${prodId2}`, { method: "DELETE", headers: { Cookie: cookie } });
  record("Product Delete", 200, r13.status, r13.status === 200 && r14.status === 200);

  return { allPassed: results.every(r => r.pass) };
}
