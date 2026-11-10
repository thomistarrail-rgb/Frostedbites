/* Tutorial guiado: cursor neón con rastro de burbujas */
const Tutorial=(function(){
  const STEPS=[
    {sel:'.topbar-left',t:'Arriba ves tus <b>monedas</b>, nivel, día y el reloj del turno.'},
    {sel:'#customersList',t:'Aquí llegan los clientes. Su <b>accesorio</b> dice qué tan difícil es: concha o coral = <b>fácil</b>, gorro o casco = <b>medio</b>, sombrero o medalla = <b>difícil</b> (pero paga más).'},
    {sel:'#customersList',t:'<b>Haz clic en un cliente</b> para atenderlo. Su pedido se va llenando en esta barra mientras hablas con él.'},
    {sel:'#stationView',t:'Esta zona es la <b>conversación</b>. Responde con los botones y el cliente te dirá qué quiere.'},
    {sel:'[data-station="build"]',t:'<b>Llenado:</b> elige el vaso, mantén el botón para llenar hasta la línea y añade el jarabe.'},
    {sel:'[data-station="mix"]',t:'<b>Batido:</b> el cliente pide poco, medio o muy batido. Detén el batido justo sobre la <b>línea blanca</b>. Si te quedas corto o te pasas, pierdes puntos.'},
    {sel:'[data-station="toppings"]',t:'<b>Toppings:</b> arrastra al vaso solo lo que pidió. La <b>crema batida</b> también es un topping. ¡Y listo, a entregar!'}
  ];
  let i=0,layer,ring,cur,bub,trailTimer;
  function el(c,tag){let e=document.createElement(tag||'div');e.className=c;layer.appendChild(e);return e;}
  function trail(){
    let r=cur.getBoundingClientRect(), b=document.createElement('img');
    b.className='trail'; b.src='assets/img/bubble-'+(Math.random()<.5?'sm':'big')+'.png';
    let z=10+Math.random()*14; b.style.cssText='width:'+z+'px;left:'+(r.left+8+Math.random()*10)+'px;top:'+(r.top+14+Math.random()*10)+'px';
    layer.appendChild(b); setTimeout(()=>b.remove(),1100);
  }
  function show(){
    let s=STEPS[i]; if(!s)return end();
    let t=document.querySelector(s.sel); if(!t){i++;return show();}
    let r=t.getBoundingClientRect(), pad=6;
    ring.style.cssText='left:'+(r.left-pad)+'px;top:'+(r.top-pad)+'px;width:'+(r.width+pad*2)+'px;height:'+(r.height+pad*2)+'px';
    cur.style.left=(r.left+r.width*0.55)+'px'; cur.style.top=(r.top+Math.min(r.height*0.5,160))+'px';
    clearInterval(trailTimer); trailTimer=setInterval(trail,70); setTimeout(()=>clearInterval(trailTimer),950);
    bub.innerHTML=s.t+'<div class="tut-btns"><button class="skip" id="tSkip">Saltar</button><button id="tNext">'+(i==STEPS.length-1?'¡A jugar!':'Siguiente')+'</button></div>';
    let bw=Math.min(440,innerWidth*0.86), bx=r.left+r.width/2-bw/2, by=r.bottom+24;
    if(by+190>innerHeight) by=Math.max(10,r.top-200);
    if(r.height>innerHeight*0.5) by=innerHeight-220;
    bub.style.left=Math.max(10,Math.min(innerWidth-bw-10,bx))+'px'; bub.style.top=by+'px';
    document.getElementById('tNext').onclick=()=>{i++;show();};
    document.getElementById('tSkip').onclick=end;
  }
  function end(){ clearInterval(trailTimer); if(layer)layer.remove(); layer=null; try{localStorage.setItem('fb_tut','1');}catch(e){} state.paused=false; }
  function start(){
    if(layer)layer.remove(); i=0; state.paused=true;
    layer=document.createElement('div'); layer.id='tutLayer'; document.body.appendChild(layer);
    ring=el('tut-ring'); bub=el('tut-bubble'); cur=el('tut-cursor','img'); cur.src='assets/img/cursor.png';
    cur.style.left='50%'; cur.style.top='50%';
    setTimeout(show,150);
  }
  function maybeStart(){ let seen=false; try{seen=localStorage.getItem('fb_tut')=='1';}catch(e){} if(!seen) setTimeout(start,400); }
  return {start,maybeStart};
})();
