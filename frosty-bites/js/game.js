let state = {
    coins: 0, level: 1, day: 1, time: 480,
    paused: false,
    station: 'orders',
    active: null,
    custIdx: -1,
    customers: [],
    cId: 0, oId: 0,
    doneToday: 0, dayTips: 0, spawned: 0, left: 0,
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
    {id:'Fresa', n:'FRESA', e:'<i class="scoop" style="--c:#ff8fb4"></i>'},
    {id:'Chocolate', n:'CHOCOLATE', e:'<i class="scoop" style="--c:#7a4528"></i>'},
    {id:'Vainilla', n:'VAINILLA', e:'<i class="scoop" style="--c:#fff1c9"></i>'},
    {id:'Menta', n:'MENTA', e:'<i class="scoop" style="--c:#7fe8c1"></i>'},
    {id:'Oreo', n:'OREO', e:'<i class="scoop" style="--c:#4a4a55"></i>'},
    {id:'Caramelo', n:'CARAMELO', e:'<i class="scoop" style="--c:#e0a040"></i>'},
    {id:'Tiramisú', n:'TIRAMISÚ', e:'<i class="scoop" style="--c:#c49a74"></i>'},
    {id:'Coco', n:'COCO', e:'<i class="scoop" style="--c:#f4f4f4"></i>'},
    {id:'Frambuesa', n:'FRAMBUESA', e:'<i class="scoop" style="--c:#d6336c"></i>'},
    {id:'Plátano', n:'PLÁTANO', e:'<i class="scoop" style="--c:#ffe066"></i>'},
    {id:'Dulce de Leche', n:'DULCE LECHE', e:'<i class="scoop" style="--c:#c98b4b"></i>'},
    {id:'Chicle', n:'CHICLE', e:'<i class="scoop" style="--c:#ff9bd8"></i>'}
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


const CLIENTS=[
 {img:1,acc:'pin de concha',tier:0},{img:2,acc:'caracola',tier:0},{img:3,acc:'gancho de coral',tier:0},
 {img:4,acc:'gorro de marinero',tier:1},{img:5,acc:'casco de buzo',tier:1},{img:6,acc:'barquito de papel',tier:1},
 {img:7,acc:'medalla de brújula',tier:2},{img:8,acc:'sombrero pirata',tier:2},{img:9,acc:'capitán condecorado',tier:2}
];
const TIER=[
 {n:'FÁCIL',cls:'t-easy',mult:1,drain:0.25,hi:['¡Hola! Qué día tan bonito en el fondo del mar.','Bzzz... ¡hola! Vengo sin prisa.']},
 {n:'MEDIO',cls:'t-mid',mult:1.25,drain:0.35,hi:['Buenas. Tengo un ratito, no mucho.','¡Hola! Espero que sean rápidos.']},
 {n:'DIFÍCIL',cls:'t-hard',mult:1.6,drain:0.5,hi:['Atención. Quiero lo mejor de la casa y YA.','Soy exigente: que quede perfecto.']}
];
const NAMES=['Burbuja','Coral','Perla','Nemo','Marea','Brisa','Ancla','Medusa','Cangrejo','Sirena','Delfín','Kraken'];
const HUES=[40,90,150,200,260,310];
const FCOL={'Fresa':'#ff8fb4','Chocolate':'#7a4528','Vainilla':'#fff1c9','Menta':'#7fe8c1','Oreo':'#6a6a78','Caramelo':'#e0a040','Tiramisú':'#c49a74','Coco':'#f4f4f4','Frambuesa':'#d6336c','Plátano':'#ffe066','Dulce de Leche':'#c98b4b','Chicle':'#ff9bd8'};
const MIXPOS={poco:20,medio:50,mucho:80};
const MIXTXT={poco:'poco batido, bien cremosito',medio:'a término medio',mucho:'muy batido, casi líquido'};
function pickTier(){ let r=Math.random(), L=state.level;
  let p=L<=1?[.7,.3,0]:L==2?[.4,.4,.2]:[.2,.4,.4];
  return r<p[0]?0:r<p[0]+p[1]?1:2; }

function init(){
    startBtn.onclick = start;
    pauseBtn.onclick = ()=>{state.paused=true; gameScreen.style.display='none'; pauseScreen.style.display='flex';};
    resumeBtn.onclick = ()=>{state.paused=false; pauseScreen.style.display='none'; gameScreen.style.display='flex'; renderCust();};
    restartBtn.onclick = restart;
    nextDayBtn.onclick = nxtDay;
    nextBtn.onclick = closeRes;
    tabs.forEach(t=>t.onclick=()=>goTab(t.dataset.station));
    updClock(); setInterval(tick,1000);
}

function start(){
    startScreen.style.display='none';
    gameScreen.style.display='flex';
    state={coins:0,level:1,day:1,time:480,paused:false,station:'orders',active:null,custIdx:-1,customers:[],cId:0,oId:0,doneToday:0,dayTips:0,spawned:0,left:0,cupSize:null,flavor:null,fill:0,syrup:false,mixPct:0,mixing:false,mixInt:null,cream:[],tops:[],mixLevel:MIXLEVEL[Math.floor(Math.random()*MIXLEVEL.length)].id};
    upd();
    addCust();
    goTab('orders');
    if(typeof Tutorial!=='undefined') Tutorial.maybeStart();
}

function upd(){
    coinsEl.textContent=state.coins;
    levelEl.textContent=state.level;
    dayEl.textContent=state.day;
    updClock();
}

/* Clientes del día: día 1 = 4, y +2 por cada día siguiente */
function dayTotal(){ return 4+(state.day-1)*2; }

/* El reloj avanza según los clientes ya resueltos (atendidos o que se fueron): 8:00 -> 17:00 */
function updClock(){
    let tot=dayTotal(), done=Math.min(tot,state.doneToday+state.left);
    state.time=480+Math.round(540*done/tot/5)*5;
    let h=Math.floor(state.time/60), m=state.time%60;
    clockEl.textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
}

/* El día termina cuando ya llegaron todos los clientes del día y la fila quedó vacía */
function dayDone(){ return state.spawned>=dayTotal() && state.customers.length==0; }

function addCust(){
    if(state.spawned>=dayTotal()) return;
    state.spawned++;
    let t=pickTier(), pool=CLIENTS.filter(x=>x.tier==t), cl=pool[Math.floor(Math.random()*pool.length)];
    let ml=MIXLEVEL[Math.floor(Math.random()*MIXLEVEL.length)];
    if(t==0 && ml.id=='mucho') ml=MIXLEVEL[1];
    let c={id:state.cId++, name:rname(), pat:100, tier:t, mult:TIER[t].mult, drain:TIER[t].drain, img:cl.img, acc:cl.acc,
        hue:HUES[Math.floor(Math.random()*HUES.length)], order:genOrd(t), mixLevel:ml.id, mixLabel:ml.label, stage:0, msgs:[], typing:false};
    state.customers.push(c);
    renderCust();
}

function rname(){ return NAMES[Math.floor(Math.random()*NAMES.length)]; }

function genOrd(t){
    let cup=CUP[Math.floor(Math.random()*CUP.length)].id;
    let fl=FLAV[Math.floor(Math.random()*FLAV.length)].id;
    let sy=SYR[Math.floor(Math.random()*SYR.length)];
    let ts=[]; let cnt=t==0?1+Math.floor(Math.random()*2):t==1?2:3+Math.floor(Math.random()*2); let used=[];
    for(let i=0;i<cnt;i++){let t; do{t=TOPS[Math.floor(Math.random()*TOPS.length)];}while(used.includes(t)); used.push(t); ts.push(t);}
    return {id:state.oId++, cup, fl, sy, tops:ts};
}

function avatarHTML(c,cls){ return '<img class="'+cls+'" src="assets/img/clients/c'+c.img+'.jpg" style="filter:hue-rotate('+c.hue+'deg) saturate(1.1)" alt="">'; }

function renderCust(){
    customersList.innerHTML='';
    state.customers.forEach((c,i)=>{
        let o=c.order, f=FLAV.find(x=>x.id==o.fl), T=TIER[c.tier], k=c.stage;
        let ord = k<2 ? '<div class="cust-order-line dim">Aún no ha pedido. Haz clic y atiéndelo.</div>' :
          '<div class="cust-order-line"><b>#'+o.id+'</b> · Vaso: <b>'+o.cup+'</b></div>'+
          '<div class="cust-order-line">Sabor: '+f.e+' <b>'+f.n+'</b></div>'+
          '<div class="cust-order-line">Jarabe: <b>'+o.sy+'</b></div>'+
          (k>=3 ? '<div class="cust-order-line">Toppings: <b>'+o.tops.join(', ')+'</b></div><div class="cust-order-line">Batido: <b>'+c.mixLabel+'</b></div>'
                : '<div class="cust-order-line dim">Toppings y batido: ???</div>');
        let wrap=document.createElement('div');
        wrap.className='cust-wrap';
        wrap.innerHTML='<div class="cust-card'+(i==state.custIdx?' active':'')+'"><div class="cust-top">'+avatarHTML(c,'cavatar')+
          '<div><div class="cust-name">'+c.name+'</div><span class="tier '+T.cls+'">'+T.n+'</span><div class="cust-acc">'+c.acc+'</div></div></div>'+
          '<div class="pat-bar"><div class="pat-fill" data-id="'+c.id+'" style="width:'+c.pat+'%"></div></div></div>'+
          '<div class="cust-order"><div class="cust-order-title">PEDIDO ACTUAL</div>'+ord+'</div>';
        wrap.querySelector('.cust-card').onclick=()=>pick(i);
        customersList.appendChild(wrap);
    });
}

let spawnT=0;
function tick(){
    if(state.paused||!customersList||gameScreen.style.display=='none')return;
    let gone=false;
    state.customers.forEach(c=>{ c.pat=Math.max(0,c.pat-c.drain); });
    for(let i=state.customers.length-1;i>=0;i--){ if(state.customers[i].pat<=0){ leave(i); gone=true; } }
    state.customers.forEach(c=>{ let el=customersList.querySelector('.pat-fill[data-id="'+c.id+'"]'); if(el) el.style.width=c.pat+'%'; });
    if(++spawnT>=22){ spawnT=0; if(state.customers.length<3 && state.spawned<dayTotal()) addCust(); }
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
    let map={orders:'ESTACIÓN DE PEDIDOS', build:'ESTACIÓN DE LLENADO', mix:'ESTACIÓN DE BATIDO', toppings:'ESTACIÓN DE TOPPINGS'};
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
    if(!state.active){ stationView.innerHTML='<div class="empty-chat"><div class="sec-title">Nadie te está hablando</div><div class="sec-sub">Elige a un cliente de la barra izquierda para atenderlo.</div></div>'; return; }
    let c=state.customers[state.custIdx], T=TIER[c.tier];
    if(c.stage==0){ c.stage=1; c.typing=true; setTimeout(()=>say(c,T.hi[Math.floor(Math.random()*2)]),700); }
    let o=c.order, f=FLAV.find(x=>x.id==o.fl);
    let script=[
      {me:'¡Bienvenido a Frosty Bites! ¿Qué te preparo?', bot:'Quiero un vaso '+o.cup.toLowerCase()+' de helado de '+f.n.toLowerCase()+', con jarabe de '+o.sy.toLowerCase()+'.', st:2},
      {me:'Perfecto. ¿Algo más?', bot:'Sí. Ponle '+o.tops.join(', ').toLowerCase()+'. Y lo quiero '+MIXTXT[c.mixLevel]+'.', st:3},
      {me:'¡Anotado! Te aviso cuando esté listo.', bot:c.tier==0?'¡Gracias! Tómate tu tiempo.':c.tier==1?'Rápido, por favor.':'Que quede PERFECTO o me voy.', st:4}
    ];
    let h='<div class="chat-head">'+avatarHTML(c,'avatar-lg')+'<div><div class="chat-name">'+c.name+'</div><span class="tier '+T.cls+'">'+T.n+'</span><div class="cust-acc">Lleva: '+c.acc+'</div></div></div><div class="chat-log" id="chatLog">';
    c.msgs.forEach(m=>{ h+= m.who=='bot' ? '<div class="msg-row"><span class="mini">'+avatarHTML(c,'cavatar')+'</span><div class="bubble-msg npc">'+m.t+'</div></div>' : '<div class="msg-row me-row"><div class="bubble-msg me">'+m.t+'</div></div>'; });
    if(c.typing) h+='<div class="msg-row"><span class="mini">'+avatarHTML(c,'cavatar')+'</span><div class="bubble-msg npc typing"><i></i><i></i><i></i></div></div>';
    h+='</div><div class="reply-area">';
    if(!c.typing){
        if(c.stage>=1 && c.stage<=3){ let sc=script[c.stage-1]; h+='<button class="go-btn reply" id="reply">'+sc.me+'</button>'; }
        else if(c.stage>=4) h+='<button class="go-btn" id="toBuild">Ir a la estación de llenado</button>';
    }
    h+='</div>';
    stationView.innerHTML=h;
    let lg=document.getElementById('chatLog'); if(lg) lg.scrollTop=lg.scrollHeight;
    let r=document.getElementById('reply');
    if(r) r.onclick=()=>{ let sc=script[c.stage-1]; c.msgs.push({who:'me',t:sc.me}); c.typing=true; draw(); setTimeout(()=>{ c.stage=sc.st; say(c,sc.bot); renderCust(); },800); };
    let tb=document.getElementById('toBuild'); if(tb) tb.onclick=()=>goTab('build');
}

function say(c,t){
    c.typing=false; c.msgs.push({who:'bot',t:t});
    if(state.customers[state.custIdx]===c && state.station=='orders') draw();
}

function vBuild(){
    if(!state.active){ stationView.innerHTML='<div style="text-align:center;margin-top:100px"><div style="font-size:calc(36px * var(--u));font-weight:900;color:#FF6347;margin-top:20px">TOMA UN PEDIDO PRIMERO</div></div>'; return; }
    let o=state.active, f=FLAV.find(x=>x.id==o.fl);
    let d=document.createElement('div');
    d.innerHTML='<div class="sec-title">ELEGIR VASO Y LLENAR</div><div class="sec-sub">PASO 1: Selecciona el tamaño del vaso • PASO 2: Llena hasta la línea marcada</div><div class="cup-grid">'+CUP.map(c=>'<div class="cup-card" data-c="'+c.id+'"><svg class="cup-svg" width="70" height="90" viewBox="0 0 70 90"><rect x="15" y="10" width="40" height="60" rx="4" fill="rgba(255,255,255,0.8)" stroke="#333" stroke-width="3"/><rect x="15" y="70" width="40" height="8" rx="0 0 4 4" fill="#333"/></svg><div class="cup-name">'+c.name+'</div><div class="cup-oz">'+c.oz+'</div></div>').join('')+'</div><div id="fillBox" style="display:none"><div class="sec-sub" style="font-size:calc(22px * var(--u))">Sabor solicitado: '+f.e+' <b>'+f.n+'</b></div><div class="disp-container"><div class="disp-machine"><div class="disp-top"></div><div class="cup-display" id="cdisp"><div class="fill-line-red" id="cline"></div><div class="fill-ice" id="fice"></div></div></div><button class="big-btn" id="hold">MANTENER PARA LLENAR</button><button class="syrup-btn2" id="syrb">AÑADIR JARABE: '+o.sy+'</button><br><button class="go-btn" id="gob" style="display:none;margin-top:20px">CONTINUAR AL BATIDO </button></div>';
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
    document.getElementById('syrb').onclick=e=>{ e.target.disabled=true; e.target.textContent='JARABE AÑADIDO'; e.target.style.opacity='0.6'; state.syrup=true; };
    document.getElementById('gob').onclick=()=>goTab('mix');
}

function vMix(){
    if(!state.active){ stationView.innerHTML='<div class="empty-chat"><div class="sec-title">Toma un pedido primero</div></div>'; return; }
    let c=state.customers[state.custIdx], tg=MIXPOS[c.mixLevel];
    let d=document.createElement('div');
    d.innerHTML='<div class="sec-title">BATIR AL PUNTO PERFECTO</div>'+
    '<div class="sec-sub">El cliente quiere: <b>'+c.mixLabel+'</b>. Detén el batido justo sobre la línea blanca.</div>'+
    '<div class="mix-area"><div class="mix-machine-big"><div class="blade-big" id="blade"></div></div>'+
    '<div class="progress-wrap"><div class="progress-bar mixbar"><div class="progress-fill" id="pfill"></div>'+
    '<div class="mix-zone" style="left:'+(tg-6)+'%;width:12%"></div><div class="mix-line" style="left:'+tg+'%"></div></div>'+
    '<div class="mix-scale"><span>POCO BATIDO</span><span>TÉRMINO MEDIO</span><span>MUY BATIDO</span></div>'+
    '<div class="mix-flag" style="left:'+tg+'%">▲ AQUÍ</div></div>'+
    '<div class="speed-grid"><button class="speed-card" data-s="slow">LENTO</button><button class="speed-card" data-s="med">MEDIO</button><button class="speed-card" data-s="fast">RÁPIDO</button></div>'+
    '<button class="go-btn" id="mstart" disabled>INICIAR BATIDO</button>'+
    '<button class="go-btn stop" id="mstop" style="display:none">DETENER BATIDO</button>'+
    '<button class="go-btn" id="mtop" style="display:none">IR A DECORAR</button><div class="mix-msg" id="mmsg"></div></div>';
    stationView.appendChild(d);
    let spd=null;
    function stopMix(auto){
        state.mixing=false;
        if(state.mixInt){clearInterval(state.mixInt); state.mixInt=null;}
        document.getElementById('blade').classList.remove('spin');
        document.getElementById('mstop').style.display='none';
        document.getElementById('mtop').style.display='inline-block';
        let dif=Math.abs(state.mixPct-tg);
        document.getElementById('mmsg').textContent= auto?'¡Se pasó de batido!': dif<=3?'¡Justo en la línea!': dif<=6?'Muy cerca':'Te alejaste de la línea';
    }
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
            if(state.mixPct>=100){ state.mixPct=100; document.getElementById('pfill').style.width='100%'; stopMix(true); return; }
            document.getElementById('pfill').style.width=state.mixPct+'%';
        },75);
    };
    document.getElementById('mstop').onclick=()=>stopMix(false);
    document.getElementById('mtop').onclick=()=>goTab('toppings');
}

