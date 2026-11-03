let state = {
    coins: 0, level: 1, day: 1, time: 480,
    paused: false,
    station: 'orders',
    active: null,
    custIdx: -1,
    customers: [],
    cId: 0, oId: 0,
    doneToday: 0, dayTips: 0,
    cupSize: null,
    flavor: null,
    fill: 0,
    syrup: false,
    mixPct: 0,
    mixing: false,
    mixInt: null,
    cream: [],
    tops: []
};

const CUP = [
    {id:'Pequeño', name:'PEQUEÑO', oz:'8 oz', cls:'cup-sm', line:'line-sm'},
    {id:'Mediano', name:'MEDIANO', oz:'12 oz', cls:'cup-md', line:'line-md'},
    {id:'Grande', name:'GRANDE', oz:'16 oz', cls:'cup-lg', line:'line-lg'}
];
const FLAV = [
    {id:'Fresa', n:'FRESA', e:'🍓'},
    {id:'Chocolate', n:'CHOCOLATE', e:'🍫'},
    {id:'Vainilla', n:'VAINILLA', e:'🍦'},
    {id:'Menta', n:'MENTA', e:'🌿'},
    {id:'Oreo', n:'OREO', e:'🍪'},
    {id:'Caramelo', n:'CARAMELO', e:'🍯'},
    {id:'Tiramisú', n:'TIRAMISÚ', e:'☕'},
    {id:'Coco', n:'COCO', e:'🥥'},
    {id:'Frambuesa', n:'FRAMBUESA', e:'🍒'},
    {id:'Plátano', n:'PLÁTANO', e:'🍌'},
    {id:'Dulce de Leche', n:'DULCE LECHE', e:'🥛'},
    {id:'Chicle', n:'CHICLE', e:'🍬'}
];
const SYR = ['Caramelo','Chocolate','Fruta','Vainilla'];
const TOPS = ['Chispas de chocolate','Galleta','Cereza','Crema batida','Nueces','Lacasitos','Mini Malvaviscos'];
const MIXLEVEL = [
    {id:'poco', label:'POCO BATIDO'},
    {id:'medio', label:'TÉRMINO MEDIO'},
    {id:'mucho', label:'MUY BATIDO'}
];

const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const pauseScreen = document.getElementById('pauseScreen');
const endScreen = document.getElementById('endScreen');
const resultScreen = document.getElementById('resultScreen');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const restartBtn = document.getElementById('restartBtn');
const nextDayBtn = document.getElementById('nextDayBtn');
const nextBtn = document.getElementById('nextBtn');

const coinsEl = document.getElementById('coins');
const levelEl = document.getElementById('level');
const dayEl = document.getElementById('day');
const clockEl = document.getElementById('clock');

const tabs = document.querySelectorAll('.tab-btn');
const stationName = document.getElementById('stationName');
const stationView = document.getElementById('stationView');
const customersList = document.getElementById('customersList');

const dayTipsEl = document.getElementById('dayTips');
const doneOrdersEl = document.getElementById('doneOrders');
const totalCoinsEl = document.getElementById('totalCoins');
const sBuild = document.getElementById('sBuild');
const sMix = document.getElementById('sMix');
const sTop = document.getElementById('sTop');
const sWait = document.getElementById('sWait');
const starsEl = document.getElementById('stars');
const tipAmt = document.getElementById('tipAmt');

function init(){
    startBtn.onclick = start;
    pauseBtn.onclick = ()=>{state.paused=true; gameScreen.style.display='none'; pauseScreen.style.display='flex';};
    resumeBtn.onclick = ()=>{state.paused=false; pauseScreen.style.display='none'; gameScreen.style.display='flex'; renderCust();};
    restartBtn.onclick = restart;
    nextDayBtn.onclick = nxtDay;
    nextBtn.onclick = closeRes;
    tabs.forEach(t=>t.onclick=()=>goTab(t.dataset.station));
    setInterval(clk,60000); clk();
}

function start(){
    startScreen.style.display='none';
    gameScreen.style.display='flex';
    state={coins:0,level:1,day:1,time:480,paused:false,station:'orders',active:null,custIdx:-1,customers:[],cId:0,oId:0,doneToday:0,dayTips:0,cupSize:null,flavor:null,fill:0,syrup:false,mixPct:0,mixing:false,mixInt:null,cream:[],tops:[],mixLevel:MIXLEVEL[Math.floor(Math.random()*MIXLEVEL.length)].id};
    upd();
    addCust();
    goTab('orders');
}

