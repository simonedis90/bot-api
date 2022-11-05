/** REGEX PATTERNS */
// @ts-nocheck

const rgx_category = / \({0,1}(W)\){0,1}$| \({0,1}(U[0-9]+)\){0,1}/gim; // /\((W)\)|\({0,1}(U[0-9]+)\){0,1}/gim
const rgx_rndb = /\([^\)]*\)/gim;
const rgx_char = /[^0-9A-z<> ]/gim;
const rgx_trim = /^\s+|\s+$| +(?= )/g;
const rgx_common = /city|western|club/gim;
const rgx_women = /(^[\s\S]{0,100})[w]{1}om[ae]{1}n[s]{0,1}([\s\S]{0,100})/gim;
const rgx_under = /(^[\s\S]{0,100})U([0-9]+)([\s\S]{0,100})/gim;
const rgx_united = /^Utd | Utd$| Utd /gim;

/* FUNCTIONS */

function livelist_ex_() {
  return [
    ["90'", 'Crystal Palace', 'Tottenham', 0, 0],
    ["90'", 'St Johnstone (W)', 'Rangers (W)', 0, 0],
    ["90'", 'Ingolstadt', 'Werder Bremen', 0, 0],
    ["90'", 'Hiroshima', 'Yokohama FM', 0, 0],
    ["90'", 'Tosu/09e/', 'Shimizù', 0, 0],
    ["90'", 'Lokomotiv', 'Kryliya Sovetov', 0, 0],
    ["90'", 'Feirense', 'Academica', 0, 0],
    ["90'", 'Betis (W)', 'Barcelona (W)', 0, 0],
    ["90'", 'Benfica B', 'Covilha', 0, 0],
    ["90'", 'Karlsruhe', 'Holstein Kiel', 0, 0],
    ["90'", 'Nagasaki', 'Sagamihara', 0, 0],
    ["90'", 'Hannover', 'St Pauli', 0, 0],
    ["90'", 'Okayama', 'Tochigi SC', 0, 0],
    ["90'", 'Renofa Yamaguchi', 'FC Machida', 0, 0],
    ["90'", 'Kitakyushu', 'Kanazawa Utd', 0, 0],
    ["90'", 'FC Elva', 'JK Welco Elekter', 0, 0],
    ["90'", 'Orgryte', 'Akropolis IF', 0, 0],
    ["90'", 'West Ham United (W)', 'Aston Villa (W)', 0, 0],
    ["90'", 'Warta Poznan', 'Nieciecza', 0, 0],
    ["90'", 'Trelleborgs', 'IK Brage', 0, 0],
    ["90'", 'Famalicao U23', 'Leixoes U23', 0, 0],
    ["90'", 'NJS', 'MiPK', 0, 0],
    ["90'", 'Hudiksvalls FF', 'Brommapojkarna', 0, 0],
    ["90'", 'Rukh Vynnyky', 'Zorya', 0, 0],
    ["90'", 'OTP', 'VIFK', 0, 0],
    ["90'", 'Spartak Moscow II', 'Volgar Astrakhan', 0, 0],
    ["90'", 'FK Veles Moscow', 'Neftekhimik', 0, 0],
    ["90'", 'EsPa', 'NuPS', 0, 0],
    ["90'", 'Brondby W', 'Fortuna Hjorring W', 0, 0],
    ["90'", 'Nanjing Fengfan', 'Shenyang Urban FC', 0, 0],
    ["90'", 'Isloch', 'Neman Grodno', 0, 0],
    ["90'", 'Finnkurd (W)', 'Tips', 0, 0],
    ["90'", 'Khonkaen United', 'Prachuap', 0, 0],
    ["90'", 'Varde IF', 'Marienlyst', 0, 0],
    ["90'", 'Notodden', 'Sotra SK', 0, 0],
    ["90'", 'KoiPS', 'SAPA/3', 0, 0],
    ["90'", 'Utsiktens', 'Qviding FIF', 0, 0],
    ["90'", 'Torns', 'Osterlen FF', 0, 0],
    ["90'", 'Oure-skolernes BK', 'FC Sydvest', 0, 0],
    ["90'", 'Chiangrai Utd', 'Nakhon Ratchasima', 0, 0],
    ["90'", 'RZ Pellets WAC Am', 'SC Kalsdorf', 0, 0],
    ["90'", 'Suphanburi', 'JL Chiangmai United', 0, 0],
    ["90'", '1. FC Union Berlin U19', 'Wolfsburg U19', 0, 0],
    ["90'", 'Gornik Leczna (W)', 'Slask Wroclaw (W)', 0, 0],
    ["90'", 'AGF', 'Ringkobing', 0, 0],
    ["90'", 'Norresundby', 'Holstebro', 0, 0],
  ];
}