function vTop(){
    if(!state.active){ stationView.innerHTML='<div class="empty-chat"><div class="sec-title">Toma un pedido primero</div></div>'; return; }
    let o=state.active, placed=state.tops||[];
    let d=document.createElement('div');
    function paint(){
        let col=FCOL[o.fl]||'#ff8fb4', fl=state.fill||60;
        d.innerHTML='<div class="sec-title">DECORAR Y TERMINAR</div><div class="top-grid2">'+
        '<div class="top-panel"><h3>TOPPINGS</h3><div class="sec-sub">Arrastra al vaso o toca para añadir. Toca uno añadido para quitarlo.</div>'+
        TOPS.map(t=>'<div class="top-draggable'+(placed.includes(t)?' used':'')+'" draggable="true" data-t="'+t+'">'+emo(t)+'<span>'+t+'</span></div>').join('')+'</div>'+
        '<div class="decor-area"><h3>TU CREACIÓN</h3><div class="mycup" id="mycup"><div class="mycup-tops">'+
        placed.map(t=>t=='Crema batida'?'<b class="dollop"></b>':'<i class="ico" style="--c:'+TCOL[t]+'"></i>').join('')+
        '</div><div class="mycup-ice" style="height:'+Math.min(92,fl)+'%;background:'+col+'"></div></div></div></div>'+
        '<div style="text-align:center;margin-top:22px"><button class="go-btn" id="finOrd">ENTREGAR PEDIDO</button></div>';
        d.querySelectorAll('.top-draggable').forEach(el=>{
            let t=el.dataset.t;
            el.ondragstart=e=>e.dataTransfer.setData('t',t);
            el.onclick=()=>{ let i=placed.indexOf(t); if(i>=0)placed.splice(i,1); else placed.push(t); state.tops=placed; paint(); };
        });
        let cup=d.querySelector('#mycup');
        cup.ondragover=e=>e.preventDefault();
        cup.ondrop=e=>{ e.preventDefault(); let t=e.dataTransfer.getData('t'); if(t&&!placed.includes(t)){ placed.push(t); state.tops=placed; paint(); } };
        d.querySelector('#finOrd').onclick=fin;
    }
    state.tops=placed; stationView.appendChild(d); paint();
}