function upd(){
    coinsEl.textContent=state.coins;
    levelEl.textContent=state.level;
    dayEl.textContent=state.day;
}

function clk(){
    if(state.paused)return;
    let h=Math.floor(state.time/60), m=state.time%60;
    clockEl.textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
    state.time+=5;
    if(state.time>=1020 && state.customers.length==0) endD();
}

function addCust(){
    let ml = MIXLEVEL[Math.floor(Math.random()*MIXLEVEL.length)];
    let c={id:state.cId++, name:rname(), pat:100, order:genOrd(), mixLevel:ml.id, mixLabel:ml.label};
    state.customers.push(c);
    renderCust();
}

function rname(){
    let n=['Ana','Luis','María','Pablo','Sofía','Carlos','Lucía','Diego','Valeria','Mateo','Camila','Javier'];
    return n[Math.floor(Math.random()*n.length)];
}

function genOrd(){
    let cup=CUP[Math.floor(Math.random()*CUP.length)].id;
    let fl=FLAV[Math.floor(Math.random()*FLAV.length)].id;
    let sy=SYR[Math.floor(Math.random()*SYR.length)];
    let ts=[]; let cnt=2+Math.floor(Math.random()*2); let used=[];
    for(let i=0;i<cnt;i++){let t; do{t=TOPS[Math.floor(Math.random()*TOPS.length)];}while(used.includes(t)); used.push(t); ts.push(t);}
    return {id:state.oId++, cup, fl, sy, tops:ts};
}

function renderCust(){
    customersList.innerHTML='';
    state.customers.forEach((c,i)=>{
        let o=c.order, f=FLAV.find(x=>x.id==o.fl);
        let wrap=document.createElement('div');
        wrap.className='cust-wrap';
        wrap.innerHTML='<div class="cust-card'+(i==state.custIdx?' active':'')+'"><div class="cust-name">👤 '+c.name+'</div><div style="font-size:11px;margin:4px 0;font-weight:800">Paciencia</div><div class="pat-bar"><div class="pat-fill" style="width:'+c.pat+'%"></div></div></div><div class="cust-order"><div class="cust-order-title">PEDIDO ACTUAL</div><div class="cust-order-line"><b>#'+o.id+'</b> | VASO: <b>'+o.cup+'</b></div><div class="cust-order-line">'+f.e+' SABOR: <b>'+f.n+'</b></div><div class="cust-order-line">🍯 JARABE: <b>'+o.sy+'</b></div><div class="cust-order-line">🍓 TOPPINGS: <b>'+o.tops.join(', ')+'</b></div><div class="cust-order-line">🌀 BATIDO: <b>'+c.mixLabel+'</b></div></div>';
        wrap.querySelector('.cust-card').onclick=()=>pick(i);
        customersList.appendChild(wrap);
    });
    if(!state.paused){
        state.customers.forEach((c,i)=>{ if(c.pat>0)c.pat-=0.35; if(c.pat<=0 && i==state.custIdx) leave(i); });
        setTimeout(renderCust,1000);
    }
}

function pick(i){
    state.custIdx=i; state.active=state.customers[i].order;
    state.mixLevel=state.customers[i].mixLevel;
    state.cupSize=null; state.flavor=null; state.fill=0; state.syrup=false; state.mixPct=0; state.cream=[]; state.tops=[];
    if(state.mixInt){clearInterval(state.mixInt); state.mixInt=null;}
    state.mixing=false;
    renderCust(); goTab('orders');
}

function goTab(s){
    state.station=s;
    tabs.forEach(t=>t.classList.toggle('active',t.dataset.station==s));
    let map={orders:'📝 ESTACIÓN DE PEDIDOS', build:'🍦 ESTACIÓN DE LLENADO', mix:'🌀 ESTACIÓN DE BATIDO', toppings:'🍓 ESTACIÓN DE TOPPINGS'};
    stationName.textContent=map[s];
    draw();
}

function draw(){
    stationView.innerHTML='';
    if(state.station=='orders') vOrders();
    if(state.station=='build') vBuild();
    if(state.station=='mix') vMix();
    if(state.station=='toppings') vTop();
}

