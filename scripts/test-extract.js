const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('temp.html');
const $ = cheerio.load(html.toString('utf-8'));

console.log('--- Titles ---');
console.log($('title').text());

const rows = $('.Shutuba_Table tbody tr.HorseList');
console.log('HorseList rows:', rows.length);

if (rows.length === 0) {
  // Let's print classes of all trs in Shutuba_Table
  const allTrs = $('.Shutuba_Table tr');
  allTrs.each((i, el) => {
    if (i < 5) console.log('TR class:', $(el).attr('class'));
  });
}

rows.each((i, el) => {
    if (i > 1) return;
    const row = $(el);
    console.log('Horse:', row.find('.HorseName').text().trim());
    console.log('Jockey:', row.find('.Jockey').text().trim());
    console.log('Odds:', row.find('td.Txt_R').eq(0).text().trim());
});