const TCOL={'Chispas de chocolate':'#6b3a1e','Galleta':'#d9a05b','Cereza':'#d90429','Crema batida':'#fffaf0','Nueces':'#a47148','Lacasitos':'#4cc9f0','Mini Malvaviscos':'#ffd6e8'};
function emo(t){ let m={'Chispas de chocolate': '#6b3a1e', 'Galleta': '#d9a05b', 'Cereza': '#d90429', 'Crema batida': '#fffaf0', 'Nueces': '#a47148', 'Lacasitos': '#4cc9f0', 'Mini Malvaviscos': '#ffd6e8'}; return '<i class="ico" style="--c:'+(m[t]||'#8fd3ff')+'"></i>'; }

function fin(){
    if(!state.active||state.custIdx==-1)return;
    let c=state.customers[state.custIdx];
    let b=calcB(), mx=calcM(), tp=calcT(), wt=calcW(c);
    let avg=(b+mx+tp+wt)/4, st=Math.max(1,Math.min(5,Math.round(avg/20)));
    let tip=Math.floor(avg*0.75*c.mult);
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
    if(state.mixPct==0)return 55;
    let d=Math.abs(state.mixPct-MIXPOS[state.mixLevel]);
    return d<=3?100: d<=6?90: d<=10?78: d<=18?65: 50;
}