function vOrders(){
    if(!state.active){ stationView.innerHTML='<div style="text-align:center;margin-top:100px"><div style="font-size:80px">👥</div><div style="font-size:32px;font-weight:900;color:#8B4513;margin-top:20px">SELECCIONA UN CLIENTE DE LA IZQUIERDA</div></div>'; return; }
    let o=state.active, f=FLAV.find(x=>x.id==o.fl), c=state.customers[state.custIdx];
    let d=document.createElement('div');
    d.innerHTML='<div class="order-detail-box"><div class="order-detail-title">DETALLES DEL PEDIDO</div><div class="order-detail-grid"><div class="order-detail-item"><b>CLIENTE:</b> '+c.name+'</div><div class="order-detail-item"><b>PEDIDO #:</b> '+o.id+'</div><div class="order-detail-item"><b>VASO:</b> '+o.cup+'</div><div class="order-detail-item"><b>SABOR:</b> '+f.e+' '+f.n+'</div><div class="order-detail-item"><b>JARABE:</b> '+o.sy+'</div><div class="order-detail-item"><b>NIVEL DE BATIDO:</b> '+c.mixLabel+'</div><div class="order-detail-item full"><b>TOPPINGS:</b> '+o.tops.join(', ')+'</div></div></div><div style="text-align:center"><button class="go-btn" id="toBuild">IR A ESTACIÓN DE LLENADO ➡️</button></div>';
    stationView.appendChild(d);
    document.getElementById('toBuild').onclick=()=>goTab('build');
}

function vBuild(){
    if(!state.active){ stationView.innerHTML='<div style="text-align:center;margin-top:100px"><div style="font-size:80px">⚠️</div><div style="font-size:36px;font-weight:900;color:#FF6347;margin-top:20px">TOMA UN PEDIDO PRIMERO</div></div>'; return; }
    let o=state.active, f=FLAV.find(x=>x.id==o.fl);
    let d=document.createElement('div');
    d.innerHTML='<div class="sec-title">ELEGIR VASO Y LLENAR</div><div class="sec-sub">PASO 1: Selecciona el tamaño del vaso • PASO 2: Llena hasta la línea roja</div><div class="cup-grid">'+CUP.map(c=>'<div class="cup-card" data-c="'+c.id+'"><svg class="cup-svg" width="70" height="90" viewBox="0 0 70 90"><rect x="15" y="10" width="40" height="60" rx="4" fill="rgba(255,255,255,0.8)" stroke="#333" stroke-width="3"/><rect x="15" y="70" width="40" height="8" rx="0 0 4 4" fill="#333"/></svg><div class="cup-name">'+c.name+'</div><div class="cup-oz">'+c.oz+'</div></div>').join('')+'</div><div id="fillBox" style="display:none"><div class="sec-sub" style="font-size:22px">Sabor solicitado: '+f.e+' <b>'+f.n+'</b></div><div class="disp-container"><div class="disp-machine"><div class="disp-top"></div><div class="cup-display" id="cdisp"><div class="fill-line-red" id="cline"></div><div class="fill-ice" id="fice"></div></div></div><button class="big-btn" id="hold">⏺ MANTENER PARA LLENAR</button><button class="syrup-btn2" id="syrb">🍯 AÑADIR JARABE: '+o.sy+'</button><br><button class="go-btn" id="gob" style="display:none;margin-top:20px">CONTINUAR AL BATIDO ➡️</button></div>';
    stationView.appendChild(d);
    d.querySelectorAll('.cup-card').forEach(b=>b.onclick=()=>{
        d.querySelectorAll('.cup-card').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        state.cupSize=b.dataset.c;
        let c=CUP.find(x=>x.id==state.cupSize);
        document.getElementById('fillBox').style.display='block';
        let cd=document.getElementById('cdisp'); cd.className='cup-display '+c.cls;
        let cl=document.getElementById('cline'); cl.className='fill-line-red '+c.line;
        let fi=document.getElementById('fice');
        if(f.id=='Chocolate') fi.style.background='linear-gradient(180deg,#8B4513 0%,#654321 100%)';
        else if(f.id=='Fresa') fi.style.background='linear-gradient(180deg,#FFB6C1 0%,#FF69B4 100%)';
        else if(f.id=='Menta') fi.style.background='linear-gradient(180deg,#98FB98 0%,#90EE90 100%)';
        else if(f.id=='Oreo') fi.style.background='linear-gradient(180deg,#2F2F2F 0%,#000000 100%)';
        else if(f.id=='Caramelo') fi.style.background='linear-gradient(180deg,#DEB887 0%,#D2691E 100%)';
        else if(f.id=='Tiramisú') fi.style.background='linear-gradient(180deg,#D2B48C 0%,#8B7355 100%)';
        else if(f.id=='Coco') fi.style.background='linear-gradient(180deg,#FFFAF0 0%,#F5F5DC 100%)';
        else if(f.id=='Frambuesa') fi.style.background='linear-gradient(180deg,#DC143C 0%,#B22222 100%)';
        else if(f.id=='Plátano') fi.style.background='linear-gradient(180deg,#FFD700 0%,#FFA500 100%)';
        else if(f.id=='Dulce de Leche') fi.style.background='linear-gradient(180deg,#F5DEB3 0%,#DEB887 100%)';
        else if(f.id=='Chicle') fi.style.background='linear-gradient(180deg,#FFB6C1 0%,#DDA0DD 100%)';
        else fi.style.background='linear-gradient(180deg,#FFF8DC 0%,#F5DEB3 100%)';
    });
    let hld=false, hv=0;
    document.getElementById('hold').onmousedown=()=>{
        if(!state.cupSize){alert('¡Primero elige el tamaño del vaso!'); return;}
        hld=true; let iv=setInterval(()=>{ if(hld && hv<98){ hv+=2; document.getElementById('fice').style.height=hv+'%'; } },38);
        document.addEventListener('mouseup',up,{once:true});
        function up(){ hld=false; clearInterval(iv); state.fill=hv; document.getElementById('gob').style.display='inline-block'; }
    };
    document.getElementById('syrb').onclick=e=>{ e.target.disabled=true; e.target.textContent='✓ JARABE AÑADIDO'; e.target.style.opacity='0.6'; state.syrup=true; };
    document.getElementById('gob').onclick=()=>goTab('mix');
}

