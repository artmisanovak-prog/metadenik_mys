// analyzer.js – plná verze z analyzer_v7
// Obsahuje: UHLY, STOP, detectMicro, detectMakro, analyzeText, highlightText

const UHLY = [
  {i:0, st:0, barva:'#1f77b4', nazev:'Analytický', gen:'struktury · výčty · dlouhé věty',
   mikro:['Dlouhá věta (20+ slov)','Polysyndeton','Apoziční definice','Parataxe'],
   makro:['Fixace (opakovaná slova)']},
  {i:1, st:30, barva:'#ff7f0e', nazev:'Asociační', gen:'fragment · imperativ · číslovky',
   mikro:['Fragment (krátká věta)','Enumerace (čárky)','Vykřičník','Číslovka/číslice','Znaménko'],
   makro:[]},
  {i:2, st:60, barva:'#2ca02c', nazev:'Kulturní', gen:'minulý čas · role · tradice',
   mikro:['Minulý čas (bez 1.os.j.č.)','Parabola','Intertextualita','Kulturní odkaz'],
   makro:['Změna role (zájmen)']},
  {i:3, st:90, barva:'#d62728', nazev:'Introspektivní', gen:'1.os.j.č. · detaily · tempo',
   mikro:['1. osoba j.č.','Smyslový detail'],
   makro:['Změna tempa vět']},
  {i:4, st:120, barva:'#9467bd', nazev:'Filozofický', gen:'metatext · otázky · deklarace',
   mikro:['Metatext','Deklarace','Otázka (ne v přímé řeči)','Paradox (2× být bez ale)','Filozofická kolokace'],
   makro:[]},
  {i:5, st:150, barva:'#8c564b', nazev:'Ironický', gen:'negace · kontrast · ironie',
   mikro:['Negace (2+ záporů)','Parentéze','Ironie (2× být + ale)','Deformovaná frazeologie'],
   makro:['Kontrast (sémantický)']},
  {i:6, st:180, barva:'#e377c2', nazev:'Naivní', gen:'elipsa · přímá řeč · nerozhodnost',
   mikro:['Elipsa (bez slovesa)','Komprese','Nerozhodnost','Přímá řeč','Performativita'],
   makro:[]},
  {i:7, st:210, barva:'#7f7f7f', nazev:'Groteskní', gen:'gradace · hyperbola · vykřičník',
   mikro:['Hyperbola','Tautologie','Vykřičník','Ilokuce (řečový akt + !)'],
   makro:['Gradace (délka vět)','Změna času']},
  {i:8, st:240, barva:'#bcbd22', nazev:'Jazykový', gen:'anafora · aliterace · paralelismus',
   mikro:['Onomatopoeia'],
   makro:['Anafora','Epifora','Aliterace','Paralelismus']},
  {i:9, st:270, barva:'#17becf', nazev:'Absurdní', gen:'paradox · oxymóron · personifikace',
   mikro:['Aposiopeze (…)','Synestezie (2+ smysly)','Personifikace','Oxymóron','Neologismus'],
   makro:['Přeskok (náhlá změna)']},
  {i:10, st:300, barva:'#aec7e8', nazev:'Metaforický', gen:'metafora · přirovnání · apostrofa',
   mikro:['Metafora','Přirovnání','Závorky','Pomlčka','Apostrofa'],
   makro:[]},
  {i:11, st:330, barva:'#ffbb78', nazev:'Surrealistický', gen:'asyndeton · sen · výplňová slova',
   mikro:['Výplňová slova','Sen (klíčová slova)'],
   makro:['Asyndeton','Prolínání míst a časů','Hapax legomena']},
];

const STOP = new Set(['a','ale','nebo','i','ani','ze','co','jak','kde','kdy','kdo','tam','tady','to','ten','ta','te','je','jsou','byl','byla','bylo','byt','se','si','na','v','ve','do','z','ze','o','po','pri','pro','k','ke','s','u','nad','pod','za','pred','mezi','uz','jeste','jen','take','proto','pak','tak','tedy','prece','stale','jinak']);

function splitVety(t) {
  return t.split(/(?<=[.!?\u2026])\s+|\n(?=\S)/).map(s => s.trim()).filter(s => s.length > 1);
}

