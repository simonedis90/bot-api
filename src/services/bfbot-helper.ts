// @ts-nocheck

/** REGEX PATTERNS */

const rgx_category = / \({0,1}(W)\){0,1}$| \({0,1}(U[0-9]+)\){0,1}/gim; // /\((W)\)|\({0,1}(U[0-9]+)\){0,1}/gim
const rgx_rndb = /\([^\)]*\)/gim;
const rgx_char = /[^0-9A-z<> ]/gim;
const rgx_trim = /^\s+|\s+$| +(?= )/g;
const rgx_common = /city|western|club/gim;
const rgx_women = /(^[\s\S]{0,100})[w]{1}om[ae]{1}n[s]{0,1}([\s\S]{0,100})/gim;
const rgx_under = /(^[\s\S]{0,100})U([0-9]+)([\s\S]{0,100})/gim;
const rgx_united = /^Utd | Utd$| Utd /gim;
const rgx_twochar = /^([\w\d]{2})\W|\W([\w\d]{2})\W|^([\w\d]{2})$/gim;
const rgx_special = /Æ|æ/gim;
const rgx_special2 = /å/gim;

function list_rgx(lv_src) {
  let lv = lv_src;
  lv = lv.replace(/<|>/gm, '.');
  lv = lv.replace(rgx_category, ' <$1$2>');
  lv = lv.replace(rgx_rndb, '');
  lv = lv.replace(rgx_char, '.');
  lv = lv.replace(rgx_united, ' United ');
  lv = lv.replace(rgx_twochar, ' ');
  lv = lv.replace(rgx_special, 'ae');
  lv = lv.replace(rgx_special2, 'a');
  lv = lv.replace(rgx_trim, '');
  lv = lv.replace(/(W)([\W\D]{1})/gim, '($1)$2'); // Aggiungo le parentesi alle donne
  return lv;
}

function nm_rgx(nm_src) {
  let nm = nm_src;
  nm = nm.replace(/<|>/gm, '.');
  nm = nm.replace(rgx_category, ' <$1$2>');
  nm = nm.replace(rgx_char, '.');
  nm = nm.replace(rgx_common, '');
  nm = nm.replace(rgx_women, '$1$2 <W>');
  nm = nm.replace(rgx_united, ' United ');
  nm = nm.replace(rgx_twochar, ' ');
  nm = nm.replace(rgx_special, 'ae');
  nm = nm.replace(rgx_special2, 'a');
  nm = nm.replace(rgx_trim, '');
  nm = nm.replace(/(W)([\W\D]{1})/gim, '($1)$2'); // Aggiungo le parentesi alle donne
  return nm;
}

function livelist_ex_() {
  return [
    ['Crystal W', 'Tottenham W'],
    ['St Johnstone (W)', 'Rangers (W)'],
    ['Crystal Palace (W)', 'Tottenham (W)'],
  ];
}

function match_game_test() {
  h = 'Crystal (W)';
  a = 'Tottenham';
  Logger.log(match_game_new_(livelist_ex_(), h, a));
}