function match_game_test() {
  h = 'Finn Asuncion Women U20';
  a = 'Imperatriz MA City';
  match_game_new_(livelist_ex_(), h, a);
}

function list_rgx(lv_src) {
  let lv = lv_src;
  lv = lv.replace(/<|>/gm, '.');
  lv = lv.replace(rgx_category, ' <$1$2>');
  lv = lv.replace(rgx_rndb, '');
  lv = lv.replace(rgx_char, '.');
  lv = lv.replace(rgx_united, ' United ');
  lv = lv.replace(rgx_trim, '');

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
  nm = nm.replace(rgx_trim, '');

  return nm;
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

  const nmsh_src = lv_src.map((m) => m[1]);
  const nmsa_src = lv_src.map((m) => m[2]);

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

  Logger.log([h_src, a_src, nmsh_src]);
  Logger.log([h, a, nmsh, nmsa]);
  Logger.log([hks]);
  Logger.log([aks]);

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
  }
  if (asps.length == 1) {
    Logger.log('AWAY SPECIFIC');
    Logger.log(lv_src[asps[0]]);
    return lv_src[asps[0]];
  }

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
    exp = [has.map((n) => lv_src[n]).join(), '', '', 0, 0];
  } //has.map(n=>lv_src[n]).join() }

  Logger.log(exp);
  return exp;
}

