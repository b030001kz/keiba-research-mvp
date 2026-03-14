const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require('fs');

async function run() {
  const res = await axios.get('https://race.netkeiba.com/race/shutuba.html?race_id=202409020411', {responseType: 'arraybuffer'});
  const html = iconv.decode(Buffer.from(res.data), 'euc-jp');
  fs.writeFileSync('temp.html', html);
  console.log('Saved to temp.html');
}
run();