export function match_game_new_(lv_src, h_src, a_src) {
  /**
    FUNZIONE CHE RESTITUISCE UNA CORRISPONDENZA
    TRA UNA LISTA DI PARTITE E I NOMI DELLE DUE SQUADRE
    **/
  Logger.log('start fx -> match_game_');
  Logger.log([JSON.stringify(lv_src), h_src, a_src]);

  // Rimuovo eventuali duplicati dall' array sorgente
  lv_src = Array.from(new Set(lv_src));

  const nmsh_src = lv_src.map((m) => m[0]);
  const nmsa_src = lv_src.map((m) => m[1]);

  let nmsh = [];
  nmsh_src.forEach((m) => {
    nmsh = [...nmsh, list_rgx(m)];
  });

  let nmsa = [];
  nmsa_src.forEach((m) => {
    nmsa = [...nmsa, list_rgx(m)];
  });

  // Dichiaro le variabili ripulite da caratteri particolari
  const h = nm_rgx(h_src);
  const a = nm_rgx(a_src);

  // Ottengo le chiavi nomi per la ricerca
  const hks = h
    .split(' ')
    .filter((m) => m.indexOf('<') === -1)
    .filter((m) => m.length >= 3)
    .sort((a, b) => b.length - a.length);
  const aks = a
    .split(' ')
    .filter((m) => m.indexOf('<') === -1)
    .filter((m) => m.length >= 3)
    .sort((a, b) => b.length - a.length);

  // Logger.log([h_src, a_src, nmsh_src]);
  // Logger.log([h, a, nmsh, nmsa]);
  // Logger.log([hks]);
  // Logger.log([aks]);

  // Imposto le variabile per la ricerca categoria
  const cath = [...h.matchAll(new RegExp('(<[^<]+>)', 'gim'))]
    .map((x) => x[1])
    .join('|');
  const cata = [...a.matchAll(new RegExp('(<[^<]+>)', 'gim'))]
    .map((x) => x[1])
    .join('|');

  //Logger.log([cath, cath.length, cath ? true : false])
  //Logger.log([cata, cata.length, cata ? true : false])

  // Dichiaro gli array di confronto con le posizioni
  let hsps = [];
  let asps = [];
  let hs = [];
  let as = [];

  // PROVO LA RICERCA SPECIFICA
  nmsh.some((n, i) => {
    if (h === n) {
      hsps = [...hsps, i];
    }
  });
  nmsa.some((n, i) => {
    if (a === n) {
      asps = [...asps, i];
    }
  });

  if (hsps.length == 1) {
    Logger.log('HOME SPECIFIC');
    Logger.log(lv_src[hsps[0]]);
    return lv_src[hsps[0]];
    //return lv_src[hsps[0]]
  }
  if (asps.length == 1) {
    Logger.log('AWAY SPECIFIC');
    Logger.log(lv_src[asps[0]]);
    return lv_src[asps[0]];
    //return lv_src[asps[0]]
  }

  // if (!Array.isArray(exp) || exp.length <= 0) {

  // PROVO LA RICERCA GENERICA
  nmsh.some((n, i) => {
    hks.some((nh, k) => {
      const path = nh + '.{0,50}' + (cath ? '(?:' + cath + ')' : '');
      const match = RegExp(path, 'gi').test(n);
      if (match && !hs.includes(i)) {
        hs = [...hs, i];
      }
      //Logger.log([nh, n])
      //Logger.log([path, match])
    });
  });

  let path;
  let match;
  nmsa.some((n, i) => {
    aks.some((na, k) => {
      path = na + '.{0,50}' + (cata ? '(?:' + cata + ')' : '');
      match = RegExp(path, 'gi').test(n);
      if (match && !as.includes(i)) {
        as = [...as, i];
      }
      //Logger.log([na, n])
      //Logger.log([path, match])
    });
  });

  console.log('|lv_src|', JSON.stringify(lv_src), 'hs', hs, 'as', as);

  Logger.log('HOME SELECTIONS');
  hs.some((m) => {
    Logger.log(lv_src[m]);
  });
  Logger.log('AWAY SELECTIONS');
  as.some((m) => {
    Logger.log(lv_src[m]);
  });

  let exp;
  const has = hs.filter((v) => as.includes(v));
  if (has.length === 0) {
    exp = [];
  } else if (has.length === 1) {
    exp = lv_src[has[0]];
  } else {
    exp = [has.map((n) => lv_src[n]).join()];
  }
  Logger.log([Array.isArray(exp), exp.length]);
  Logger.log(exp);

  // }

  //   lv_list = '';
  //   const chunkSize = 2;
  //   for (let i = 0; i < lv_src.flat(2).length; i += chunkSize) {
  //     const chunk = lv_src.flat(2).slice(i, i + chunkSize);
  //     // do whatever
  //     sep = i < 1 ? '' : '\n';
  //     lv_list = lv_list + sep + chunk.join(' v ');
  //   }

  //   if (Array.isArray(exp)) {
  //     exp = Array.from(new Set(exp));
  //     //telegram_post_(JSON.stringify(exp), bot_token(), chat_id())
  //   }
  //   Logger.log(['exp', exp]);

  //   if (Array.isArray(exp) && exp.length == 0) {
  //     intro = 'No Match:\nLV: ' + [h_src, a_src].join(' - ') + '\nBF: ';
  //     telegram_post_(
  //       intro + lv_list.match(/[\s\S]{1,4095}/g)[0] || '',
  //       bot_token(),
  //       chat_id(),
  //     );
  //   }
  //   if (Array.isArray(exp) && exp.length == 2) {
  //     intro = 'Match Founded:\nLV: ' + [h_src, a_src].join(' - ') + '\nBF: ';
  //     telegram_post_(
  //       intro + exp.join(' v ').match(/[\s\S]{1,4095}/g)[0] || '',
  //       bot_token(),
  //       chat_id(),
  //     );
  //   }
  //   if (Array.isArray(exp) && exp.length > 2) {
  //     intro = 'Multiple Founded:\nLV: ' + [h_src, a_src].join(' - ') + '\nBF: ';
  //     telegram_post_(
  //       intro +
  //         exp
  //           .map((a) => (Array.isArray(a) ? a.join(' v ') : a))
  //           .join('\n')
  //           .match(/[\s\S]{1,4095}/g)[0] || '',
  //       bot_token(),
  //       chat_id(),
  //     );
  //   }

  return exp;
}

