/**
 * 競馬データ スクレイピングのサンプル・テンプレート
 * 
 * 実際のサイト（例: netkeiba.com等）の構造に合わせてセレクタを修正して使用してください。
 * npm install axios cheerio を実行した上で動作します。
 * 
 * 使用制限や利用規約、リクエスト間隔(sleep)には十分注意してください。
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
// import { supabase } from '../src/lib/db/supabase'; // 実際にDB投入する際にアンコメント

// サーバー負荷軽減のためのスリープ関数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeRaceMenu(dateStr: string) {
  console.log(`Scraping races for ${dateStr}...`);
  // 注意: ここは実際に対象とするサイトのURL構造に合わせて書き換えてください。
  // const url = `https://example-keiba-site.com/race/list/${dateStr}`;
  
  try {
    // 例:
    // const response = await axios.get(url, { responseType: 'arraybuffer' });
    // const html = new TextDecoder('euc-jp').decode(response.data); // 日本の古いサイトは EUC-JPの場合が多い
    // const $ = cheerio.load(html);

    // 以下のパース処理は仮のものです。
    // const races = [];
    // $('.RaceList_Item').each((i, el) => {
    //   const raceName = $(el).find('.RaceName').text().trim();
    //   const raceId = $(el).attr('href')?.match(/\d+/)?.[0];
    //   if(raceId) races.push({ raceId, raceName });
    // });
    
    // return races;
    return [];

  } catch (error) {
    console.error("Scraping failed:", error);
    return [];
  }
}

async function scrapeRaceDetail(raceId: string) {
  console.log(`Scraping detail for race ${raceId}...`);
  // const url = `https://example-keiba-site.com/race/shutuba/${raceId}`;
  
  try {
    await sleep(2000); // 【超重要】1リクエストごとに必ず数秒待機する
    // const response = await axios.get(url, ...);
    // const $ = cheerio.load(html);

    // const runners = [];
    // $('.HorseList').each((i, el) => {
    //   const horseNumber = parseInt($(el).find('.Umaban').text() || '0', 10);
    //   const horseName = $(el).find('.HorseName').text().trim();
    //   const odds = parseFloat($(el).find('.Odds').text() || '0');
    //   
    //   runners.push({ horseNumber, horseName, odds });
    // });
    // return runners;
    return [];
  } catch (error) {
    console.error("Scraping detail failed:", error);
    return [];
  }
}

async function main() {
  console.log("This is a scraper template.");
  console.log("Please adapt the URL and HTML selectors to the actual data source.");
  
  // 1. レース一覧を取得
  // const races = await scrapeRaceMenu('20260314');

  // 2. 各レースの詳細と出馬表を取得し、データベースに保存
  // for (const r of races) {
  //   const runners = await scrapeRaceDetail(r.raceId);
  //   console.log(runners);
  //   // await supabase.from('race').upsert({ ... });
  //   // await supabase.from('runner').upsert({ ... });
  // }
}

main();
