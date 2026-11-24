# Bulk order tree fixtures

`make-bulk-fixtures.js` makes `src/helpers/my-domains/__fixtures__/bulkOrderTree.fixtures.json`, the answer key for `bulkOrderTree.test.ts` (v2 plan phase 2, question V1). It runs the official Seaport.js bulk order code and saves what it produces for 1, 2, 3, 4 and 50 test orders.

It needs Seaport.js in a separate folder, never inside this repo:

```sh
mkdir seaportjs-env && cd seaportjs-env
npm init -y
npm install @opensea/seaport-js@4.4.1 --ignore-scripts
cd ..
node make-bulk-fixtures.js ./seaportjs-env ./bulkOrderTree.fixtures.json
```

Then copy the JSON into `src/helpers/my-domains/__fixtures__/` and run `npx vitest run src/helpers/my-domains/bulkOrderTree.test.ts`.

The signer is a test only key derived from the phrase in the script (`ethers id(...)`), never funded. The test derives the same key. The script records the full EIP712 type hash, not Seaport.js's `getBulkOrderTypeHash`, which hashes only the field type text.
