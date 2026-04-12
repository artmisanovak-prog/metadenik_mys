(function(){
  "use strict";

  // ---------- DATA KARET (všech 9) ----------
  const CARDS_DATA = {
    "myš": {
      id: "myš", ilustrace: "doma/ilustrace/mys.jpg", text: "chceš myš ??",
      uhly: {
        "absurdní": "nabídka která mate měřítka", "jazykový": "zvíře i myšlenka tělo i idea",
        "ironický": "detail který drží svět", "filozofický": "čeho si nevšimne myš - nestalo se",
        "naivní": "myslela jsem že se bude hodit", "groteskní": "možná se jen houpe hlavou dolů visí za ocas a hraje si a tím mění pravidla",
        "kulturní": "symbol ticha v nabídce", "introspektivní": "navazuje kontakt",
        "surrealistický": "otázka je dárek"
      }
    },
    "kocour": {
      id: "kocour", ilustrace: "doma/ilustrace/kocour.jpg", text: "kocour sežral dvě berušky a půl hodiny krkal tečky",
      uhly: {
        "absurdní": "trávení interpunkce", "jazykový": "tečka jako vedlejší produkt věty",
        "ironický": "přesnost tam kde na ní nezáleží", "filozofický": "náhoda která se tváří jako pravidlo",
        "naivní": "prostě se to stalo", "groteskní": "statistiky trávení",
        "kulturní": "počítání jako tik", "introspektivní": "nemůžu to zastavit jen sledovat",
        "surrealistický": "čísla vycházející z tlamy"
      }
    },
    "zajíc": {
      id: "zajíc", ilustrace: "doma/ilustrace/zajic.jpg", text: "zajíc co prošel ohněm",
      uhly: {
        "absurdní": "oheň který nefunguje", "jazykový": "negace přísloví",
        "ironický": "odolnost tam kde se čeká slabost", "filozofický": "podstata nezávislá na prostředí",
        "naivní": "oběť která nehoří", "groteskní": "zajíc není palivo",
        "kulturní": "stereotyp naruby", "introspektivní": "žádný oheň nepálí stejně",
        "surrealistický": "skok skrz nemožné"
      }
    },
    "ryba": {
      id: "ryba", ilustrace: "doma/ilustrace/ryba.jpg", text: "rybí rap",
      uhly: {
        "absurdní": "hudba bez plic", "jazykový": "rytmus místo slov",
        "ironický": "projev slyšitelný jen pod hladinou", "filozofický": "komunikace která nepotřebuje porozumění",
        "naivní": "prostě to plyne", "groteskní": "flow bez vzduchu",
        "kulturní": "underground doslova", "introspektivní": "mluvím i když mě nikdo neposlouchá",
        "surrealistický": "beat z bublin"
      }
    },
    "páv": {
      id: "páv", ilustrace: "doma/ilustrace/pav.jpg", text: "oko za okem. páv za pávem",
      uhly: {
        "absurdní": "soutěž pohledů bez poroty", "jazykový": "redundance jako ornament",
        "ironický": "okázalost která sleduje sama sebe", "filozofický": "identita vzniká z nekonečného zrcadlení",
        "naivní": "čím víc očí tím líp", "groteskní": "narcismus s peřím",
        "kulturní": "estetika přebytku", "introspektivní": "dívám se na sebe abych si byl jistý že existuji",
        "surrealistický": "oči které se rozmnožují"
      }
    },
    "netopýr": {
      id: "netopýr", ilustrace: "doma/ilustrace/netopyr.jpg", text: "netopýří glamour",
      uhly: {
        "absurdní": "elegance závislá na tmě", "jazykový": "přídavné jméno platné jen v noci",
        "ironický": "to co fascinuje po tmě se za světla omlouvá", "filozofický": "hodnota věcí se mění s osvětlením",
        "naivní": "ve tmě jsem hezčí", "groteskní": "glamour s blánami",
        "kulturní": "estetika outsiderů", "introspektivní": "mám verzi sebe kterou ukazuji jen nocím",
        "surrealistický": "šperk který se rozpadne při svítání"
      }
    },
    "motýl": {
      id: "motýl", ilustrace: "doma/ilustrace/motyl.jpg", text: "motýl v břiše",
      uhly: {
        "absurdní": "emoce bez kalorií", "jazykový": "metafora, která selhala",
        "ironický": "romantika bez užitku", "filozofický": "pocit není zdroj",
        "naivní": "myslela jsem, že to stačí", "groteskní": "dieta z emocí",
        "kulturní": "demontáž klišé", "introspektivní": "něco cítím, ale nestačí to",
        "surrealistický": "létání v prázdném žaludku"
      }
    },
    "pavouk": {
      id: "pavouk", ilustrace: "doma/ilustrace/pavouk.jpg", text: "pavouk čeká",
      uhly: {
        "absurdní": "pauza která se odmítá stát pokračováním", "jazykový": "věta bez slovesa",
        "ironický": "struktura bez děje", "filozofický": "stav mezi začátkem a koncem",
        "naivní": "ono se to nějak vyřeší", "groteskní": "architektura váhání",
        "kulturní": "estetika nedokončení", "introspektivní": "nechávám věci být otevřené",
        "surrealistický": "čas zachycený ve vlákně"
      }
    },
    "krokodýl": {
      id: "krokodýl", ilustrace: "doma/ilustrace/krokodyl.jpg", text: "krokodýlí slzy",
      uhly: {
        "absurdní": "totální výprodej falešných slz", "jazykový": "reklama jako vyznání",
        "ironický": "emoce zlevněná na nulu", "filozofický": "hodnota citů v tržní logice",
        "naivní": "proč by si děti nemohly koupit balíček slz na hraní", "groteskní": "marketing empatie",
        "kulturní": "cynismus zabalený do slevy", "introspektivní": "falešný pláč výhodně",
        "surrealistický": "hypermarket predátorů"
      }
    }
  };

  const ANGLE_NAMES = UHLY.map(u => u.nazev.toLowerCase());
  const ANGLE_COLORS = UHLY.map(u => u.barva);

  // Stav
  let currentCards = ["myš", "kocour", "zajíc"];
  let currentAnalysis = null;
  let diaryEntries = [];
  let currentEntryId = null;

  // DOM
  const cardsBlock = document.getElementById('cardsBlock');
  const uhlomersRow = document.getElementById('uhlomersRow');
  const diaryEntry = document.getElementById('diaryEntry');
  const analysisResults = document.getElementById('analysisResults');
  const angleBars = document.getElementById('angleBars');
  const dominantInfo = document.getElementById('dominantInfo');
  const highlightedTextDiv = document.getElementById('highlightedText');
  const timelineStrip = document.getElementById('timelineStrip');
  const historyDetail = document.getElementById('historyDetail');
  const wheelCanvas = document.getElementById('angleWheel');
  const wheelInfo = document.getElementById('wheelInfo');
  const themeOptions = document.querySelectorAll('.theme-option');

  // ---------- TÉMATA ----------
  function setTheme(name) {
    document.body.className = `theme-${name}`;
    themeOptions.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === name));
    localStorage.setItem('mys-theme', name);
  }
  themeOptions.forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
  setTheme(localStorage.getItem('mys-theme') || 'krb');

  // ---------- KARTY A ÚHLOMĚRY ----------
  function renderCards() {
    cardsBlock.innerHTML = '';
    uhlomersRow.innerHTML = '';
    currentCards.forEach(cardId => {
      const card = CARDS_DATA[cardId];
      const wrap = document.createElement('div'); wrap.className = 'card-wrapper';
      wrap.innerHTML = `<div class="card"><div class="card-img" style="background-image:url('${card.ilustrace}')"></div></div>`;
      cardsBlock.appendChild(wrap);

      const uWrap = document.createElement('div'); uWrap.className = 'uhlomer-wrapper';
      uWrap.dataset.cardId = cardId;
      uWrap.innerHTML = `<div class="uhlomer" id="uhlomer-${cardId}"></div><div class="inspire-sentence" id="inspire-${cardId}"></div>`;
      uhlomersRow.appendChild(uWrap);
    });
    cardsBlock.onclick = () => {
      cardsBlock.classList.toggle('active');
      if (cardsBlock.classList.contains('active')) {
        currentCards.forEach(cid => buildUhlomer(cid, true));
      }
    };
  }

  function buildUhlomer(cardId, randomize) {
    const uWrap = document.querySelector(`.uhlomer-wrapper[data-card-id="${cardId}"]`);
    if (!uWrap) return;
    const uhlomerDiv = uWrap.querySelector('.uhlomer');
    const inspireDiv = uWrap.querySelector('.inspire-sentence');
    if (uhlomerDiv.children.length) return;
    const card = CARDS_DATA[cardId];
    const uhly = card.uhly;
    const available = Object.keys(uhly).filter(k => uhly[k]?.trim());
    let selected = 0;
    if (randomize && available.length) {
      const rand = available[Math.floor(Math.random() * available.length)];
      selected = ANGLE_NAMES.indexOf(rand);
    }
    for (let i = 0; i < 12; i++) {
      const angle = ANGLE_NAMES[i];
      const seg = document.createElement('div');
      seg.className = `segment seg-${i}`;
      seg.style.backgroundColor = ANGLE_COLORS[i];
      if (!uhly[angle]?.trim()) seg.classList.add('inactive');
      else {
        seg.addEventListener('click', (e) => {
          e.stopPropagation();
          inspireDiv.textContent = `${angle}: ${uhly[angle]}`;
          uhlomerDiv.querySelectorAll('.segment').forEach(s => s.classList.remove('active-segment'));
          seg.classList.add('active-segment');
        });
      }
      uhlomerDiv.appendChild(seg);
      if (i === selected && !seg.classList.contains('inactive')) {
        inspireDiv.textContent = `${angle}: ${uhly[angle]}`;
        seg.classList.add('active-segment');
      }
    }
  }

  // ---------- HORNÍ ÚHLOMĚR ----------
  function drawWheel(percentages) {
    const ctx = wheelCanvas.getContext('2d');
    const w = 220, h = 220, cx = 110, cy = 110, r = 95;
    ctx.clearRect(0, 0, w, h);
    UHLY.forEach((u, i) => {
      const start = i * Math.PI / 6 - Math.PI / 2;
      const end = start + Math.PI / 6;
      const fill = percentages ? r * (percentages[i] / 100) : 0;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, fill, start, end); ctx.closePath();
      ctx.fillStyle = u.barva + '80';
      ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, r, start, end); ctx.strokeStyle = u.barva; ctx.lineWidth = 1; ctx.stroke();
      const mid = start + Math.PI / 12;
      const tx = cx + Math.cos(mid) * 65, ty = cy + Math.sin(mid) * 65;
      ctx.save(); ctx.translate(tx, ty); ctx.rotate(mid + Math.PI / 2);
      ctx.fillStyle = '#2c2416'; ctx.font = '400 8px "DM Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(u.nazev, 0, 0); ctx.restore();
    });
  }
  drawWheel();

  wheelCanvas.addEventListener('click', (e) => {
    const rect = wheelCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 110, y = e.clientY - rect.top - 110;
    let angle = (Math.atan2(y, x) + 2 * Math.PI + Math.PI / 2) % (2 * Math.PI);
    const idx = Math.floor(angle / (Math.PI / 6));
    const u = UHLY[idx];
    wheelInfo.innerHTML = `<strong style="color:${u.barva}">${u.nazev} (${u.st}°)</strong><br>${u.popis || ''}`;
    if (currentAnalysis) {
      const color = u.barva + '40';
      const html = currentAnalysis.fullText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>');
      highlightedTextDiv.innerHTML = `<span style="background:${color}; padding:2px 0;">${html}</span>`;
    }
  });

  // ---------- ANALÝZA ----------
  function performAnalysis() {
    const text = diaryEntry.value.trim();
    if (!text) return;
    const analysis = analyzeText(text);
    if (!analysis) return;
    currentAnalysis = analysis;
    displayAnalysis();
  }

  function displayAnalysis() {
    const { percentages, dominant, fullText } = currentAnalysis;
    angleBars.innerHTML = ANGLE_NAMES.map((n, i) => `
      <div class="angle-item"><span class="color-dot" style="background:${ANGLE_COLORS[i]}"></span>${n}: ${percentages[i]}%</div>
    `).join('');
    dominantInfo.textContent = `Dominantní: ${dominant.map(i => ANGLE_NAMES[i]).join(', ') || 'žádný'}`;
    highlightedTextDiv.innerHTML = highlightText(currentAnalysis);
    analysisResults.style.display = 'block';
    drawWheel(percentages);
  }

  // ---------- UKLÁDÁNÍ ----------
  function saveEntry() {
    const text = diaryEntry.value.trim();
    if (!text || !currentAnalysis) return alert('Nejprve text analyzuj.');
    const title = prompt('Název zápisu:', currentEntryId ? 'Upravený' : 'Zápis ' + new Date().toLocaleString());
    if (title === null) return;
    const entry = {
      id: currentEntryId || Date.now() + '-' + Math.random().toString(36),
      date: new Date().toISOString(),
      title: title || 'Bez názvu',
      text,
      cards: [...currentCards],
      dominantAngles: currentAnalysis.dominant,
      percentages: currentAnalysis.percentages
    };
    const idx = diaryEntries.findIndex(e => e.id === entry.id);
    if (idx >= 0) diaryEntries[idx] = entry;
    else diaryEntries.push(entry);
    localStorage.setItem('mys-diary', JSON.stringify(diaryEntries));
    renderTimeline();
    currentEntryId = null;
  }

  function loadEntries() {
    const stored = localStorage.getItem('mys-diary');
    if (stored) diaryEntries = JSON.parse(stored);
  }

  function renderTimeline() {
    timelineStrip.innerHTML = '';
    diaryEntries.slice().reverse().forEach(entry => {
      const el = document.createElement('div'); el.className = 'timeline-entry';
      const angles = entry.dominantAngles || [];
      angles.forEach(idx => {
        const stripe = document.createElement('div'); stripe.className = 'color-stripe';
        stripe.style.backgroundColor = ANGLE_COLORS[idx];
        stripe.style.height = (100 / angles.length) + '%';
        el.appendChild(stripe);
      });
      el.addEventListener('click', () => showHistory(entry));
      timelineStrip.appendChild(el);
    });
  }

  function showHistory(entry) {
    historyDetail.style.display = 'block';
    historyDetail.innerHTML = `<strong>${entry.title}</strong> (${new Date(entry.date).toLocaleString()})<br>
      <p>${entry.text.slice(0, 200)}…</p>
      <button class="load-entry" data-id="${entry.id}">📂 Načíst</button>
      <button class="delete-entry" data-id="${entry.id}">🗑 Smazat</button>`;
  }

  document.addEventListener('click', e => {
    if (e.target.classList.contains('load-entry')) {
      const id = e.target.dataset.id;
      const entry = diaryEntries.find(e => e.id === id);
      if (entry) {
        diaryEntry.value = entry.text;
        currentCards = entry.cards;
        renderCards();
        currentEntryId = entry.id;
        historyDetail.style.display = 'none';
      }
    }
    if (e.target.classList.contains('delete-entry')) {
      const id = e.target.dataset.id;
      diaryEntries = diaryEntries.filter(e => e.id !== id);
      localStorage.setItem('mys-diary', JSON.stringify(diaryEntries));
      renderTimeline();
      historyDetail.style.display = 'none';
    }
  });

  // ---------- INICIALIZACE ----------
  function init() {
    loadEntries();
    renderCards();
    renderTimeline();
    document.getElementById('shuffleCards').addEventListener('click', () => {
      const ids = Object.keys(CARDS_DATA);
      currentCards = [
        ids[Math.floor(Math.random() * ids.length)],
        ids[Math.floor(Math.random() * ids.length)],
        ids[Math.floor(Math.random() * ids.length)]
      ];
      renderCards();
    });
    document.getElementById('analyzeBtn').addEventListener('click', performAnalysis);
    document.getElementById('saveBtn').addEventListener('click', saveEntry);
    document.getElementById('newEntryBtn').addEventListener('click', () => {
      if (confirm('Smazat aktuální text?')) {
        diaryEntry.value = '';
        analysisResults.style.display = 'none';
        currentAnalysis = null;
        currentEntryId = null;
      }
    });

    // Modální okno
    const modal = document.getElementById('writingModal');
    document.getElementById('openWritingModal').addEventListener('click', () => {
      document.getElementById('modalDiaryEntry').value = diaryEntry.value;
      modal.classList.add('active');
    });
    document.getElementById('closeModalBtn').addEventListener('click', () => modal.classList.remove('active'));
    document.getElementById('modalCloseDone').addEventListener('click', () => {
      diaryEntry.value = document.getElementById('modalDiaryEntry').value;
      modal.classList.remove('active');
    });
    document.getElementById('modalAnalyzeBtn').addEventListener('click', () => {
      diaryEntry.value = document.getElementById('modalDiaryEntry').value;
      performAnalysis();
      modal.classList.remove('active');
    });
    document.getElementById('modalSaveBtn').addEventListener('click', () => {
      diaryEntry.value = document.getElementById('modalDiaryEntry').value;
      saveEntry();
      modal.classList.remove('active');
    });

    // Sdílení sady
    document.getElementById('lockShareBtn').addEventListener('click', () => {
      const url = new URL(window.location);
      url.searchParams.set('cards', currentCards.join(','));
      navigator.clipboard?.writeText(url.toString());
      alert('Odkaz na sadu karet zkopírován.');
    });
    // Sdílení zápisu
    document.getElementById('shareEntryBtn').addEventListener('click', () => {
      if (!currentAnalysis) return;
      const data = { text: diaryEntry.value, cards: currentCards, analysis: currentAnalysis };
      const url = new URL(window.location);
      url.searchParams.set('shared', encodeURIComponent(JSON.stringify(data)));
      navigator.clipboard?.writeText(url.toString());
      alert('Odkaz na zápis zkopírován.');
    });
    // Tisk
    document.getElementById('printEntryBtn').addEventListener('click', () => {
      if (!currentAnalysis) return;
      const printWin = window.open('', '', 'width=800,height=600');
      printWin.document.write(`<pre>${diaryEntry.value}</pre><hr><pre>${JSON.stringify(currentAnalysis.percentages, null, 2)}</pre>`);
      printWin.document.close();
      printWin.print();
    });

    // Načtení parametrů z URL
    const params = new URLSearchParams(window.location.search);
    if (params.has('cards')) {
      const ids = params.get('cards').split(',').map(s => s.trim()).filter(id => CARDS_DATA[id]);
      if (ids.length === 3) currentCards = ids;
      renderCards();
    }
    if (params.has('shared')) {
      try {
        const shared = JSON.parse(decodeURIComponent(params.get('shared')));
        diaryEntry.value = shared.text;
        currentCards = shared.cards;
        renderCards();
        if (shared.analysis) {
          currentAnalysis = shared.analysis;
          displayAnalysis();
        }
      } catch (e) {}
    }
  }

  init();
})();