function vMix(){
    if(!state.active){ stationView.innerHTML='<div style="text-align:center;margin-top:100px"><div style="font-size:80px">⚠️</div><div style="font-size:36px;font-weight:900;color:#FF6347;margin-top:20px">TOMA UN PEDIDO PRIMERO</div></div>'; return; }
    let c=state.customers[state.custIdx];
    let d=document.createElement('div');
    d.innerHTML='<div class="sec-title">BATIR AL PUNTO PERFECTO</div><div class="sec-sub">Cliente solicita: <b>'+c.mixLabel+'</b> • Selecciona velocidad → Inicia → DETÉN cuando esté acorde</div><div class="mix-area"><div class="mix-machine-big"><div class="blade-big" id="blade"></div></div><div class="progress-wrap"><div class="progress-bar"><div class="progress-fill" id="pfill"></div></div><div class="progress-labels"><span>0%</span><span style="color:#FF8C00">BIEN</span><span style="color:#32CD32">ÓPTIMO</span><span style="color:#FF4500">MUY BATIDO</span><span>100%</span></div></div><div class="speed-grid"><button class="speed-card" data-s="slow">🐢 LENTO</button><button class="speed-card" data-s="med">🚶 MEDIO</button><button class="speed-card" data-s="fast">🏃 RÁPIDO</button></div><button class="go-btn" id="mstart" disabled>INICIAR BATIDO</button><button class="go-btn" id="mstop" style="display:none;background:linear-gradient(135deg,#FF6347,#DC143C)">⏹ DETENER BATIDO</button><button class="go-btn" id="mtop" style="display:none">IR A DECORAR ➡️</button></div>';
    stationView.appendChild(d);
    let spd=null;
    d.querySelectorAll('.speed-card').forEach(b=>b.onclick=()=>{ d.querySelectorAll('.speed-card').forEach(x=>x.classList.remove('active')); b.classList.add('active'); spd=b.dataset.s; document.getElementById('mstart').disabled=false; });
    document.getElementById('mstart').onclick=()=>{
        document.getElementById('mstart').style.display='none';
        d.querySelectorAll('.speed-card').forEach(x=>x.disabled=true);
        document.getElementById('blade').classList.add('spin');
        document.getElementById('mstop').style.display='inline-block';
        let rt=spd=='slow'?0.5:spd=='med'?0.9:1.3;
        state.mixing=true; state.mixPct=0;
        state.mixInt=setInterval(()=>{
            if(!state.mixing)return;
            state.mixPct+=rt;
            if(state.mixPct>100)state.mixPct=100;
            document.getElementById('pfill').style.width=state.mixPct+'%';
        },75);
    };
    document.getElementById('mstop').onclick=()=>{
        state.mixing=false;
        if(state.mixInt){clearInterval(state.mixInt); state.mixInt=null;}
        document.getElementById('blade').classList.remove('spin');
        document.getElementById('mstop').style.display='none';
        document.getElementById('mtop').style.display='inline-block';
    };
    document.getElementById('mtop').onclick=()=>goTab('toppings');
}

