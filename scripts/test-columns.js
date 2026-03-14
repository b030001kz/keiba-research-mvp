const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('temp.html');
const $ = cheerio.load(html.toString('utf-8')); // temp.html is already UTF-8

const row = $('.Shutuba_Table tbody tr.HorseList').first();
console.log('Row html:', row.html());