function match_game_(lv_src, h, a) {
  /**
     FUNZIONE CHE RESTITUISCE UNA CORRISPONDENZA
     TRA UNA LISTA DI PARTITE E I NOMI DELLE DUE SQUADRE
     **/
  Logger.log('start fx -> match_game_');
  Logger.log([JSON.stringify(lv_src), h, a]);
  // Controllo se è un json valido
  // Ciclo nei match fino a quando non trovo una corrispondenza valida

  // Normalizzo lista e nomi squadre
  lv = JSON.stringify(lv_src);
  // Dichiaro le stringhe regex che utilizzerò per la normalizzazione
  // Regex per eliminare eventuli caratteri accentati o stranieri
  rgx_category = /\((W)\)/gim;
  rgx_rndb = /\([^\)]*\)/gim;
  rgx_char = /[^0-9A-z\[\]\{\}\,\.\'\"\# ]/gim;
  rgx_trim = / +(?= )/g;
  rgx_trim_quotes = / \"|\" /gim;
  rgx_common = /city|western|united|club/gim;
  rgx_women = /(^[\s\S]{0,100})[w]{1}om[ae]{1}n[s]{0,1}([\s\S]{0,100})/gim;

  //Logger.log("pre replace ->" + lv)

  let lv = lv.replace(/#/gm, '.');
  lv = lv.replace(rgx_category, '#$1#');
  lv = lv.replace(rgx_rndb, '');
  lv = lv.replace(rgx_char, '.');
  lv = lv.replace(rgx_trim, '');
  lv = lv.replace(rgx_trim_quotes, '"');

  lvs = [...lv.matchAll(new RegExp('(\\[[^\\[[^\\]]*\\])', 'gim'))].map(
    (x) => x[1],
  );
  lv_temp = lv.split();
  lv_selected = [];
  lv_home = [];
  lv_away = [];

  h = h.replace(rgx_char, '.');
  a = a.replace(rgx_char, '.');
  h = h.replace(rgx_common, '');
  a = a.replace(rgx_common, '');
  h = h.replace(rgx_women, '$1$2 #W#');
  a = a.replace(rgx_women, '$1$2 #W#');
  h = h.replace(rgx_trim, '');
  a = a.replace(rgx_trim, '');

  h_women = h.split(' #W#').length > 1 ? true : false;
  a_women = a.split(' #W#').length > 1 ? true : false;

  ha = [h, a];

  //Logger.log("after replace ->" + lv)
  //Logger.log("after replace ->" + h)
  //Logger.log("after replace ->" + a)

  // Trasformo le stringhe da cercare in array, massimo due parole chiave ordinate per lungheza
  // Elimino le stringhe di categoria
  // Elimino le stringhe di due sole lettere
  hk = h
    .split(' ')
    .filter((m) => m.indexOf('#') === -1)
    .filter((m) => m.length >= 3)
    .sort((a, b) => b.length - a.length);
  if (hk.length > 2) {
    hk.lenght = 2;
  }
  ak = a
    .split(' ')
    .filter((m) => m.indexOf('#') === -1)
    .filter((m) => m.length >= 3)
    .sort((a, b) => b.length - a.length);
  if (ak.length > 2) {
    ak.lenght = 2;
  }

  //Logger.log(hk)
  //Logger.log(ak)

  specific = false;

  // Ricerco la corrispondenza precisa per ogni squadra
  // Nel caso un nome sia esattamente corrispondente ritorno la specificità
  ha.some((e, i) => {
    lv_temp = [
      ...lv.matchAll(
        new RegExp('(\\[[^\\[]{0,100}\\"' + e + '\\"[^\\]]{0,100}\\])', 'gim'),
      ),
    ].map((x) => x[1]);
    if (lv_temp.length == 1) {
      // Aggiunge l'elemento nel caso non fosse presente
      lv_temp.forEach((l) => {
        if (lv_selected.indexOf(l) === -1) {
          lv_selected.push(l);
        }
      });
      match_game_found_(e, i == 0 ? 'home' : 'away', lv_selected);
      specific = true;
      return;
    }
  });

  //Logger.log(lv_selected)
  Logger.log('specific -> ' + specific);

  // HOME Se non ho trovato una sola corrispondenza tramite la ricerca specifica, procedo con quella splittata
  hk.some((k, i) => {
    if (specific) {
      return;
    }
    if (h_women) {
      k = k + '[^#]*#W#';
    }
    // GENERIC VERSION
    lv_temp = [
      ...lv.matchAll(
        new RegExp('(\\[[^\\[]{0,100}' + k + '[^\\]]{0,100}\\])', 'gim'),
      ),
    ].map((x) => x[1]);
    // NEW VERSION
    //lv_temp = [...lv.matchAll(new RegExp("(\\[[^\\[]{0,100}" + k + "(?:[^\\,]{0,100},){3}[^\\]]{0,100}\\])", "gim"))].map(x => x[1])
    if (lv_temp.length > 0) {
      // Aggiunge l'elemento nel caso non fosse presente
      lv_temp.forEach((l) => {
        if (lv_home.indexOf(l) === -1) {
          lv_home.push(l);
        }
      });
      match_game_found_(k, 'home ' + i, lv_home);
      lv_selected = [...lv_home];
      return;
    }
  });

  // AWAY Se non ho trovato una sola corrispondenza tramite la ricerca specifica, procedo con quella splittata
  ak.some((k, i) => {
    if (specific) {
      return;
    }
    if (a_women) {
      k = k + '[^#]*#W#';
    }
    // GENERIC VERSION
    lv_temp = [
      ...lv_selected
        .join()
        .matchAll(
          new RegExp('(\\[[^\\[]{0,100}' + k + '[^\\]]{0,100}\\])', 'gim'),
        ),
    ].map((x) => x[1]);
    // NEW VERSION
    //lv_temp = [...lv_selected.join().matchAll(new RegExp("(\\[[^\\[]{0,100}" + k + "(?:[^\\,]{0,100},){2}[^\\]]{0,100}\\])", "gim"))].map(x => x[1])
    if (lv_temp.length > 0) {
      // Aggiunge l'elemento nel caso non fosse presente
      lv_temp.forEach((l) => {
        if (lv_away.indexOf(l) === -1) {
          lv_away.push(l);
        }
      });
      match_game_found_(k, 'away ' + i, lv_away);
      lv_selected = [...lv_away];
      return;
    } else {
      lv_selected = [];
    }
  });
  //Logger.log(lv_selected)

  if (lv_selected.length == 1) {
    pos = lvs.indexOf(lv_selected[0]);
    match_game_found_(h, a, lv_src[pos], 1);
    return lv_src[pos];
  } else if (lv_selected.length > 1) {
    match_game_found_(h, a, lv_selected, 1);
  }

  return [];

  // Converto le stringhe di categoria (Donne, Primavera, Riserve ecc.) secondo il formato predefinito di BF
  // Converto il separatore " v " in " - "
  // Elimino le stringhe ricorrenti (Club, City, Sporting)
  // Escludo le parole con solo due lettere
  // Splitto i nomi delle squadre ricercando una corrispondenza su ogni parola
  // Ricerco una corrispondenza piena sul nome composito, nel caso sia verificata interrompo la ricerca e continuo  la procedura
  // Confermo solo nel caso ci sia corrispondenza univoca
}

class Logger {
  static log(args) {
    console.log(...args);
  }
}

function match_game_found_(h, a, lv_arr, final = 0) {
  Logger.log('');
  final ? Logger.log('* FINAL TEST RESULTS *') : Logger.log('* TEST RESULTS *');
  Logger.log('k1: ' + h);
  Logger.log('k2: ' + a);
  Logger.log('elem: ' + lv_arr);
  Logger.log('');
}