function vTop(){
    if(!state.active){ stationView.innerHTML='<div style="text-align:center;margin-top:100px"><div style="font-size:80px">⚠️</div><div style="font-size:36px;font-weight:900;color:#FF6347;margin-top:20px">TOMA UN PEDIDO PRIMERO</div></div>'; return; }
    let o=state.active;
    let d=document.createElement('div');
    d.innerHTML='<div class="sec-title">DECORAR Y TERMINAR</div><div class="top-grid"><div class="top-panel"><h3>🍓 TOPPINGS SOLICITADOS</h3>'+o.tops.map(t=>'<div class="top-draggable" draggable="true" data-t="'+t+'">'+emo(t)+'<span>'+t+'</span></div>').join('')+'</div><div class="cream-area"><h3>🍦 CREMA BATIDA</h3><canvas id="creamCanvas" width="340" height="240"></canvas><button class="syrup-btn2" id="clrCr" style="margin-top:16px">🗑 BORRAR</button></div><div class="decor-area"><h3>🥤 TU CREACIÓN</h3><div class="decor-cup-big"><div class="decor-items-show" id="dshow"></div></div><div style="color:#666;font-weight:700">Suelta aquí</div></div></div><div style="text-align:center;margin-top:35px"><button class="go-btn" id="finOrd">✅ ENTREGAR PEDIDO</button></div>';
    stationView.appendChild(d);
    let canv=document.getElementById('creamCanvas'), ctx=canv.getContext('2d');
    let dr=false, pts=[];
    canv.onmousedown=e=>{dr=true; let r=canv.getBoundingClientRect(); pts.push({x:e.clientX-r.left,y:e.clientY-r.top});};
    canv.onmousemove=e=>{if(!dr)return; let r=canv.getBoundingClientRect(); pts.push({x:e.clientX-r.left,y:e.clientY-r.top}); redraw();};
    canv.onmouseup=()=>{dr=false; state.cream=pts;};
    function redraw(){ ctx.clearRect(0,0,340,240); ctx.strokeStyle='#F5DEB3'; ctx.lineWidth=16; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.beginPath(); pts.forEach((p,i)=>i==0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)); ctx.stroke(); }
    document.getElementById('clrCr').onclick=()=>{pts=[]; ctx.clearRect(0,0,340,240); state.cream=[];};
    let placed=[];
    d.querySelectorAll('.top-draggable').forEach(it=>it.ondragstart=e=>e.dataTransfer.setData('t',it.dataset.t));
    let dcup=document.querySelector('.decor-cup-big');
    dcup.ondragover=e=>e.preventDefault();
    dcup.ondrop=e=>{e.preventDefault(); let t=e.dataTransfer.getData('t'); if(!placed.includes(t)){ placed.push(t); document.getElementById('dshow').textContent=placed.map(emo).join(' '); state.tops=placed; } };
    document.getElementById('finOrd').onclick=fin;
}

function emo(t){ let m={'Chispas de chocolate':'🍫','Galleta':'🍪','Cereza':'🍒','Crema batida':'🍦','Nueces':'🥜','Lacasitos':'🍬','Mini Malvaviscos':'☁️'}; return m[t]||'✨'; }

