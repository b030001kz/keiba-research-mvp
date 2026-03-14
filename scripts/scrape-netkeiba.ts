import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// .env.local などの環境変数を読み込む
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// スリープ関数（サーバーへの負荷軽減用）
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// テキストのクリーニング関数
const cleanText = (text: string) => {
  return text.replace(/\s+/g, ' ').trim();
};

/**
 * 指定したrace_idの出馬表をスクレイピングする
 * 例: 202406020811
 */
async function scrapeRaceInfo(raceId: string) {
  const url = `https://race.netkeiba.com/race/shutuba.html?race_id=${raceId}`;
  console.log(`[Fetch] Fetching ${url}`);

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const html = iconv.decode(Buffer.from(response.data), 'euc-jp');
    const $ = cheerio.load(html);

    const pageTitle = cleanText($('title').text());
    console.log(`[Parse] title: ${pageTitle}`);

    if (pageTitle.includes('502 Bad Gateway') || pageTitle === '') {
      console.warn('[Warn] Invalid page or empty title.');
    }

    // --- 1. レース基本情報の抽出 ---
    const raceName = cleanText($('.RaceName').text());

    // ".RaceData01" から 時間、コースタイプ、距離、天候、馬場状態を抽出
    const raceData1 = cleanText($('.RaceData01').text());

    let distance = 0;
    let trackType = '不明';
    let weather = '不明';
    let trackCondition = '不明';

    const distMatch = raceData1.match(/(芝|ダート|障害)(\d+)m/);
    if (distMatch) {
      trackType = distMatch[1];
      distance = parseInt(distMatch[2], 10);
    }

    const weatherMatch = raceData1.match(/天候:([^ /]+)/);
    if (weatherMatch) weather = weatherMatch[1];

    const condMatch = raceData1.match(/馬場:([^ /]+)/);
    if (condMatch) trackCondition = condMatch[1];

    const raceData2 = cleanText($('.RaceData02').text());
    const venueMatch = raceData2.match(/回\s*(札幌|函館|福島|新潟|東京|中山|中京|京都|阪神|小倉)\s*\d+日目/);
    const venue = venueMatch ? venueMatch[1] : '不明';

    // 日付の取得をタイトルから優先して試みる
    let dateStr = new Date().toISOString().split('T')[0];
    const titleDateMatch = pageTitle.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    
    if (titleDateMatch) {
      const year = titleDateMatch[1];
      const month = titleDateMatch[2].padStart(2, '0');
      const day = titleDateMatch[3].padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    } else {
      // 過去レースでない（当日/翌日などの）場合はタブから取得
      const dateText = cleanText($('#RaceList_DateList .Active').text()); // "3/24(日)"
      if (dateText) {
        const dMatch = dateText.match(/(\d+)\/(\d+)/);
        if (dMatch) {
          const year = raceId.substring(0, 4);
          const month = dMatch[1].padStart(2, '0');
          const day = dMatch[2].padStart(2, '0');
          dateStr = `${year}-${month}-${day}`;
        }
      }
    }

    const raceNumberMatch = cleanText($('.RaceNum').text()).match(/(\d+)/);
    const raceNumber = raceNumberMatch ? parseInt(raceNumberMatch[1], 10) : parseInt(raceId.slice(-2), 10);

    const raceData = {
      race_id: raceId,
      date: dateStr,
      venue,
      race_number: raceNumber,
      race_name: raceName,
      distance,
      track_type: trackType,
      weather,
      track_condition: trackCondition
    };

    console.log('[Parsed Race Data]', raceData);

    // --- 2. データベースへ UPSERT (race) ---
    const { error: raceError } = await supabase.from('race').upsert(raceData);
    if (raceError) console.error('[DB Error] race upsert:', raceError.message);

    // --- 3. 出走馬（馬柱）情報の抽出 ---
    const runners: any[] = [];
    const oddsLogs: any[] = [];

    $('.Shutuba_Table tbody tr.HorseList').each((index, element) => {
      const el = $(element);

      const bracketText = cleanText(el.find('td[class^="Waku"]').text());
      const horseNumText = cleanText(el.find('td[class^="Umaban"]').text());

      const horseName = cleanText(el.find('.HorseName a').text());
      const horseUrl = el.find('.HorseName a').attr('href') || '';
      const horseIdMatch = horseUrl.match(/\/horse\/(\d+)/);
      const horseId = horseIdMatch ? horseIdMatch[1] : `dummy_h_${horseNumText}`;

      const jockeyName = cleanText(el.find('.Jockey a').text());
      const trainerName = cleanText(el.find('.Trainer a').text());

      const winOddsText = cleanText(el.find('td.Txt_R').eq(0).text());
      const popularityText = cleanText(el.find('td.Popular').text());

      const winOdds = winOddsText === '---.-' ? null : parseFloat(winOddsText) || null;
      const popularity = parseInt(popularityText, 10) || null;

      if (!horseNumText) return;

      runners.push({
        race_id: raceId,
        horse_id: horseId,
        bracket_number: parseInt(bracketText, 10) || 0,
        horse_number: parseInt(horseNumText, 10),
        jockey_name: jockeyName,
        trainer_name: trainerName,
      });

      if (winOdds !== null) {
        oddsLogs.push({
          race_id: raceId,
          horse_number: parseInt(horseNumText, 10),
          win_odds: winOdds,
          popularity: popularity,
          timestamp: new Date().toISOString()
        });
      }
    });

    console.log(`[Parsed] runners count: ${runners.length}`);

    // --- 4. データベースへ UPSERT (runner & odds) ---
    for (const runner of runners) {
      // horseテーブルにUPSERTしておく (FKエラー回避のため)
      const horseName = cleanText($('.Shutuba_Table tbody tr.HorseList').eq(runner.horse_number - 1).find('.HorseName a').text());
      await supabase.from('horse').upsert({
        horse_id: runner.horse_id,
        horse_name: horseName || `Horse_${runner.horse_id}`
      });

      const { error: runnerErr } = await supabase.from('runner').upsert(runner);
      if (runnerErr) console.error('[DB Error] runner upsert:', runnerErr.message);
    }

    if (oddsLogs.length > 0) {
      const { error: oddsErr } = await supabase.from('odds_snapshot').upsert(oddsLogs);
      if (oddsErr) console.error('[DB Error] odds upsert:', oddsErr.message);
    }

    console.log('[Success] Scraping and DB Insert completed.');

  } catch (error: any) {
    console.error(`[Error] Failed to scrape ${raceId}:`, error.message);
  }
}

// 実行コマンドの引数から race_id を取得
const args = process.argv.slice(2);
const targetRaceId = args[0] || '202409020411'; // デフォルト

console.log(`Starting scraper for race_id: ${targetRaceId}...`);
scrapeRaceInfo(targetRaceId).then(() => {
  console.log('Done.');
});
