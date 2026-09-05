const BASE_URL = "http://127.0.0.1:4000/api";

export async function runMediaTests(cookie) {
  console.log("\n--- MEDIA API & MASS ASSIGNMENT TESTS ---");
  const results = [];
  function record(name, expected, actual, pass) {
    results.push({ name, expected, actual, pass });
    console.log(`[${pass ? "PASS" : "FAIL"}] [MEDIA] ${name} -> HTTP: ${actual} (Expected: ${expected})`);
  }

  // 1. Media Create with Label Normalization
  const r1 = await fetch(`${BASE_URL}/media`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      url: "https://example.com/item.jpg",
      labels: ["  phone  ", "phone", "SAMSUNG", ""]
    })
  });
  const mediaData = await r1.json();
  const mediaId = mediaData._id;
  const labelsNormalized = mediaData.labels && mediaData.labels.length === 2 && mediaData.labels.includes("phone") && mediaData.labels.includes("SAMSUNG");
  record("Media Create & Label Normalization", 201, r1.status, r1.status === 201 && labelsNormalized);

  // 2. Media List & Pagination
  const r2 = await fetch(`${BASE_URL}/media?page=1&limit=15`);
  const listData = await r2.json();
  const validPagination = listData.pagination && listData.pagination.limit === 15;
  record("Media List & Pagination", 200, r2.status, r2.status === 200 && validPagination);

  // 3. Media Search by Label
  const r3 = await fetch(`${BASE_URL}/media?q=phone`);
  const searchData = await r3.json();
  record("Media Search by Label", 200, r3.status, r3.status === 200 && searchData.data.length > 0);

  // 4. Media Update Labels - Mass Assignment Protection
  const r4 = await fetch(`${BASE_URL}/media/${mediaId}`, {
    method: "PUT", headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      labels: ["smartphone", "tech"],
      url: "https://hacker.com/malicious.jpg"
    })
  });
  const updatedMedia = await r4.json();
  const massAssignmentPrevented = updatedMedia.url === "https://example.com/item.jpg" && updatedMedia.labels.includes("smartphone");
  record("Media Update Labels (Mass Assignment Protection)", 200, r4.status, r4.status === 200 && massAssignmentPrevented);

  // 5. Media Delete Invalid ObjectId
  const r5 = await fetch(`${BASE_URL}/media/invalid-id`, { method: "DELETE", headers: { Cookie: cookie } });
  record("Media Delete (Invalid ObjectId 422)", 422, r5.status, r5.status === 422);

  return { mediaId, allPassed: results.every(r => r.pass) };
}
