import { runAuthTests } from "./test-auth.js";
import { runCategoryBrandTests } from "./test-category-brand.js";
import { runMediaTests } from "./test-media.js";
import { runProductTests } from "./test-product.js";

async function runMasterTestSuite() {
  console.log("==================================================");
  console.log("STARTING MASTER BACKEND SUITE VERIFICATION");
  console.log("==================================================");

  const auth = await runAuthTests();
  if (!auth.cookie) {
    console.error("Auth failed, stopping suite.");
    return;
  }

  const catBrand = await runCategoryBrandTests(auth.cookie);
  const media = await runMediaTests(auth.cookie);
  const product = await runProductTests(auth.cookie, catBrand.categoryId, catBrand.brandId, media.mediaId);

  console.log("\n==================================================");
  console.log("ALL BACKEND TEST MODULES COMPLETED");
  console.log("==================================================");
}

runMasterTestSuite();
