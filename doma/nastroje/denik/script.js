(function(){
  "use strict";

  // ---------- DATA KARET ----------
  const CARDS_DATA = {
    "myš": { ilustrace: "doma/ilustrace/mys.jpg", text:"chceš myš ??",
      uhly: {"absurdní":"nabídka která mate měřítka","jazykový":"zvíře i myšlenka tělo i idea","ironický":"detail který drží svět","filozofický":"čeho si nevšimne myš - nestalo se","naivní":"myslela jsem že se bude hodit","groteskní":"možná se jen houpe hlavou dolů visí za ocas a hraje si a tím mění pravidla","kulturní":"symbol ticha v nabídce","introspektivní":"navazuje kontakt","surrealistický":"otázka je dárek"},
      odkaz: "https://artmisanovak-prog.github.io/chces-mys/doma/data/uhly/mys_uhly.html",
      vzor: [] // plná čára
    },
    "kocour": { ilustrace: "doma/ilustrace/kocour.jpg", text:"kocour sežral dvě berušky a půl hodiny krkal tečky",
      uhly: {"absurdní":"trávení interpunkce","jazykový":"tečka jako vedlejší produkt věty","ironický":"přesnost tam kde na ní nezáleží","filozofický":"náhoda která se tváří jako pravidlo","naivní":"prostě se to stalo","groteskní":"statistiky trávení","kulturní":"počítání jako tik","introspektivní":"nemůžu to zastavit jen sledovat","surrealistický":"čísla vycházející z tlamy"},
      odkaz: "https://artmisanovak-prog.github.io/chces-mys/doma/data/uhly/kocour_uhly.html",
      vzor: [8, 4] // čárkovaná
    },
    "zajíc": { ilustrace: "doma/ilustrace/zajic.jpg", text:"zajíc co prošel ohněm", uhly: {"absurdní":"oheň který nefunguje","jazykový":"negace přísloví","ironický":"odolnost tam kde se čeká slabost","filozofický":"podstata nezávislá na prostředí","naivní":"oběť která nehoří","groteskní":"zajíc není palivo","kulturní":"stereotyp naruby","introspektivní":"žádný oheň nepálí stejně","surrealistický":"skok skrz nemožné"}, odkaz:"", vzor: [2, 2] }, // tečkovaná
    "ryba": { ilustrace: "doma/ilustrace/ryba.jpg", text:"rybí rap", uhly: {"absurdní":"hudba bez plic","jazykový":"rytmus místo slov","ironický":"projev slyšitelný jen pod hladinou","filozofický":"komunikace která nepotřebuje porozumění","naivní":"prostě to plyne","groteskní":"flow bez vzduchu","kulturní":"underground doslova","introspektivní":"mluvím i když mě nikdo neposlouchá","surrealistický":"beat z bublin"}, odkaz: "https://artmisanovak-prog.github.io/chces-mys/doma/data/uhly/ryba_uhly.html", vzor: [] }, // plná (prozatím)
    "páv": { ilustrace: "doma/ilustrace/pav.jpg", text:"oko za okem. páv za pávem", uhly: {"absurdní":"soutěž pohledů bez poroty","jazykový":"redundance jako ornament","ironický":"okázalost která sleduje sama sebe","filozofický":"identita vzniká z nekonečného zrcadlení","naivní":"čím víc očí tím líp","groteskní":"narcismus s peřím","kulturní":"estetika přebytku","introspektivní":"dívám se na sebe abych si byl jistý že existuji","surrealistický":"oči které se rozmnožují"}, odkaz:"", vzor: [12, 6, 3, 6] }, // čárka-tečka
    "netopýr": { ilustrace: "doma/ilustrace/netopyr.jpg", text:"netopýří glamour", uhly: {"absurdní":"elegance závislá na tmě","jazykový":"přídavné jméno platné jen v noci","ironický":"to co fascinuje po tmě se za světla omlouvá","filozofický":"hodnota věcí se mění s osvětlením","naivní":"ve tmě jsem hezčí","groteskní":"glamour s blánami","kulturní":"estetika outsiderů","introspektivní":"mám verzi sebe kterou ukazuji jen nocím","surrealistický":"šperk který se rozpadne při svítání"}, odkaz:"", vzor: [] },
    "motýl": { ilustrace: "doma/ilustrace/motyl.jpg", text:"motýl v břiše", uhly: {"absurdní":"emoce bez kalorií","jazykový":"metafora, která selhala","ironický":"romantika bez užitku","filozofický":"pocit není zdroj","naivní":"myslela jsem, že to stačí","groteskní":"dieta z emocí","kulturní":"demontáž klišé","introspektivní":"něco cítím, ale nestačí to","surrealistický":"létání v prázdném žaludku"}, odkaz:"", vzor: [] },
    "pavouk": { ilustrace: "doma/ilustrace/pavouk.jpg", text:"pavouk čeká", uhly: {"absurdní":"pauza která se odmítá stát pokračováním","jazykový":"věta bez slovesa","ironický":"struktura bez děje","filozofický":"stav mezi začátkem a koncem","naivní":"ono se to nějak vyřeší","groteskní":"architektura váhání","kulturní":"estetika nedokončení","introspektivní":"nechávám věci být otevřené","surrealistický":"čas zachycený ve vlákně"}, odkaz:"", vzor: [] },
    "krokodýl": { ilustrace: "doma/ilustrace/krokodyl.jpg", text:"krokodýlí slzy", uhly: {"absurdní":"totální výprodej falešných slz","jazykový":"reklama jako vyznání","ironický":"emoce zlevněná na nulu","filozofický":"hodnota citů v tržní logice","naivní":"proč by si děti nemohly koupit balíček slz na hraní","groteskní":"marketing empatie","kulturní":"cynismus zabalený do slevy","introspektivní":"falešný pláč výhodně","surrealistický":"hypermarket predátorů"}, odkaz:"", vzor: [] }
  };

  const ANGLE_NAMES = UHLY.map(u => u.nazev.toLowerCase());
  const ANGLE_COLORS = UHLY.map(u => u.barva);

  let currentCards = ["myš","kocour","zajíc"];
  let currentAnalysis = null;
  let diaryEntries = [];
  let currentEntryId = null;
  let animInterval = null;

  // DOM
  const cardsBlock = document.getElementById('cardsBlock');
  const diaryEntry = document.getElementById('diaryEntry');
  const analysisSection = document.getElementById('analysisSection');
  const angleBars = document.getElementById('angleBars');
  const dominantInfo = document.getElementById('dominantInfo');
  const highlightedTextDiv = document.getElementById('highlightedText');
  const entriesList = document.getElementById('entriesList');
  const historyDetail = document.getElementById('historyDetail');
  const wheelCanvas = document.getElementById('angleWheel');
  const wheelInfo = document.getElementById('wheelInfo');
  const themeOptions = document.querySelectorAll('.theme-option');
  const chartCanvas = document.getElementById('historyChart');
  const ctxChart = chartCanvas.getContext('2d');
  const filterCard = document.getElementById('filterCard');
  const filterAngle = document.getElementById('filterAngle');
  const animateBtn = document.getElementById('animateBtn');

  // ---------- TÉMATA ----------
  function setTheme(name) {
    document.body.className = `theme-${name}`;
    themeOptions.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === name));
    localStorage.setItem('mys-theme', name);
  }
  themeOptions.forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
  setTheme(localStorage.getItem('mys-theme') || 'krb');

  // ---------- HORNÍ ÚHLOMĚR ----------
  function drawWheel(percentages) {
    const ctx = wheelCanvas.getContext('2d');
    const w=280, h=280, cx=140, cy=140, r=125;
    ctx.clearRect(0,0,w,h);
    UHLY.forEach((u,i) => {
      const start = i*Math.PI/6 - Math.PI/2, end = start + Math.PI/6;
      const fill = percentages ? r * (percentages[i]/100) : 0;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,fill,start,end); ctx.closePath();
      ctx.fillStyle = u.barva + 'c0'; ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy,r,start,end); ctx.strokeStyle = u.barva; ctx.lineWidth = 1.5; ctx.stroke();
      const mid = start + Math.PI/12;
      const tx = cx + Math.cos(mid)*80, ty = cy + Math.sin(mid)*80;
      ctx.save(); ctx.translate(tx,ty); ctx.rotate(mid+Math.PI/2);
      ctx.fillStyle = 'var(--cream)'; ctx.font = '400 9px "DM Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(u.nazev,0,0); ctx.restore();
    });
  }
  drawWheel();
  wheelCanvas.addEventListener('click', (e) => {
    const rect = wheelCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 140, y = e.clientY - rect.top - 140;
    let angle = (Math.atan2(y,x)+2*Math.PI+Math.PI/2) % (2*Math.PI);
    const idx = Math.floor(angle / (Math.PI/6));
    const u = UHLY[idx];
    wheelInfo.innerHTML = `<strong style="color:${u.barva}">${u.nazev} (${u.st}°)</strong><br>${u.popis || ''}`;
    if (currentAnalysis) {
      highlightedTextDiv.innerHTML = `<span style="background:${u.barva}40;padding:2px 0">${currentAnalysis.fullText.replace(/\n/g,'<br>')}</span>`;
    }
  });

  // ---------- KARTY ----------
  function renderCards() {
    cardsBlock.innerHTML = '';
    currentCards.forEach(cardId => {
      const card = CARDS_DATA[cardId];
      const wrap = document.createElement('div'); wrap.className = 'card-wrapper';
      wrap.innerHTML = `<div class="card"><div class="card-img" style="background-image:url('${card.ilustrace}')"></div></div>`;
      wrap.addEventListener('click', (e) => { e.stopPropagation(); if (card.odkaz) window.open(card.odkaz, '_blank'); });
      cardsBlock.appendChild(wrap);
    });
  }

  // ---------- ANALÝZA ----------
  function performAnalysis() {
    const text = diaryEntry.value.trim(); if (!text) return;
    const analysis = analyzeText(text); if (!analysis) return;
    currentAnalysis = analysis; displayAnalysis();
  }
  function displayAnalysis() {
    const { percentages, dominant, fullText, sentences } = currentAnalysis;
    angleBars.innerHTML = ANGLE_NAMES.map((n,i) => `<div class="angle-item"><span class="color-dot" style="background:${ANGLE_COLORS[i]}"></span>${n}: ${percentages[i]}%</div>`).join('');
    dominantInfo.textContent = `Dominantní úhly: ${dominant.map(i => ANGLE_NAMES[i]).join(', ') || 'žádný'}`;
    highlightedTextDiv.innerHTML = highlightText(currentAnalysis);
    document.getElementById('analysisStats').textContent = `${fullText.split(/\s+/).length} slov · ${sentences.length} vět`;
    analysisSection.style.display = 'block'; drawWheel(percentages);
    analysisSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- UKLÁDÁNÍ ----------
  function saveEntry() {
    const text = diaryEntry.value.trim(); if (!text || !currentAnalysis) return alert('Analyzuj text.');
    const title = prompt('Název:', currentEntryId ? 'Upravený' : 'Zápis '+new Date().toLocaleString());
    if (title === null) return;
    const entry = {
      id: currentEntryId || Date.now()+'-'+Math.random().toString(36),
      date: new Date().toISOString(),
      title: title || 'Bez názvu',
      text,
      cards: [...currentCards],
      dominantAngles: currentAnalysis.dominant,
      percentages: currentAnalysis.percentages
    };
    const idx = diaryEntries.findIndex(e => e.id === entry.id);
    if (idx >= 0) diaryEntries[idx] = entry; else diaryEntries.push(entry);
    localStorage.setItem('mys-diary', JSON.stringify(diaryEntries));
    updateHistoryView(); currentEntryId = null;

    // Odeslání do Kognitivní mapy (pokud je otevřená)
    if (window.kogMapaUlozit) {
      window.kogMapaUlozit({
        uhel: currentAnalysis.dominant[0] ?? 0,
        karta: currentCards.join(' + '),
        anomalie: '',
        text: text,
        analysis: dominantInfo.textContent
      });
    }
  }

  function loadEntries() { const s = localStorage.getItem('mys-diary'); if (s) diaryEntries = JSON.parse(s); }

  // ---------- HISTORIE (VZOROVANÉ ČÁRY) ----------
  function getFilteredEntries() {
    let filtered = diaryEntries;
    const cardF = filterCard.value, angleF = filterAngle.value;
    if (cardF) filtered = filtered.filter(e => e.cards.includes(cardF));
    if (angleF) filtered = filtered.filter(e => e.dominantAngles.includes(parseInt(angleF)));
    return filtered;
  }

  function drawChart() {
    const filtered = getFilteredEntries();
    const w = chartCanvas.width, h = chartCanvas.height;
    ctxChart.clearRect(0,0,w,h);
    if (!filtered.length) return;

    const barWidth = Math.max(12, Math.min(24, (w-40) / filtered.length / 3));
    const maxWords = Math.max(...filtered.map(e => e.text.split(/\s+/).length), 1);

    filtered.forEach((entry, i) => {
      const words = entry.text.split(/\s+/).length;
      const barHeight = Math.max(15, (words / maxWords) * (h-40));
      const mainAngle = entry.dominantAngles[0] ?? 0;
      const baseX = 20 + i * barWidth * 3;

      entry.cards.forEach((cardId, idx) => {
        const card = CARDS_DATA[cardId] || { vzor: [] };
        const x = baseX + idx * barWidth;
        ctxChart.fillStyle = ANGLE_COLORS[mainAngle] + 'cc';
        ctxChart.beginPath();
        ctxChart.rect(x, h-20-barHeight, barWidth-2, barHeight);
        ctxChart.fill();
        // vzor
        if (card.vzor && card.vzor.length) {
          ctxChart.save();
          ctxChart.beginPath();
          ctxChart.rect(x, h-20-barHeight, barWidth-2, barHeight);
          ctxChart.clip();
          ctxChart.strokeStyle = '#00000020';
          ctxChart.lineWidth = 1.5;
          ctxChart.setLineDash(card.vzor);
          for (let y = h-20-barHeight; y < h-20; y+=6) {
            ctxChart.beginPath();
            ctxChart.moveTo(x, y);
            ctxChart.lineTo(x+barWidth-2, y);
            ctxChart.stroke();
          }
          ctxChart.restore();
        }
      });

      if (i % Math.ceil(filtered.length/6) === 0) {
        ctxChart.fillStyle = 'var(--cream)';
        ctxChart.font = '8px "DM Mono"';
        ctxChart.fillText(new Date(entry.date).toLocaleDateString('cs-CZ').slice(0,5), baseX, h-5);
      }
    });
    ctxChart.setLineDash([]);
  }

  function populateFilters() {
    const cardSet = new Set(diaryEntries.flatMap(e=>e.cards));
    filterCard.innerHTML = '<option value="">Filtrovat podle karty...</option>';
    cardSet.forEach(c => { const opt = document.createElement('option'); opt.value = c; opt.textContent = c; filterCard.appendChild(opt); });
    const angleSet = new Set(diaryEntries.flatMap(e=>e.dominantAngles));
    filterAngle.innerHTML = '<option value="">Filtrovat podle úhlu...</option>';
    angleSet.forEach(a => { const u = UHLY[a]; if(u) { const opt = document.createElement('option'); opt.value = a; opt.textContent = u.nazev; filterAngle.appendChild(opt); }});
  }

  function renderEntriesList() {
    const filtered = getFilteredEntries();
    entriesList.innerHTML = '';
    filtered.slice().reverse().forEach(entry => {
      const item = document.createElement('div'); item.className = 'entry-item';
      item.innerHTML = `<div class="entry-header"><span class="entry-title">${entry.title}</span><span class="entry-date">${new Date(entry.date).toLocaleString()}</span></div>
        <div class="entry-cards">${entry.cards.map(c => `<span class="entry-card-badge">${c}</span>`).join('')}</div>
        <div class="entry-preview">${entry.text.slice(0,80)}…</div>`;
      item.addEventListener('click', () => { diaryEntry.value = entry.text; currentCards = entry.cards; renderCards(); currentEntryId = entry.id; historyDetail.style.display = 'none'; });
      entriesList.appendChild(item);
    });
  }

  function updateStats() {
    if (!diaryEntries.length) {
      document.getElementById('topAngle').textContent = '—';
      document.getElementById('topCard').textContent = '—';
      document.getElementById('avgWords').textContent = '—';
      return;
    }
    const angleCounts = {}; diaryEntries.forEach(e => e.dominantAngles.forEach(a => angleCounts[a] = (angleCounts[a]||0)+1));
    const topA = Object.entries(angleCounts).sort((a,b)=>b[1]-a[1])[0];
    document.getElementById('topAngle').textContent = topA ? UHLY[topA[0]].nazev : '—';
    const cardCounts = {}; diaryEntries.forEach(e => e.cards.forEach(c => cardCounts[c] = (cardCounts[c]||0)+1));
    const topC = Object.entries(cardCounts).sort((a,b)=>b[1]-a[1])[0];
    document.getElementById('topCard').textContent = topC ? topC[0] : '—';
    const avg = Math.round(diaryEntries.reduce((s,e)=>s+e.text.split(/\s+/).length,0)/diaryEntries.length);
    document.getElementById('avgWords').textContent = avg;
  }

  function updateHistoryView() {
    drawChart();
    populateFilters();
    renderEntriesList();
    updateStats();
  }

  function animateChart() {
    if (animInterval) { clearInterval(animInterval); animInterval = null; animateBtn.textContent = '▶ Animovat vývoj'; return; }
    const filtered = getFilteredEntries();
    if (!filtered.length) return;
    let index = 0;
    animateBtn.textContent = '⏹ Zastavit';
    animInterval = setInterval(() => {
      if (index >= filtered.length) { clearInterval(animInterval); animInterval = null; animateBtn.textContent = '▶ Animovat vývoj'; return; }
      const w = chartCanvas.width, h = chartCanvas.height;
      ctxChart.clearRect(0,0,w,h);
      const barWidth = Math.max(12, Math.min(24, (w-40) / filtered.length / 3));
      const maxWords = Math.max(...filtered.map(e => e.text.split(/\s+/).length), 1);
      for (let i=0; i<=index; i++) {
        const entry = filtered[i];
        const words = entry.text.split(/\s+/).length;
        const barHeight = Math.max(15, (words / maxWords) * (h-40));
        const mainAngle = entry.dominantAngles[0] ?? 0;
        const baseX = 20 + i * barWidth * 3;
        entry.cards.forEach((cardId, j) => {
          const card = CARDS_DATA[cardId] || { vzor: [] };
          const x = baseX + j * barWidth;
          ctxChart.fillStyle = ANGLE_COLORS[mainAngle] + 'cc';
          ctxChart.fillRect(x, h-20-barHeight, barWidth-2, barHeight);
          if (card.vzor && card.vzor.length) {
            ctxChart.save();
            ctxChart.beginPath();
            ctxChart.rect(x, h-20-barHeight, barWidth-2, barHeight);
            ctxChart.clip();
            ctxChart.strokeStyle = '#00000020';
            ctxChart.lineWidth = 1.5;
            ctxChart.setLineDash(card.vzor);
            for (let y = h-20-barHeight; y < h-20; y+=6) {
              ctxChart.beginPath();
              ctxChart.moveTo(x, y);
              ctxChart.lineTo(x+barWidth-2, y);
              ctxChart.stroke();
            }
            ctxChart.restore();
          }
        });
      }
      index++;
    }, 200);
  }

  // ---------- INIT ----------
  function init() {
    loadEntries(); renderCards(); updateHistoryView();
    document.getElementById('shuffleCards').addEventListener('click', ()=>{
      const ids=Object.keys(CARDS_DATA); currentCards=[ids[Math.floor(Math.random()*ids.length)], ids[Math.floor(Math.random()*ids.length)], ids[Math.floor(Math.random()*ids.length)]];
      renderCards();
    });
    document.getElementById('analyzeBtn').addEventListener('click', performAnalysis);
    document.getElementById('saveBtn').addEventListener('click', saveEntry);
    document.getElementById('newEntryBtn').addEventListener('click', ()=>{
      if(confirm('Smazat aktuální text?')){ diaryEntry.value=''; analysisSection.style.display='none'; currentAnalysis=null; currentEntryId=null; drawWheel(); }
    });
    document.getElementById('lockShareBtn').addEventListener('click', ()=>{
      const url=new URL(window.location); url.searchParams.set('cards', currentCards.join(','));
      navigator.clipboard?.writeText(url.toString()); alert('Odkaz na sadu karet zkopírován.');
    });
    document.getElementById('shareEntryBtn').addEventListener('click', ()=>{
      if(!currentAnalysis) return; const data={text:diaryEntry.value, cards:currentCards, analysis:currentAnalysis};
      const url=new URL(window.location); url.searchParams.set('shared', encodeURIComponent(JSON.stringify(data)));
      navigator.clipboard?.writeText(url.toString()); alert('Odkaz na zápis zkopírován.');
    });
    document.getElementById('printEntryBtn').addEventListener('click', ()=>{
      if(!currentAnalysis) return; const w=window.open('','','width=800,height=600');
      w.document.write(`<pre>${diaryEntry.value}</pre><hr><pre>${JSON.stringify(currentAnalysis.percentages,null,2)}</pre>`);
      w.document.close(); w.print();
    });
    document.getElementById('openMapBtn').addEventListener('click', ()=>{
      window.open('kognitivni_mapa.html', '_blank');
    });
    filterCard.addEventListener('change', updateHistoryView);
    filterAngle.addEventListener('change', updateHistoryView);
    document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', function(){
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
      filterCard.value = ''; filterAngle.value = '';
      updateHistoryView();
    }));
    animateBtn.addEventListener('click', animateChart);
    const params = new URLSearchParams(window.location.search);
    if(params.has('cards')){ const ids=params.get('cards').split(',').map(s=>s.trim()).filter(id=>CARDS_DATA[id]); if(ids.length===3) currentCards=ids; renderCards(); }
    if(params.has('shared')){ try{ const shared=JSON.parse(decodeURIComponent(params.get('shared'))); diaryEntry.value=shared.text; currentCards=shared.cards; renderCards(); if(shared.analysis){ currentAnalysis=shared.analysis; displayAnalysis(); } }catch(e){} }
  }
  init();
})();
