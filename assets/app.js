(function(){
  const lang = document.body.dataset.lang, pt = lang === 'pt', base = document.body.dataset.base;
  const regionNames = new Intl.DisplayNames([pt ? 'pt-BR' : 'en'], {type:'region'});
  const country = c => { try { return c ? regionNames.of(c) : ''; } catch(e){ return c; } };
  const fmt = n => n.toLocaleString(pt ? 'pt-BR' : 'en-US');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // Lists on the secondary pages: text search plus category tabs
  document.querySelectorAll('[data-filter]').forEach(root => {
    const q = root.querySelector('[data-filter-q]'), tabs = [...root.querySelectorAll('[data-filter-kind]')], none = root.querySelector('.none');
    const grouped = root.hasAttribute('data-filter-group');
    const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const items = [...root.querySelectorAll('.item,.reason,.book,.term')].map(el => ({el, text: norm(el.textContent)}));
    let kind = '';
    function apply(){
      const term = norm(q.value.trim()); let shown = 0;
      items.forEach(i => {
        const k = grouped ? i.el.closest('.rsec').dataset.kind : i.el.dataset.kind;
        const on = (!kind || k === kind) && (!term || i.text.includes(term));
        i.el.hidden = !on; if(on) shown++;
      });
      if(grouped) root.querySelectorAll('.rsec').forEach(s => { s.hidden = !s.querySelector('.reason:not([hidden]),.book:not([hidden]),.term:not([hidden])'); });
      if(none) none.hidden = shown > 0;
    }
    q.addEventListener('input', apply);
    tabs.forEach(b => b.addEventListener('click', () => { kind = b.dataset.filterKind; tabs.forEach(t => { t.classList.toggle('on', t === b); t.setAttribute('aria-pressed', t === b); }); apply(); }));
  });

  if(!document.getElementById('tbody')) return;

  // ---------- directory ----------
  const L = pt ? {
    'Plant-based':'À base de plantas','Cultivated':'Cultivada','Precision fermentation':'Fermentação de precisão','Biomass fermentation':'Fermentação de biomassa','Fermentation-derived':'Derivada de fermentação','Traditional fermentation':'Fermentação tradicional','Plant molecular farming':'Agricultura molecular','Blended':'Híbrida',
    'Meat':'Carnes','Ingredients and inputs':'Ingredientes e insumos','Dairy':'Laticínios','Bioprocessing infrastructure and equipment':'Infraestrutura de bioprocessos','Seafood':'Pescados','Contract manufacturing/processing':'Fabricação terceirizada','Eggs':'Ovos','Food processing infrastructure and equipment':'Infraestrutura de processamento','Pet food':'Alimentos para pets','Human breast milk':'Leite humano','Honey':'Mel','Investors':'Investidores','Accelerators and incubators':'Aceleradoras e incubadoras',
    'Europe':'Europa','United States and Canada':'EUA e Canadá','Asia Pacific':'Ásia-Pacífico','Latin America':'América Latina','Africa/Middle East':'África e Oriente Médio','Australia/New Zealand':'Austrália e Nova Zelândia',
    'End product formulation and manufacturing':'Formulação e fabricação','Ingredient optimization':'Otimização de ingredientes','Bioprocess design':'Projeto de bioprocessos','Cell culture media':'Meios de cultura','Cell line development':'Linhagens celulares','Host strain development':'Cepas hospedeiras','Scaffolding and structure':'Suportes e estrutura','Crop development':'Desenvolvimento de cultivos','Feedstocks':'Matérias-primas','Target molecule selection':'Seleção de moléculas',
    'Ingredients':'Ingredientes','Ground meat/seafood':'Carne ou pescado moído','Other meat/seafood':'Outras carnes e pescados','Milk':'Leite','Other dairy':'Outros laticínios','Cheese':'Queijo','Whole muscle meat/seafood':'Cortes inteiros','Oils and fats':'Óleos e gorduras',
    'Beef/veal':'Bovino','Chicken':'Frango','Pork':'Suíno','Other fish':'Outros peixes','Tuna':'Atum','Mutton/lamb':'Cordeiro','Salmon':'Salmão','Other':'Outros','Turkey':'Peru','Other shellfish':'Outros frutos do mar','Duck':'Pato','Crab':'Caranguejo','Shrimp':'Camarão','Other meat':'Outras carnes',
    'Soy':'Soja','Pea':'Ervilha','Coconut':'Coco','Wheat':'Trigo','Oat':'Aveia','Almond':'Amêndoa','Rice':'Arroz','Cashew':'Caju','Chickpea':'Grão-de-bico','Potato':'Batata','Fava bean':'Fava','Yeast':'Levedura','Algae':'Algas','Sunflower':'Girassol','Mushrooms':'Cogumelos','Lentils':'Lentilha','Microalgae':'Microalgas','Hemp':'Cânhamo','Tapioca':'Tapioca','Mycoprotein':'Micoproteína','Seaweed':'Algas marinhas','Lupine':'Tremoço','Mung bean':'Feijão-mungo','Corn':'Milho','Mycelium':'Micélio','Quinoa':'Quinoa','Fungi':'Fungos','Omega-3':'Ômega-3','White bean':'Feijão-branco','Canola':'Canola'
  } : {};
  const label = v => L[v] || v;
  const S = pt ? {
    category:'Categoria',focus:'Foco',region:'Região de atuação',market:'Mercado',type:'Tipo de empresa',tech:'Tecnologia',product:'Produto',animal:'Animal de referência',ingredient:'Ingrediente',source:'Origem dos dados',country:'País',year:'Fundação',
    filters:'Filtros',clear:'Limpar',close:'Fechar',all:'Todos os países',spec:'Especializada',div:'Diversificada',gfi:'Base do GFI',sheet:'Planilha do projeto (em revisão)',
    company:'Empresa',hq:'Sede',founded:'Fundação',companies:'empresas',countries:'países',plant:'à base de plantas',cult:'cultivadas',ferm:'fermentação',from:'de',to:'até',
    of:'de',showing:'Mostrando',none:'Nenhuma empresa com esses filtros.',review:'em revisão',site:'Site',founders:'Fundadores',alt:'Outros nomes',reviewNote:'Dado da planilha do projeto, ainda em revisão.',mapHint:'Clique em um círculo para filtrar por país.',mapOn:'Filtrando por',diversified:'Classificada pelo GFI como diversificada: não atua só em proteínas alternativas.',noDesc:'',noCountry:'sem país informado'
  } : {
    category:'Category',focus:'Focus',region:'Operating region',market:'Market',type:'Company type',tech:'Technology',product:'Product',animal:'Animal analog',ingredient:'Ingredient',source:'Data source',country:'Country',year:'Founded',
    filters:'Filters',clear:'Clear',close:'Close',all:'All countries',spec:'Specialized',div:'Diversified',gfi:'GFI database',sheet:'Project spreadsheet (under review)',
    company:'Company',hq:'HQ',founded:'Founded',companies:'companies',countries:'countries',plant:'plant-based',cult:'cultivated',ferm:'fermentation',from:'from',to:'to',
    of:'of',showing:'Showing',none:'No companies match these filters.',review:'under review',site:'Website',founders:'Founders',alt:'Other names',reviewNote:'Data from the project spreadsheet, still under review.',mapHint:'Click a circle to filter by country.',mapOn:'Filtering by',diversified:'Classified by GFI as diversified: not exclusively focused on alternative proteins.',noDesc:'',noCountry:'country not given'
  };
  const COLORS = {'Plant-based':'plant','Cultivated':'cult','Precision fermentation':'prec','Biomass fermentation':'bio','Fermentation-derived':'ferm','Traditional fermentation':'trad','Plant molecular farming':'mol','Blended':'blend'};
  const FACETS = [
    {k:'p',t:S.category,open:1,get:c=>c.p,color:1},{k:'f',t:S.focus,open:1,get:c=>c.f},{k:'r',t:S.region,get:c=>c.r||[]},
    {k:'m',t:S.market,get:c=>c.m||[]},{k:'t',t:S.type,get:c=>c.t?[c.t]:[],lab:v=>v==='S'?S.spec:S.div},
    {k:'k',t:S.tech,get:c=>c.k||[]},{k:'pt',t:S.product,get:c=>c.pt||[]},{k:'an',t:S.animal,get:c=>c.an||[]},
    {k:'i',t:S.ingredient,get:c=>c.i||[],top:30}
  ];
  const COORDS = {US:[-98,39],CA:[-100,56],MX:[-102,23],BR:[-52,-11],AR:[-65,-35],CL:[-71,-33],CO:[-74,4],EC:[-78,-1],PE:[-75,-10],GB:[-2,53.5],IE:[-8,53.4],FR:[2.5,46.5],DE:[10,51],NL:[5.3,52.3],BE:[4.5,50.6],LU:[6.1,49.7],CH:[8.2,46.8],AT:[14.5,47.6],IT:[12.5,42.8],ES:[-3.7,40.3],PT:[-8.2,39.6],DK:[9.5,56],SE:[16,60],NO:[9,61],FI:[26,63],IS:[-19,65],EE:[25.5,58.8],LV:[25,56.9],LT:[24,55.3],PL:[19.5,52],CZ:[15.5,49.8],HU:[19.3,47.2],RO:[25,46],BG:[25.3,42.7],GR:[22,39.3],SI:[14.8,46.1],HR:[16,45.3],UA:[31,49],RU:[60,57],TR:[35,39],CY:[33.2,35],IL:[34.9,31.5],LB:[35.8,33.9],AE:[54.3,24],EG:[30,27],MA:[-6,32],ET:[39,9],KE:[37.9,0],NG:[8,9.5],GH:[-1.2,7.9],ZA:[25,-29],ZM:[28,-14],IN:[79,22],PK:[69.5,30],LK:[80.7,7.8],TH:[101,15],VN:[107,15],MY:[102,4],SG:[103.8,1.3],ID:[113,-2],PH:[122,13],CN:[104,35],HK:[114.2,22.3],TW:[121,23.7],KR:[127.8,36.4],JP:[138,36.5],AU:[134,-25],NZ:[172,-41],JE:[-2.1,49.2],LI:[9.5,47.1],MC:[7.4,43.7],GE:[43.5,42.2]};
  function project(lon, lat){
    const A1=1.340264,A2=-0.081106,A3=0.000893,A4=0.003796,l=lon*Math.PI/180,p=lat*Math.PI/180;
    const t=Math.asin(Math.sqrt(3)/2*Math.sin(p)),t2=t*t,t6=t2*t2*t2;
    return [480+150*2*Math.sqrt(3)*l*Math.cos(t)/(3*(A1+3*A2*t2+t6*(7*A3+9*A4*t2))), 225-150*t*(A1+A2*t2+t6*(A3+A4*t2))];
  }

  const $ = id => document.getElementById(id);
  let all = [], view = [], limit = 50, sort = {k:'n',d:1};
  const st = {q:'',c:'',y0:'',y1:'',sel:{}};
  FACETS.forEach(f => st.sel[f.k] = new Set());

  function readHash(){
    const h = new URLSearchParams(location.hash.slice(1));
    st.q = h.get('q') || ''; st.c = h.get('c') || ''; st.y0 = h.get('y0') || ''; st.y1 = h.get('y1') || '';
    FACETS.forEach(f => st.sel[f.k] = new Set((h.get(f.k) || '').split('|').filter(Boolean)));
    return h.get('co');
  }
  function writeHash(co){
    const h = new URLSearchParams();
    if(st.q) h.set('q',st.q); if(st.c) h.set('c',st.c); if(st.y0) h.set('y0',st.y0); if(st.y1) h.set('y1',st.y1);
    FACETS.forEach(f => { if(st.sel[f.k].size) h.set(f.k,[...st.sel[f.k]].join('|')); });
    if(co) h.set('co',co);
    const s = h.toString();
    history.replaceState(null,'',s ? '#'+s : location.pathname+location.search);
  }
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  function match(c, skip){
    if(skip !== 'c' && st.c && c.c !== st.c) return false;
    if(st.y0 && !(c.y >= +st.y0)) return false;
    if(st.y1 && !(c.y <= +st.y1)) return false;
    for(const f of FACETS){
      if(f.k === skip) continue;
      const s = st.sel[f.k];
      if(s.size && !f.get(c).some(v => s.has(v))) return false;
    }
    if(st.q){ const words = norm(st.q).split(/\s+/); if(!words.every(w => c._t.includes(w))) return false; }
    return true;
  }
  const VAL = {n:c=>c._s,p:c=>label(c.p[0]||'~'),f:c=>label(c.f[0]||'~'),c:c=>country(c.c)||'~',y:c=>c.y||(sort.d>0?9999:0)};
  function apply(){
    view = all.filter(c => match(c));
    const g = VAL[sort.k];
    view.sort((a,b) => { const x=g(a),y=g(b); return (x<y?-1:x>y?1:0)*sort.d || (a._s<b._s?-1:1); });
    limit = 50;
    renderFilters(); renderKpis(); renderMap(); renderChips(); renderTable();
  }
  function renderFilters(){
    const box = $('filters'), open = {};
    box.querySelectorAll('details').forEach(d => open[d.dataset.k] = d.open);
    const scroll = box.scrollTop, act = document.activeElement;
    // rebuilding the panel must not lose the keyboard position
    const refocus = box.contains(act) ? (act.id ? '#'+act.id : act.dataset.f ? `input[data-f="${act.dataset.f}"][value="${CSS.escape(act.value)}"]` : '') : '';
    const countryCounts = {};
    all.forEach(c => { if(c.c && match(c,'c')) countryCounts[c.c] = (countryCounts[c.c]||0)+1; });
    const opts = Object.keys(countryCounts).map(c => [c,country(c)]).sort((a,b) => a[1].localeCompare(b[1],lang));
    let h = `<div class="f-head"><span>${S.filters}</span><span><button type="button" id="clear">${S.clear}</button> <button type="button" id="closefilters" class="only-m">${S.close}</button></span></div>`;
    h += `<details class="facet" data-k="_c" open><summary>${S.country}</summary><div class="facet-body"><select id="fcountry" aria-label="${S.country}"><option value="">${S.all}</option>${opts.map(([c,n]) => `<option value="${c}"${c===st.c?' selected':''}>${esc(n)} (${fmt(countryCounts[c])})</option>`).join('')}</select></div></details>`;
    FACETS.forEach(f => {
      const n = {}; all.forEach(c => { if(match(c,f.k)) f.get(c).forEach(v => n[v]=(n[v]||0)+1); });
      if(!f._order){ const tot={}; all.forEach(c => f.get(c).forEach(v => tot[v]=(tot[v]||0)+1)); f._order = Object.keys(tot).sort((a,b)=>tot[b]-tot[a]).slice(0,f.top||99); }
      const isOpen = open[f.k] !== undefined ? open[f.k] : (f.open || st.sel[f.k].size > 0);
      h += `<details class="facet" data-k="${f.k}"${isOpen?' open':''}><summary>${f.t}</summary><div class="facet-body">` + f._order.map(v => {
        const on = st.sel[f.k].has(v), ct = n[v]||0, lab = f.lab ? f.lab(v) : label(v);
        const dot = f.color ? `<i class="dot" style="--dc:var(--c-${COLORS[v]})"></i>` : '';
        return `<label class="opt${ct||on?'':' zero'}"><input type="checkbox" data-f="${f.k}" value="${esc(v)}"${on?' checked':''}/>${dot}<span class="lab">${esc(lab)}</span><span class="ct">${fmt(ct)}</span></label>`;
      }).join('') + `</div></details>`;
    });
    h += `<details class="facet" data-k="_y"${open._y||st.y0||st.y1?' open':''}><summary>${S.year}</summary><div class="facet-body"><div class="years"><input id="y0" type="number" min="1800" max="2030" placeholder="${S.from}" aria-label="${S.from}" value="${esc(st.y0)}"/><input id="y1" type="number" min="1800" max="2030" placeholder="${S.to}" aria-label="${S.to}" value="${esc(st.y1)}"/></div></div></details>`;
    box.innerHTML = h; box.scrollTop = scroll;
    if(refocus){ const el = box.querySelector(refocus); if(el) el.focus(); }
  }
  function renderKpis(){
    const has = (c,re) => c.p.some(p => re.test(p));
    const cs = new Set(view.map(c=>c.c).filter(Boolean)).size;
    const items = [[view.length,S.companies],[cs,S.countries],[view.filter(c=>has(c,/^Plant-based/)).length,S.plant],[view.filter(c=>has(c,/^Cultivated/)).length,S.cult],[view.filter(c=>has(c,/ermentation/)).length,S.ferm]];
    $('kpis').innerHTML = items.map(([n,l]) => `<div class="kpi"><b>${fmt(n)}</b><span>${l}</span></div>`).join('');
  }
  function renderMap(){
    const counts = {}; all.forEach(c => { if(c.c && match(c,'c')) counts[c.c]=(counts[c.c]||0)+1; });
    const max = Math.max(1,...Object.values(counts));
    const rows = Object.entries(counts).filter(([c])=>COORDS[c]).sort((a,b)=>b[1]-a[1]);
    $('bubbles').innerHTML = rows.map(([c,n]) => {
      const [x,y] = project(...COORDS[c]), r = Math.max(2.6, 30*Math.sqrt(n/max));
      const name = esc(country(c));
      return `<circle class="bub${c===st.c?' on':''}" data-c="${c}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" tabindex="0" role="button" aria-label="${name}: ${fmt(n)}"><title>${name}: ${fmt(n)}</title></circle>` + (r>11?`<text class="bub-l" x="${x.toFixed(1)}" y="${y.toFixed(1)}">${fmt(n)}</text>`:'');
    }).join('');
    $('mapnote').textContent = st.c ? `${S.mapOn} ${country(st.c)}.` : S.mapHint;
  }
  function renderChips(){
    const c = [];
    if(st.c) c.push(['c','',country(st.c)]);
    FACETS.forEach(f => st.sel[f.k].forEach(v => c.push([f.k,v,f.lab?f.lab(v):label(v)])));
    if(st.y0) c.push(['y0','',`${S.from} ${st.y0}`]); if(st.y1) c.push(['y1','',`${S.to} ${st.y1}`]);
    $('chips').innerHTML = c.map(([k,v,l]) => `<button type="button" class="chip" data-k="${k}" data-v="${esc(v)}">${esc(l)}</button>`).join('');
  }
  function renderTable(){
    const cols = [['n',S.company,''],['p',S.category,'col-cat'],['f',S.focus,'col-focus'],['c',S.hq,''],['y',S.founded,'col-year']];
    $('thead').innerHTML = '<tr>'+cols.map(([k,l,cl]) => `<th class="${cl}"${sort.k===k?` aria-sort="${sort.d>0?'ascending':'descending'}"`:''}><button type="button" data-sort="${k}">${l}</button></th>`).join('')+'</tr>';
    const rows = view.slice(0,limit);
    $('tbody').innerHTML = rows.length ? rows.map(c => {
      const cats = c.p.slice(0,2).map(p => `<span class="cat" style="--dc:var(--c-${COLORS[p]||'blend'})"><i class="dot"></i>${esc(label(p))}</span>`).join('');
      return `<tr data-i="${c._i}"><td><button type="button" class="c-name">${esc(c.n)}${c.s==='j'&&!c.rv?`<span class="review">${S.review}</span>`:''}</button>${c.d?`<span class="c-desc">${esc(c.d)}</span>`:''}</td><td class="col-cat"><span class="cats">${cats}</span></td><td class="col-focus">${esc(c.f.slice(0,2).map(label).join(', '))}</td><td>${esc(country(c.c))}</td><td class="col-year num-c">${c.y||''}</td></tr>`;
    }).join('') : `<tr><td colspan="5" class="empty">${S.none}</td></tr>`;
    $('count').textContent = `${S.showing} ${fmt(rows.length)} ${S.of} ${fmt(view.length)}`;
    $('more').hidden = limit >= view.length;
  }
  let lastFocus = null;
  function openDrawer(c){
    lastFocus = document.activeElement;
    const row = (l,v) => v ? `<dt>${l}</dt><dd>${v}</dd>` : '';
    const list = (f,a) => (a&&a.length) ? a.map(f).map(esc).join(', ') : '';
    const place = [c.city,c.st,country(c.c)].filter(Boolean).join(', ');
    const d = $('drawer');
    d.innerHTML = `<button type="button" class="x" aria-label="${S.close}">×</button><h2 id="drawerh">${esc(c.n)}</h2>${c.d?`<p>${esc(c.d)}</p>`:''}
      ${c.s==='j'&&!c.rv?`<div class="flag">${S.reviewNote}</div>`:''}${c.t==='D'?`<div class="flag">${S.diversified}</div>`:''}
      <dl>${row(S.category,list(label,c.p))}${row(S.focus,list(label,c.f))}${row(S.hq,esc(place))}${row(S.founded,c.y)}${row(S.founders,esc(c.fd))}${row(S.alt,esc(c.a))}${row(S.market,list(v=>v,c.m))}${row(S.tech,list(label,c.k))}${row(S.product,list(label,c.pt))}${row(S.animal,list(label,c.an))}${row(S.ingredient,list(label,c.i))}${row(S.region,list(label,c.r))}${row(S.source,c.s==='g'?S.gfi:c.s==='j'?S.sheet:'')}</dl>
      <div class="links">${/^https?:/.test(c.u||'')?`<a href="${esc(c.u)}" target="_blank" rel="noopener">${S.site} ↗</a>`:''}${/^https?:/.test(c.li||'')?`<a href="${esc(c.li)}" target="_blank" rel="noopener">LinkedIn ↗</a>`:''}</div>`;
    d.hidden = false; $('scrim').hidden = false; d.focus(); d.scrollTop = 0;
    writeHash(c.n);
  }
  function closeDrawer(){ $('drawer').hidden = true; $('scrim').hidden = true; writeHash(); if(lastFocus && lastFocus.focus) lastFocus.focus(); }
  function closeFilters(){
    const f = $('filters'); if(!f.classList.contains('open')) return;
    f.classList.remove('open'); $('scrim').hidden = $('drawer').hidden; $('openfilters').focus();
  }
  function changed(){ writeHash(); apply(); }
  function csv(){
    // a leading = + - or @ would run as a formula in a spreadsheet
    const q = v => `"${String(v==null?'':Array.isArray(v)?v.join('; '):v).replace(/^[=+\-@]/,"'$&").replace(/"/g,'""')}"`;
    const out = [['Company','Description','Category','Focus','Country','City','Founded','Founders','Website','Source'].join(',')];
    view.forEach(c => out.push([c.n,c.d,c.p,c.f,country(c.c),c.city,c.y,c.fd,c.u,c.s==='g'?'GFI':'Project'].map(q).join(',')));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿'+out.join('\n')],{type:'text/csv'}));
    a.download = 'ethical-food-companies.csv'; a.click(); URL.revokeObjectURL(a.href);
  }

  $('filters').addEventListener('change', e => {
    const t = e.target;
    if(t.dataset.f){ t.checked ? st.sel[t.dataset.f].add(t.value) : st.sel[t.dataset.f].delete(t.value); changed(); }
    else if(t.id==='fcountry'){ st.c = t.value; changed(); }
    else if(t.id==='y0'||t.id==='y1'){ st[t.id] = t.value; changed(); }
  });
  $('filters').addEventListener('click', e => {
    if(e.target.id==='clear'){ st.q='';st.c='';st.y0='';st.y1='';FACETS.forEach(f=>st.sel[f.k].clear());$('q').value='';changed(); }
    if(e.target.id==='closefilters') closeFilters();
  });
  let qt; $('q').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(()=>{ st.q = e.target.value.trim(); changed(); },120); });
  function pick(c){ st.c = st.c===c ? '' : c; changed(); }
  $('map').addEventListener('click', e => { const c = e.target.dataset && e.target.dataset.c; if(c) pick(c); });
  $('map').addEventListener('keydown', e => { const c = e.target.dataset && e.target.dataset.c; if(c && (e.key==='Enter'||e.key===' ')){ e.preventDefault(); pick(c); } });
  $('chips').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if(!b) return;
    const k = b.dataset.k;
    if(k==='c'||k==='y0'||k==='y1') st[k]=''; else st.sel[k].delete(b.dataset.v);
    changed();
  });
  $('thead').addEventListener('click', e => { const k = e.target.dataset.sort; if(!k) return; sort = {k,d:sort.k===k?-sort.d:(k==='y'?-1:1)}; apply(); $('thead').querySelector(`[data-sort="${k}"]`).focus(); });
  $('tbody').addEventListener('click', e => { const tr = e.target.closest('tr[data-i]'); if(tr) openDrawer(all[+tr.dataset.i]); });
  $('more').addEventListener('click', () => { limit += 100; renderTable(); });
  $('csv').addEventListener('click', csv);
  $('openfilters').addEventListener('click', () => { $('filters').classList.add('open'); $('scrim').hidden = false; $('closefilters').focus(); });
  $('scrim').addEventListener('click', () => { closeFilters(); if(!$('drawer').hidden) closeDrawer(); });
  $('drawer').addEventListener('click', e => { if(e.target.classList.contains('x')) closeDrawer(); });
  document.addEventListener('keydown', e => {
    if(e.key==='Escape'){ closeFilters(); if(!$('drawer').hidden) closeDrawer(); }
    // keep Tab inside whichever panel is open
    const panel = !$('drawer').hidden ? $('drawer') : $('filters').classList.contains('open') ? $('filters') : null;
    if(e.key==='Tab' && panel){
      const els = [...panel.querySelectorAll('a[href],button,input,select,summary')].filter(el => el.offsetParent);
      if(!els.length) return;
      const first = els[0], last = els[els.length-1], cur = document.activeElement;
      if(e.shiftKey && (cur===first||cur===panel)){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && cur===last){ e.preventDefault(); first.focus(); }
    }
  });

  const load = tries => fetch(base+'data/companies.json').then(r => { if(!r.ok) throw new Error(r.status); return r.json(); })
    .catch(err => { if(tries > 0) return load(tries-1); throw err; });
  load(2).then(data => {
    data.forEach((c,i) => {
      c._i = i; c._s = c.n.toLowerCase().replace(/^[^0-9a-z]+/,'');
      c._t = norm([c.n,c.a,c.d,c.fd,c.city,c.st,country(c.c),...(c.i||[]),...c.p.map(label),...c.f.map(label)].filter(Boolean).join(' '));
    });
    all = data;
    const co = readHash(); $('q').value = st.q;
    apply();
    if(co){ const c = all.find(x=>x.n===co); if(c) openDrawer(c); }
  }).catch(() => { $('tbody').innerHTML = `<tr><td class="empty">${pt?'Não foi possível carregar os dados.':'Could not load the data.'}</td></tr>`; });
})();
