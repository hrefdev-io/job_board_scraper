const { GoogleSpreadsheet } = require("google-spreadsheet");
const Sheet = require("./sheet.js");

// remoteok practice but couldn't get to work on multiple pages
async function scrapePage(i) {
  const res = await fetch(`https://remoteok.com/api${i}`);
  const json = await res.json();

  const rows = json.map((job) => {
    return {
      position: job.position,
      location: job.location,
      "salary min": job.salary_min,
      "salary max": job.salary_max,
    };
  });
  return rows;
}

(async function () {
  let i = 1;
  let rows = [];

  while (true) {
    const newRows = await scrapePage(i);

    console.log(`new row length: ${newRows.length}`);
    if (newRows.length === 0) break;
    rows = rows.concat(newRows);
    i++;
  }

  console.log(`total rows length is: ${rows.length}`);

  const sheet = new Sheet();
  await sheet.load();

  await sheet.addRows(rows);
})();