function calcT(){
    if(!state.active)return 60;
    let req=state.active.tops, pl=state.tops||[];
    let ok=pl.filter(t=>req.includes(t)).length, extra=pl.length-ok;
    return Math.max(20,Math.min(100,Math.round(ok/req.length*100-extra*15)));
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
    if(state.customers.length<4 && state.spawned<dayTotal()) setTimeout(()=>{addCust(); renderCust();},1500);
    if(dayDone()) setTimeout(endD,1000);
}

function leave(i){ state.left++; state.customers.splice(i,1); if(state.custIdx==i){state.custIdx=-1; state.active=null;} else if(state.custIdx>i) state.custIdx--; renderCust(); updClock(); if(dayDone()) setTimeout(endD,1000); }

function restart(){
    pauseScreen.style.display='none'; gameScreen.style.display='flex'; state.paused=false;
    state.customers=[]; state.cId=0; state.custIdx=-1; state.active=null; state.doneToday=0; state.dayTips=0; state.spawned=0; state.left=0; spawnT=0;
    if(state.mixInt){clearInterval(state.mixInt); state.mixInt=null;}
    upd(); renderCust(); goTab('orders'); addCust();
}

function endD(){
    state.paused=true; gameScreen.style.display='none'; endScreen.style.display='flex';
    dayTipsEl.textContent=state.dayTips; doneOrdersEl.textContent=state.doneToday; totalCoinsEl.textContent=state.coins;
}

function nxtDay(){
    endScreen.style.display='none'; gameScreen.style.display='flex'; state.paused=false;
    state.day++; state.level=Math.floor(state.day/2)+1; state.customers=[]; state.cId=0; state.custIdx=-1; state.active=null; state.doneToday=0; state.dayTips=0; state.spawned=0; state.left=0; spawnT=0;
    if(state.mixInt){clearInterval(state.mixInt); state.mixInt=null;}
    upd(); renderCust(); goTab('orders'); addCust();
}

document.addEventListener('DOMContentLoaded',init);