// function test_fixtures() {
//   Logger.log(daylist());
// }

/**  FIXTURES - LISTE PARTITE DEL GIORNO **/
// function daylist(tp = '1X2', dt = null) {
//   d = new Date();
//   dt =
//     dt == null
//       ? [
//           d.getFullYear().toString(),
//           (d.getMonth() + 1).toString().padStart(2, 0),
//           d.getDate().toString().padStart(2, 0),
//         ].join('-')
//       : dt;
//   tp_obj = {
//     '1X2': 'Match%20Odds',
//     '15': 'Over%2FUnder%201.5%20Goals',
//     '25': 'Over%2FUnder%202.5%20Goals',
//     '35': 'Over%2FUnder%203.5%20Goals',
//   };

//   let params = {
//     headers: {
//       accept: '*/*',
//       'accept-encoding': 'gzip, deflate, br',
//       'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7,el;q=0.6',
//       connection: 'keep-alive',
//       DNT: '1',
//       //,"host": "betwatch.fr"
//       referer: 'https://betwatch.fr/money',
//       'sec-ch-ua':
//         '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
//       'sec-ch-ua-mobile': '?0',
//       'sec-fetch-dest': 'empty',
//       'sec-fetch-mode': 'cors',
//       'sec-fetch-site': 'same-origin',
//       'user-agent':
//         'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//       'x-requested-with': 'XMLHttpRequest',
//     },
//   };
//   link =
//     'https://betwatch.fr/getMoney?choice=' +
//     tp_obj[tp] +
//     '&date=' +
//     dt +
//     '&live_only=true&prematch_only=false&not_countries=&not_leagues=&settings_order=score&country=&league=&min_vol=0&max_vol=103&min_percent=0&max_percent=100&min_odd=0&max_odd=349&filtering=false&utc=2&tm=' +
//     timestamp();
//   Logger.log(link);
//   let response = UrlFetchApp.fetch(link, params);

//   if (response.getResponseCode() == 200) {
//     raw_data = response.getContentText().toString();
//     //TEST_CELL_(raw_data)
//     return daylist_parse_(raw_data, tp);
//   } else
//     Logger.log([
//       response.getResponseCode(),
//       response.getContentText().toString(),
//     ]);
// }

function daylist_parse_(src = '[]', tp = '1X2') {
  SpreadsheetApp.flush();
  src = src
    .replace(/[\(\)]/g, ' ')
    .replace(/  /g, ' ')
    .replace(/ \"|\" /g, '"');

  if (tp === '1X2') {
    list = [];
    src = isJson_(src) ? JSON.parse(src) : [];
    src.forEach((m) => {
      //Logger.log(m)
      if (m.hasOwnProperty('m')) {
        list = [...list, m.m.split(' - ')];
      }
    });
    Logger.log(list);
    return list;
  }
}

class Logger {
  static log(args) {
    console.log(...args);
  }
}
