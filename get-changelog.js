const puppeteer = require("puppeteer");

async function getChangelog(iterator) {
  const browser = await puppeteer.launch({
    headless: false,
    product: "chrome",
    args: [
      "--user-data-dir=~/Library/Application Support/Google/Chrome/Default",
    ],
  });
  const page = await browser.newPage();
  await page.goto(
    `https://dev.azure.com/arezzosa/FUTURO_E-COMMERCE/_git/ecommerce-headless/pullrequest/${iterator}`,
    { waitUntil: "domcontentloaded" }
  );

  await page.waitForSelector(
    "a[class='bolt-table-row bolt-list-row first-row single-click-activation v-align-middle']"
  );

  const link = await page.evaluate(() => {
    const link = document.querySelector(
      "a[class='bolt-table-row bolt-list-row first-row single-click-activation v-align-middle']"
    );

    return link.href;
  });

  await page.goto(link, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(
    ".la-group-title ~ .la-item > .la-item-wrapper > .la-artifact-data > .la-primary-data > .la-primary-data-id"
  );

  const changelog = await page.evaluate(() => {
    const workItem = document.querySelector(
      'span[aria-label="ID Field"]'
    ).innerText;

    const us = document.querySelector(
      ".la-group-title ~ .la-item > .la-item-wrapper > .la-artifact-data > .la-primary-data > .la-primary-data-id"
    ).innerText;

    return {
      workItem,
      us,
    };
  });

  await browser.close();
  return changelog;
}

module.exports = getChangelog;
