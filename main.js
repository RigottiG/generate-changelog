const fs = require("fs");
const groupBy = require("./group-by");
const getChangelog = require("./get-changelog");

const changelogList = [
  // Add changelog list
];

const tasks = [];

async function getChangelogWithRetry(iterator, retries = 3) {
  try {
    return await getChangelog(iterator);
  } catch (error) {
    console.error(error);
    if (retries > 0) {
      console.log(`Retrying getChangelog for iterator ${iterator}`);
      return getChangelogWithRetry(iterator, retries - 1);
    }
    throw error;
  }
}

(async () => {
  for (const iterator of changelogList) {
    const changelog = await getChangelogWithRetry(iterator);
    tasks.push(changelog);
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

  // save tasks to file
  fs.writeFile(
    "tasks.json",
    JSON.stringify(tasks, null, 2),
    "utf8",
    function (err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    }
  );
})();