function detectMicro(sentence, si) {
  const s = sentence, sl = s.toLowerCase();
  const words = s.split(/\s+/).filter(Boolean), wl = words.length;
  const R = [];
  function hit(uhel, fig, match) { R.push({ uhel, fig, match, si, type: 'mikro' }); }

  // 0 Analytický
  if (wl > 20) hit(0, 'Dlouhá věta (20+ slov)', s.slice(0,55)+'…');
  const conj = (sl.match(/\b(a\b|ale\b|nebo\b|i\b|ani\b|avšak|jenže|přitom|protože|když|pokud|než|jestliže|ačkoli|neboť)\b/g) || []).length;
  if (conj >= 3) hit(0, 'Polysyndeton', conj+'× spojka');
  if (/,\s*(který|která|které|jenž|jež)\b/i.test(s)) hit(0, 'Apoziční definice', s.slice(0,45));
  if (/\b(a\b|ale\b|nebo\b)\b[^,]{5,}/i.test(s) && wl > 8) hit(0, 'Parataxe', s.slice(0,45));

  // 1 Asociační
  const hasV = /\b(jsem|jsi|je\b|jsme|jste|jsou|byl|byla|bylo|mám|máš|má\b|jdu|jdeš|říkám|vidím|cítím|vím|chci|mohu|musím)\b/i.test(s);
  if (hasV && wl <= 6 && wl >= 2) hit(1, 'Fragment (krátká věta)', s.slice(0,35));
  const cm = (s.match(/,/g) || []).length;
  if (cm >= 2) hit(1, 'Enumerace (čárky)', cm+'× čárka');
  if (/[!]/.test(s)) hit(1, 'Vykřičník', s.slice(0,35));
  if (/\b\d+\b/.test(s)) hit(1, 'Číslovka/číslice', s.match(/\b\d+\b/)[0]);
  if (/[+=#&\/;]/.test(s)) hit(1, 'Znaménko', s.match(/[+=#&\/;]/)[0]);

  // 2 Kulturní
  const pastV = s.match(/\b\w+(al|ala|alo|ali|aly|byl|byla|bylo|byli|byly)\b/gi) || [];
  if (pastV.length > 0 && !/\b(jsem|jsem\s+byl|jsem\s+byla)\b/i.test(s)) hit(2, 'Minulý čas (bez 1.os.j.č.)', pastV[0]);
  if (/jako\s+\w+\s+v\s+|podobně\s+jako|příběh\s+o|bajka|legenda|mýtus/i.test(s)) hit(2, 'Parabola', s.slice(0,45));
  if (/„[^"]+"|"[^"]+"/i.test(s)) hit(2, 'Intertextualita', s.slice(0,45));
  if (/\b(tradice|kultura|dějiny|minulost|archetyp|symbol|rituál)\b/i.test(s)) hit(2, 'Kulturní odkaz', s.match(/\b(tradice|kultura|dějiny|minulost|archetyp|symbol|rituál)\b/i)[0]);

  // 3 Introspektivní
  if (/\b(já\b|jsem\b|mě\b|mi\b|mou\b|moje\b|moji\b|mám\b|cítím\b|říkám\b|vím\b)\b/i.test(s)) hit(3, '1. osoba j.č.', s.slice(0,45));
  const dM = s.match(/\b(\d+\s*(cm|mm|kg|°C|ml|m\b|km)|červen\w+|moder\w+|zelen\w+|žlut\w+|bíl\w+|černý|bílý|teplý|studený|hladký|hrubý|tmavý|světlý|sladký|kyselý|hořký|slaný)\b/i);
  if (dM) hit(3, 'Smyslový detail', dM[0]);

  // 4 Filozofický
  if (/\b(tento\s+text|tato\s+věta|píšu|říkám\s+to|mluvím\s+o|jazyk\s+sám)\b/i.test(s)) hit(4, 'Metatext', s.slice(0,45));
  if (/\b(pravda\s+je|jsem\s+přesvědčen|tvrdím|prohlašuji|je\s+zřejmé|faktem\s+je)\b/i.test(s)) hit(4, 'Deklarace', s.slice(0,45));
  if (s.trim().endsWith('?') && !/„[^"]*\?/.test(s) && !/"[^"]*\?/.test(s)) hit(4, 'Otázka (ne v přímé řeči)', s.slice(0,55));
  const beC = (sl.match(/\bjsem\b|\bje\b|\bjsou\b|\bbýt\b/g) || []).length;
  if (beC >= 2 && !/\bale\b|\bpřesto\b|\bi\s+tak\b/.test(sl)) hit(4, 'Paradox (2× být bez ale)', s.slice(0,45));
  if (/\b(kolokace|fixace|dekonstrukce|epistéme|ontologie|bytí|jsoucno)\b/i.test(s)) hit(4, 'Filozofická kolokace', s.slice(0,45));

  // 5 Ironický
  const negs = (sl.match(/\bne\b|\bni\b|\bbez\b|\bnikdy\b|\bnikdo\b|\bnic\b|\bnení\b|\bnemá\b|\bnemám\b|\bnemohu\b|\bnemohl\b|\bnebylo?\b|\bneví\b|\bnechce\b/g) || []).length;
  if (negs >= 2) hit(5, 'Negace (2+ záporů)', negs+'× negace');
  if (/[()]/.test(s)) hit(5, 'Parentéze', s.slice(0,45));
  const beC2 = (sl.match(/\bjsem\b|\bjsi\b|\bje\b|\bjsme\b|\bjste\b|\bjsou\b|\bbyl\b|\bbyla\b/g) || []).length;
  const hasAle = /\bale\b|\bpřesto\b|\bi\s+tak\b|\bvšak\b|\bjenže\b/.test(sl);
  if (beC2 >= 2 && hasAle) hit(5, 'Ironie (2× být + ale)', s.slice(0,45));
  if (/\b(samozřejmě|pochopitelně|jasně|no\s+jo|jak\s+jinak)\b/i.test(s)) hit(5, 'Deformovaná frazeologie', s.match(/\b(samozřejmě|pochopitelně|jasně|no\s+jo|jak\s+jinak)\b/i)[0]);

  // 6 Naivní
  const hasV2 = /\b(jsem|jsi|je\b|jsme|jste|jsou|byl|byla|bylo|být|mám|máš|má\b|jdu|šel|šla|říká|vidí|cítí|vím|mohu|musím|chci|dal|vzal|přišel)\b/i.test(s);
  if (!hasV2 && wl > 1) hit(6, 'Elipsa (bez slovesa)', s.slice(0,45));
  if (wl <= 5 && wl >= 2 && /\b(jsem|jsi|je\b|jsme|jste|jsou|byl|byla|mám|máš|jdu|stojí)\b/i.test(s)) hit(6, 'Komprese', s.slice(0,35));
  if (/\b(možná|snad|nevím|doufám|pravděpodobně|myslím\s+si|asi|zdá\s+se|zřejmě|skoro|jaksi)\b/i.test(s)) hit(6, 'Nerozhodnost', s.match(/\b(možná|snad|nevím|doufám|pravděpodobně|myslím\s+si|asi|zdá\s+se|zřejmě|skoro|jaksi)\b/i)[0]);
  if (/„[^"]+"|"[^"]+"/i.test(s)) hit(6, 'Přímá řeč', s.slice(0,45));
  if (/\b(kdybych|kdybychom|přál\s+bych\s+si|nechť|kéž|ať\b)\b/i.test(s)) hit(6, 'Performativita', s.slice(0,35));

  // 7 Groteskní
  if (/\b(naprosto|absolutně|zcela|totálně|nejvíc|nejhůř|nejlépe|nikdy\s+v\s+životě|stoprocentně)\b/i.test(s)) hit(7, 'Hyperbola', s.match(/\b(naprosto|absolutně|zcela|totálně|nejvíc|nejhůř|nejlépe|stoprocentně)\b/i)[0]);
  const wA = words.map(w => w.toLowerCase().replace(/[.,!?;:]/g, ''));
  const seen = {}; let tau = false;
  wA.forEach(w => { if (w.length > 3 && !STOP.has(w)) { if (seen[w]) tau = true; seen[w] = true; } });
  if (tau) hit(7, 'Tautologie', s.slice(0,45));
  if (/[!]/.test(s)) hit(7, 'Vykřičník', s.slice(0,35));
  const reci = /\b(říká|říkal|řekl|řekla|křičí|křičel|šeptal|volá|volal|prohlašuje|tvrdí)\b/i.test(s);
  if (reci && /[!]/.test(s)) hit(7, 'Ilokuce', s.slice(0,35));

  // 8 Jazykový
  if (/\b(bum|prásk|žbluňk|šum|hukot|šelest|šustí|sykot|hřmot|dunění|vrčí|klepot|vrzá|cinká|zvoní|hučí|šepotá|kvičí|prská)\b/i.test(s)) hit(8, 'Onomatopoeia', s.match(/\b(bum|prásk|žbluňk|šum|hukot|šelest|šustí|sykot|hřmot|dunění|vrčí|klepot|vrzá|cinká|zvoní|hučí|šepotá|kvičí|prská)\b/i)[0]);

  // 9 Absurdní
  if (/\.\.\.|…/.test(s)) hit(9, 'Aposiopeze (…)', s.slice(0,45));
  const zr = /\b(barva|červen\w+|moder\w+|světl\w+|tmav\w+|vidět)\b/i.test(s);
  const sl2 = /\b(zvuk|tón|melodie|hluk|tich\w+|slyšet)\b/i.test(s);
  const chu = /\b(chuť|sladký|kyselý|hořký|slaný|ochutnat)\b/i.test(s);
  const hm = /\b(dotyk|hladký|hrubý|teplý|studený|hebký|tvrdý|měkký)\b/i.test(s);
  const vu = /\b(vůně|zápach|vonět|páchnout|parfém)\b/i.test(s);
  if ([zr, sl2, chu, hm, vu].filter(Boolean).length >= 2) hit(9, 'Synestezie (2+ smysly)', s.slice(0,45));
  const ina = /\b(ticho|čas|světlo|tma|slova?|myšlenky?|vzduch|vítr|voda|kameny?|strom\w+|krajina|mlha|sen\w+)\b/i.test(s);
  const hv = /\b(řekl|říká|myslí|cítí|ví|chce|vzpomíná|snívá|smál|plakal|volal)\b/i.test(s);
  if (ina && hv) hit(9, 'Personifikace', s.slice(0,45));
  if (/\b(živá\s+smrt|sladká\s+bolest|veselý\s+smutek|hlučné\s+ticho|světlá\s+tma|radostný\s+pláč)\b/i.test(s)) hit(9, 'Oxymóron', s.slice(0,35));
  const neo = s.match(/\b\w+-\w+\b/g) || [];
  if (neo.length > 0) hit(9, 'Neologismus', neo[0]);

  // 10 Metaforický
  const mM = s.match(/(\b\w{3,}\b)\s+(je|jsou|byl|byla|bylo)\s+(\b\w{3,}\b)/gi) || [];
  mM.forEach(m => {
    const idx = s.indexOf(m);
    const before = s.slice(Math.max(0, idx-12), idx).toLowerCase();
    if (!/\b(já|ty|on|ona|ono|my|vy|oni|ony|se|si)\b/.test(before)) hit(10, 'Metafora', m.slice(0,45));
  });
  if (/\b(jako\b|jako\s+by|podobně\s+jako|připomíná|jako\s+kdyby)\b/i.test(s)) hit(10, 'Přirovnání', s.slice(0,45));
  if (/[()]/.test(s)) hit(10, 'Závorky', s.slice(0,45));
  if (/[—–]/.test(s)) hit(10, 'Pomlčka', s.slice(0,45));
  if (/\b(ó|ach|hej|poslyš|pohleď)\b/i.test(s)) hit(10, 'Apostrofa', s.slice(0,35));

  // 11 Surrealistický
  const vy = (s.match(/\b(vlastně|jaksi|prostě|no\b|tedy|tak\b|víte|víš|ehm|hm\b|teda|takže\b)\b/gi) || []);
  if (vy.length > 0) hit(11, 'Výplňová slova', vy.slice(0,3).join(', '));
  if (/\b(sen\b|snový|zdálo\s+se|snil\b|sny\b|noční\b|spánek|přisnil|snít)\b/i.test(s)) hit(11, 'Sen (klíčová slova)', s.slice(0,35));

  return R;
}

function detectMakro(sentences, fullText) {
  const R = [];
  const fl = fullText.toLowerCase();
  const words = fullText.split(/\s+/).filter(Boolean).map(w => w.toLowerCase().replace(/[.,!?;:„""\-—–()]/g, ''));
  function hit(uhel, fig, match) { R.push({ uhel, fig, match, si: -1, type: 'makro' }); }

  // 0 Fixace
  const wfreq = {};
  words.forEach(w => { if (w.length > 3 && !STOP.has(w)) wfreq[w] = (wfreq[w] || 0) + 1; });
  const fixW = Object.entries(wfreq).filter(([w,c]) => c >= 3).sort((a,b) => b[1]-a[1]);
  if (fixW.length > 0) hit(0, 'Fixace (opakovaná slova)', fixW.slice(0,3).map(([w,c]) => `"${w}" ${c}×`).join(', '));

  // 2 Změna role
  const psets = sentences.map(s => {
    const p = new Set();
    if (/\bjá\b|\bjsem\b/i.test(s)) p.add('já');
    if (/\bty\b|\btě\b/i.test(s)) p.add('ty');
    if (/\bmy\b|\bnám\b/i.test(s)) p.add('my');
    if (/\bvy\b|\bvám\b/i.test(s)) p.add('vy');
    return p;
  });
  const allP = new Set(psets.flatMap(s => [...s]));
  if (allP.size >= 2) hit(2, 'Změna role (zájmen)', 'přechod: ' + [...allP].join(' → '));

  // 8 Jazykový (Anafora, Epifora, Aliterace, Paralelismus)
  let an = 0;
  for (let i=1; i<sentences.length; i++) {
    const w1 = (sentences[i-1].trim().split(/\s+/)[0] || '').toLowerCase();
    const w2 = (sentences[i].trim().split(/\s+/)[0] || '').toLowerCase();
    if (w1.length > 1 && w1 === w2) an++;
  }
  if (an >= 2) hit(8, 'Anafora', an+'× stejné začátky vět');
  let ep = 0;
  for (let i=1; i<sentences.length; i++) {
    const a = sentences[i-1].trim().split(/\s+/);
    const b = sentences[i].trim().split(/\s+/);
    const wa = (a[a.length-1] || '').toLowerCase().replace(/[.!?,;]/g, '');
    const wb = (b[b.length-1] || '').toLowerCase().replace(/[.!?,;]/g, '');
    if (wa.length > 1 && wa === wb) ep++;
  }
  if (ep >= 2) hit(8, 'Epifora', ep+'× stejné konce vět');
  let al = false;
  sentences.forEach(s => {
    const ws = s.split(/\s+/).map(w => w.toLowerCase().replace(/[^a-záčďéěíňóřšťůúýž]/g, ''));
    const ic = {};
    ws.forEach(w => { if (w.length > 1) ic[w[0]] = (ic[w[0]] || 0) + 1; });
    if (Object.values(ic).some(c => c >= 3)) al = true;
  });
  if (al) hit(8, 'Aliterace', '3+ slov se stejným písmenem v větě');
  let par = 0;
  for (let i=1; i<sentences.length; i++) {
    const la = sentences[i-1].split(/\s+/).length, lb = sentences[i].split(/\s+/).length;
    if (Math.abs(la-lb) <= 2 && la >= 3 && lb >= 3) par++;
  }
  if (par >= 3) hit(8, 'Paralelismus', par+' větné páry podobné délky');

  // 3 Změna tempa
  const lens = sentences.map(s => s.split(/\s+/).length);
  if (lens.length >= 3) {
    const mx = Math.max(...lens), mn = Math.min(...lens);
    if (mx / Math.max(mn, 1) >= 4) hit(3, 'Změna tempa vět', `délky: ${mn}–${mx} slov`);
  }

  // 5 Kontrast
  const pos = /\b(krásný|dobrý|šťastný|radost|úspěch|láska|naděje|světlo|skvělý|milý)\b/i;
  const neg = /\b(ošklivý|špatný|smutný|smutek|neúspěch|nenávist|beznaděj|tma|strašný|hrozný)\b/i;
  let ct = 0;
  for (let i=1; i<sentences.length; i++) {
    if ((pos.test(sentences[i-1]) && neg.test(sentences[i])) || (neg.test(sentences[i-1]) && pos.test(sentences[i]))) ct++;
  }
  if (ct >= 1) hit(5, 'Kontrast (sémantický)', ct+'× protikladné věty');

  // 7 Gradace / změna času
  let gu = 0, gd = 0;
  for (let i=2; i<lens.length; i++) {
    if (lens[i] > lens[i-1] && lens[i-1] > lens[i-2]) gu++;
    if (lens[i] < lens[i-1] && lens[i-1] < lens[i-2]) gd++;
  }
  if (gu >= 2 || gd >= 2) hit(7, 'Gradace (délka vět)', gu>=2 ? `narůstající ${gu}×` : `klesající ${gd}×`);
  const hp = /\b\w+(al|ala|alo|ali|aly|byl|byla|bylo)\b/i.test(fullText);
  const hpr = /\b(je\b|jsou\b|má\b|mám\b|jde\b|říká)\b/i.test(fullText);
  const hf = /\b(bude\b|budu\b|budeme\b|budou\b)\b/i.test(fullText);
  if ([hp, hpr, hf].filter(Boolean).length >= 2) hit(7, 'Změna času', 'přechod časů v textu');

  // 9 Přeskok
  for (let i=1; i<sentences.length; i++) {
    const la = sentences[i-1].split(/\s+/).length, lb = sentences[i].split(/\s+/).length;
    if (Math.abs(la-lb) > 15 && lb < 4) hit(9, 'Přeskok (náhlá změna)', sentences[i].slice(0,35));
  }

  // 11 Asyndeton, Prolínání, Hapax
  let as = 0;
  for (let i=1; i<sentences.length; i++) {
    if (sentences[i-1].split(/\s+/).length <= 5 && sentences[i].split(/\s+/).length <= 5 && !/^(a\b|nebo\b|ale\b)/i.test(sentences[i].trim())) as++;
  }
  if (as >= 3) hit(11, 'Asyndeton', as+'× krátké věty bez spojky');
  const mi = (fl.match(/\b(tady|tam|zde|venku|uvnitř|nahoru|dolů|nahoře|dole|daleko|blízko)\b/g) || []);
  const ca = (fl.match(/\b(dnes|včera|zítra|teď|nyní|tehdy|dávno|brzy|najednou|jednou)\b/g) || []);
  if (mi.length >= 2 && ca.length >= 2) hit(11, 'Prolínání míst a časů', mi.length+'× místo, '+ca.length+'× čas');
  if (words.length > 50) {
    const hapax = Object.entries(wfreq).filter(([w,c]) => c === 1 && w.length > 5 && !STOP.has(w));
    const ratio = hapax.length / words.length;
    if (ratio > 0.7) hit(11, 'Hapax legomena', hapax.length + ' unikátních slov ('+Math.round(ratio*100)+'%)');
  }

  return R;
}

function analyzeText(text) {
  if (!text || !text.trim()) return null;
  const sentences = splitVety(text);
  const micro = [];
  sentences.forEach((s, si) => detectMicro(s, si).forEach(h => micro.push(h)));
  const macro = detectMakro(sentences, text);
  const allHits = [...micro, ...macro];

  const scores = UHLY.map(u => {
    const hits = allHits.filter(h => h.uhel === u.i);
    const mc = hits.filter(h => h.type === 'mikro').length;
    const xc = hits.filter(h => h.type === 'makro').length;
    const maxM = u.mikro.length * sentences.length;
    const maxX = u.makro.length;
    const total = maxM + maxX;
    const pct = total > 0 ? Math.min(100, Math.round((mc + xc) / total * 100)) : 0;
    return { uhel: u.i, hits, pct, mc, xc };
  });

  const percentages = scores.map(s => s.pct);
  const dominant = scores
    .map((s, i) => ({ pct: s.pct, i }))
    .sort((a, b) => b.pct - a.pct)
    .filter(item => item.pct > 0)
    .slice(0, 3)
    .map(item => item.i);

  return {
    percentages,
    dominant,
    hits: allHits,
    sentences,
    fullText: text
  };
}

// Funkce pro podbarvení textu – vrací HTML s barevnými segmenty podle dominantního úhlu věty
function highlightText(analysis) {
  if (!analysis) return '';
  const { sentences, hits, fullText } = analysis;
  let html = fullText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>');
  const sentHits = {};
  hits.filter(h => h.si >= 0).forEach(h => {
    if (!sentHits[h.si]) sentHits[h.si] = [];
    sentHits[h.si].push(h);
  });
  sentences.forEach((s, si) => {
    if (!sentHits[si]) return;
    const counts = {};
    sentHits[si].forEach(h => counts[h.uhel] = (counts[h.uhel] || 0) + 1);
    const topUhel = parseInt(Object.entries(counts).sort((a,b) => b[1]-a[1])[0][0]);
    const u = UHLY[topUhel];
    const color = u.barva + '40';
    const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const figList = [...new Set(sentHits[si].map(h => h.fig))].join(', ');
    html = html.replace(esc, `<span style="background:${color}; padding:2px 0;" title="${u.nazev}: ${figList}">${esc}</span>`);
  });
  return html;
}
