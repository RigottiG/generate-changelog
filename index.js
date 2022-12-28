const puppeteer = require("puppeteer");
const fs = require("fs");

const changelogList = [
  "14328",
  "14304",
  "14277",
  "14293",
  "14276",
  "14208",
  "14179",
  "14151",
  "14114",
];

const tasks = [
  { workItem: "63966", us: "55121 " },
  { workItem: "63919", us: "55121 " },
  { workItem: "63753", us: "54838 " },
  { workItem: "63919", us: "55121 " },
  { workItem: "63885", us: "55121 " },
  { workItem: "63654", us: "54838 " },
  { workItem: "63576", us: "55029 " },
  { workItem: "63221", us: "54838 " },
  { workItem: "63191", us: "55041 " },
];

function groupBy(collection, property) {
  var i = 0,
    val,
    index,
    values = [],
    result = [];
  for (; i < collection.length; i++) {
    val = collection[i][property];
    index = values.indexOf(val);
    if (index > -1) result[index].push(collection[i]);
    else {
      values.push(val);
      result.push([collection[i]]);
    }
  }
  return result;
}

const list = tasks.map((task) => ({
  workItem: task.workItem,
  us: task.us,
}));

const groupedTask = groupBy(list, "us");

const us = groupedTask.map((item) => {
  return {
    us: item[0].us.trim(),
    workItems: item.map((i) => i.workItem),
  };
});

us.forEach((item, indexUs) => {
  console.log(`${indexUs + 1}. #${item.us}`);

  item.workItems.forEach((workItem, index) => {
    // Remove duplicated work items
    if (item.workItems.indexOf(workItem) === index) {
      console.log(`${indexUs + 1}.${index + 1}. #${workItem}`);
    }
  });
});

// (async () => {
//   for (const iterator of changelogList) {
//     const browser = await puppeteer.launch({
//       headless: false,
//       product: "chrome",
//       args: [
//         "--user-data-dir=~/Library/Application Support/Google/Chrome/Default",
//       ],
//     });
//     const page = await browser.newPage();
//     await page.goto(
//       `https://dev.azure.com/arezzosa/FUTURO_E-COMMERCE/_git/ecommerce-headless/pullrequest/${iterator}`,
//       { waitUntil: "domcontentloaded" }
//     );

//     await page.waitForSelector(
//       "a[class='bolt-table-row bolt-list-row first-row single-click-activation v-align-middle']"
//     );

//     const link = await page.evaluate(() => {
//       const link = document.querySelector(
//         "a[class='bolt-table-row bolt-list-row first-row single-click-activation v-align-middle']"
//       );

//       return link.href;
//     });

//     await page.goto(link, { waitUntil: "domcontentloaded" });
//     await page.waitForSelector(
//       ".la-group-title ~ .la-item > .la-item-wrapper > .la-artifact-data > .la-primary-data > .la-primary-data-id"
//     );

//     const changelog = await page.evaluate(() => {
//       const workItem = document.querySelector(
//         'span[aria-label="ID Field"]'
//       ).innerText;

//       const us = document.querySelector(
//         ".la-group-title ~ .la-item > .la-item-wrapper > .la-artifact-data > .la-primary-data > .la-primary-data-id"
//       ).innerText;

//       return {
//         workItem,
//         us,
//       };
//     });

//     tasks.push(changelog);
//     console.log(tasks);

//     await browser.close();
//   }

//   console.log(tasks);
//   // save tasks to file
//   fs.writeFile(
//     "tasks.json",
//     JSON.stringify(tasks, null, 2),
//     "utf8",
//     function (err) {
//       if (err) {
//         return console.log(err);
//       }

//       console.log("The file was saved!");
//     }
//   );
// })();