function fin(){
    if(!state.active||state.custIdx==-1)return;
    let c=state.customers[state.custIdx];
    let b=calcB(), mx=calcM(), tp=calcT(), wt=calcW(c);
    let avg=(b+mx+tp+wt)/4, st=Math.max(1,Math.min(5,Math.round(avg/20)));
    let tip=Math.floor(avg*0.75);
    sBuild.textContent=b+'%'; sMix.textContent=mx+'%'; sTop.textContent=tp+'%'; sWait.textContent=wt+'%';
    starsEl.textContent='⭐'.repeat(st)+'☆'.repeat(5-st);
    tipAmt.textContent=tip;
    state.res={tip,st};
    resultScreen.style.display='flex';
}

function calcB(){
    if(!state.cupSize||!state.fill)return 62;
    let tgt={Pequeño:72,Mediano:66,Grande:60}[state.cupSize];
    let d=Math.abs(state.fill-tgt);
    if(d<=3)return 100; if(d<=7)return 92; if(d<=11)return 80; if(d<=17)return 68; return 54;
}

function calcM(){
    if(state.mixPct==0)return 62;
    let ml=state.mixLevel;
    if(ml=='poco'){ if(state.mixPct>=40 && state.mixPct<=60)return 100; if(state.mixPct>=35 && state.mixPct<=65)return 88; return 70; }
    if(ml=='medio'){ if(state.mixPct>=70 && state.mixPct<=80)return 100; if(state.mixPct>=65 && state.mixPct<=85)return 90; return 74; }
    if(ml=='mucho'){ if(state.mixPct>=88 && state.mixPct<=96)return 100; if(state.mixPct>=82 && state.mixPct<=98)return 90; return 76; }
    if(state.mixPct>=70 && state.mixPct<=90)return 100;
    if(state.mixPct>=66 && state.mixPct<=93)return 90;
    if(state.mixPct>=60 && state.mixPct<=96)return 76; return 60;
}

function calcT(){
    if(!state.active)return 62;
    let req=state.active.tops.length, pl=state.tops?state.tops.length:0;
    let cr=state.cream&&state.cream.length>10?42:22;
    return Math.min(100, Math.floor((pl/req)*58+cr));
}

function calcW(c){ if(c.pat>=92)return 100; if(c.pat>=78)return 92; if(c.pat>=64)return 78; if(c.pat>=46)return 66; if(c.pat>=30)return 52; return 38; }

function closeRes(){
    state.coins+=state.res.tip; state.dayTips+=state.res.tip; state.doneToday++;
    upd();
    if(state.custIdx>=0){ state.customers.splice(state.custIdx,1); state.custIdx=-1; }
    state.active=null; state.cupSize=null; state.fill=0; state.syrup=false; state.mixPct=0; state.cream=[]; state.tops=[];
    if(state.mixInt){clearInterval(state.mixInt); state.mixInt=null;}
    state.mixing=false;
    resultScreen.style.display='none';
    renderCust(); goTab('orders');
    if(state.customers.length<4 && state.time<1020) setTimeout(()=>{addCust(); renderCust();},1500);
    if(state.time>=1020 && state.customers.length==0) setTimeout(endD,1000);
}

function leave(i){ state.customers.splice(i,1); if(state.custIdx==i){state.custIdx=-1; state.active=null;} else if(state.custIdx>i) state.custIdx--; renderCust(); }

function restart(){
    pauseScreen.style.display='none'; gameScreen.style.display='flex';
    state.time=480; state.customers=[]; state.cId=0; state.custIdx=-1; state.active=null; state.doneToday=0; state.dayTips=0;
    if(state.mixInt){clearInterval(state.mixInt); state.mixInt=null;}
    renderCust(); goTab('orders'); addCust();
}

function endD(){
    state.paused=true; gameScreen.style.display='none'; endScreen.style.display='flex';
    dayTipsEl.textContent=state.dayTips; doneOrdersEl.textContent=state.doneToday; totalCoinsEl.textContent=state.coins;
}

function nxtDay(){
    endScreen.style.display='none'; gameScreen.style.display='flex'; state.paused=false;
    state.day++; state.level=Math.floor(state.day/2)+1; state.time=480; state.customers=[]; state.cId=0; state.custIdx=-1; state.active=null; state.doneToday=0; state.dayTips=0;
    if(state.mixInt){clearInterval(state.mixInt); state.mixInt=null;}
    upd(); renderCust(); goTab('orders'); addCust();
}

document.addEventListener('DOMContentLoaded',init);
