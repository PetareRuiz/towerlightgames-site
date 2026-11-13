/* Tower Light Games: idioma, topo, menu de vidro e as páginas de manual e tutorial */
(function(){
"use strict";
var LANGS=[["pt","Português"],["en","English"],["es","Español"],["fr","Français"],["de","Deutsch"],["it","Italiano"]];
var LOC={pt:"pt-BR",en:"en-US",es:"es-ES",fr:"fr-FR",de:"de-DE",it:"it-IT"};
var IDX={pt:0,en:1,es:2,fr:3,de:4,it:5};
var PAG=document.body.dataset.pagina||"inicio";
var LANG=(function(){var s=null;try{s=localStorage.getItem("tlg_lang");}catch(e){}if(s&&IDX[s]!==undefined)return s;
  var d=document.body.dataset.padrao;if(d&&!s)return d;
  var n=((navigator.languages&&navigator.languages[0])||navigator.language||"pt").slice(0,2).toLowerCase();return IDX[n]!==undefined?n:"en";})();
function t(k){var a=window.I18N.S[k]||window.I18N.P[k];return a?(a[IDX[LANG]]||a[0]):k;}
var $=function(s,r){return (r||document).querySelector(s);},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};

/* ---------- topo ---------- */
var topo=document.createElement("header");topo.className="topo";
topo.innerHTML='<a class="marca" href="index.html"><img src="img/tlg_icone.png" alt="">Tower Light Games</a>'+
  '<div class="idioma"><button type="button" aria-haspopup="true" aria-expanded="false"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg><span></span></button><ul role="menu"></ul></div>';
document.body.prepend(topo);
var idi=$(".idioma",topo);
$("ul",idi).innerHTML=LANGS.map(function(l){return '<li><button type="button" role="menuitem" data-l="'+l[0]+'">'+l[1]+'</button></li>';}).join("");
$("button",idi).onclick=function(e){e.stopPropagation();var o=idi.classList.toggle("open");this.setAttribute("aria-expanded",o);};
document.addEventListener("click",function(){idi.classList.remove("open");});
$$("[data-l]",idi).forEach(function(b){b.onclick=function(){LANG=b.dataset.l;try{localStorage.setItem("tlg_lang",LANG);}catch(e){}idi.classList.remove("open");aplicar();};});
addEventListener("scroll",function(){topo.classList.toggle("solid",scrollY>20);},{passive:true});topo.classList.toggle("solid",scrollY>20);

/* ---------- menu de vidro: barra com recorte curvo que sobe sob o item ativo, com brilho dourado ---------- */
var ICON={
  inicio:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  jogo:'<path d="M6.5 7.5h11a4 4 0 014 4.3l-.5 4.7a2.6 2.6 0 01-4.6 1.4L14.6 15H9.4l-1.8 2.9A2.6 2.6 0 013 16.5l-.5-4.7a4 4 0 014-4.3z"/><path d="M7.5 10.5v3M6 12h3"/><circle cx="15.5" cy="11" r=".6" fill="currentColor"/><circle cx="17.5" cy="13" r=".6" fill="currentColor"/>',
  manual:'<path d="M4 4.5A2.5 2.5 0 016.5 2H20v17H6.5A2.5 2.5 0 004 21.5z"/><path d="M4 19.5V4.5"/><path d="M9 7h7M9 11h5"/>',
  tutorial:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  estudio:'<path d="M9 21V10h6v11"/><path d="M8 10l4-7 4 7"/><path d="M6 21h12"/><path d="M12 13v2"/>'};
var ITENS=[["inicio","index.html#inicio","nav.inicio"],["jogo","index.html#jogo","nav.jogo"],["manual","manual.html","nav.manual"],["tutorial","tutorial.html","nav.tutorial"],["estudio","index.html#estudio","nav.estudio"]];
var nav=document.createElement("nav");nav.className="nav";nav.setAttribute("aria-label","Menu");
nav.innerHTML='<div class="vidro"></div><svg aria-hidden="true"><defs>'+
  '<linearGradient id="nvBrilho" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0"><stop offset="0" stop-color="#e0b062" stop-opacity="0"/><stop offset=".5" stop-color="#ffd27a" stop-opacity="1"/><stop offset="1" stop-color="#e0b062" stop-opacity="0"/></linearGradient>'+
  '<radialGradient id="nvLuz" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="46"><stop offset="0" stop-color="#ffcf73" stop-opacity=".38"/><stop offset="1" stop-color="#ffcf73" stop-opacity="0"/></radialGradient>'+
  '<filter id="nvGlow" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="3.2"/></filter></defs>'+
  '<path class="borda" fill="none" stroke="rgba(241,230,204,.16)" stroke-width="1"/>'+
  '<ellipse class="luz" fill="url(#nvLuz)"/>'+
  '<path class="arco glow" fill="none" stroke="url(#nvBrilho)" stroke-width="3" filter="url(#nvGlow)"/>'+
  '<path class="arco" fill="none" stroke="url(#nvBrilho)" stroke-width="1.6"/></svg><div class="itens"></div>';
document.body.appendChild(nav);
$(".itens",nav).innerHTML=ITENS.map(function(i){return '<a href="'+i[1]+'" data-id="'+i[0]+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+ICON[i[0]]+'</svg><span data-i="'+i[2]+'"></span></a>';}).join("");
var NV={cx:0,alvo:0,ativo:null,raf:0};
function caminho(W,H,cx){var y0=20,yt=1,bw=38,R=24;cx=Math.max(bw+2,Math.min(W-bw-2,cx));
  // perto das pontas o canto da barra fica mais fechado, para o arco caber exatamente sobre o primeiro e o último item
  var rl=Math.max(6,Math.min(R,cx-bw)),rr=Math.max(6,Math.min(R,W-cx-bw));
  var arco=" C"+(cx-bw*.45)+","+y0+" "+(cx-bw*.55)+","+yt+" "+cx+","+yt+" C"+(cx+bw*.55)+","+yt+" "+(cx+bw*.45)+","+y0+" "+(cx+bw)+","+y0;
  return {cheio:"M"+rl+","+y0+" L"+(cx-bw)+","+y0+arco+" L"+(W-rr)+","+y0+" Q"+W+","+y0+" "+W+","+(y0+rr)+" L"+W+","+(H-R)+" Q"+W+","+H+" "+(W-R)+","+H+" L"+R+","+H+" Q0,"+H+" 0,"+(H-R)+" L0,"+(y0+rl)+" Q0,"+y0+" "+rl+","+y0+" Z",
    arco:"M"+Math.max(rl,cx-bw-34)+","+y0+" L"+(cx-bw)+","+y0+arco+" L"+Math.min(W-rr,cx+bw+34)+","+y0,cx:cx};}
function desenhaNav(){var W=nav.clientWidth,H=nav.clientHeight,p=caminho(W,H,NV.cx);
  $(".vidro",nav).style.clipPath="path('"+p.cheio+"')";$(".borda",nav).setAttribute("d",p.cheio);
  $$(".arco",nav).forEach(function(a){a.setAttribute("d",p.arco);});
  var g=$("#nvBrilho");g.setAttribute("x1",p.cx-90);g.setAttribute("x2",p.cx+90);
  var l=$("#nvLuz");l.setAttribute("cx",p.cx);l.setAttribute("cy",26);
  var e=$(".luz",nav);e.setAttribute("cx",p.cx);e.setAttribute("cy",26);e.setAttribute("rx",48);e.setAttribute("ry",30);}
function centroDe(id){var a=$('[data-id="'+id+'"]',nav);if(!a)return nav.clientWidth/2;var ra=a.getBoundingClientRect(),rn=nav.getBoundingClientRect();return (ra.left-rn.left)+ra.width/2;}
function ativa(id,instant){if(NV.ativo===id&&!instant)return;NV.ativo=id;$$(".itens a",nav).forEach(function(a){a.classList.toggle("on",a.dataset.id===id);if(a.dataset.id===id)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
  NV.alvo=centroDe(id);cancelAnimationFrame(NV.raf);
  if(instant||matchMedia("(prefers-reduced-motion: reduce)").matches){NV.cx=NV.alvo;desenhaNav();return;}
  var de=NV.cx,t0=performance.now();(function f(n){var k=Math.min(1,(n-t0)/420),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;NV.cx=de+(NV.alvo-de)*e;desenhaNav();if(k<1)NV.raf=requestAnimationFrame(f);})(t0);}
addEventListener("resize",function(){NV.cx=NV.alvo=centroDe(NV.ativo);desenhaNav();});
// na página inicial, o menu acompanha a seção que está na tela
if(PAG==="inicio"){
  $$(".itens a",nav).forEach(function(a){if(a.getAttribute("href").indexOf("index.html#")===0)a.setAttribute("href",a.getAttribute("href").replace("index.html",""));});
  var secs=["inicio","jogo","estudio"].map(function(i){return document.getElementById(i);}).filter(Boolean);
  var spy=function(){var y=scrollY+innerHeight*.45,at="inicio";secs.forEach(function(s){if(s.offsetTop<=y)at=s.id;});if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)at="estudio";ativa(at);};
  addEventListener("scroll",spy,{passive:true});ativa("inicio",true);spy();
}else ativa(PAG==="privacidade"?"estudio":PAG,true);

/* ---------- textos ---------- */
function aplicar(){
  document.documentElement.lang=LOC[LANG].slice(0,2)==="pt"?"pt-BR":LANG;
  $$("[data-i]").forEach(function(e){e.textContent=t(e.dataset.i);});
  $$("[data-ih]").forEach(function(e){e.innerHTML=t(e.dataset.ih);});
  $("span",$(".idioma>button")).textContent=LANG.toUpperCase();
  $$("[data-l]",idi).forEach(function(b){b.setAttribute("aria-current",b.dataset.l===LANG);});
  var m=document.querySelector('meta[name="description"]');if(m)m.setAttribute("content",t("meta"));
  if(document.body.dataset.titulo)document.title=t(document.body.dataset.titulo)+" · Tower Light Games";
  if(PAG==="manual")Manual.render();
  if(PAG==="tutorial")Tutorial.render();
  document.dispatchEvent(new Event("tlg-idioma"));
  requestAnimationFrame(function(){NV.cx=NV.alvo=centroDe(NV.ativo);desenhaNav();});}

/* ---------- manual: cards gerados pelo próprio jogo ---------- */
var Manual={aba:"torres",dif:"medio",dados:{},vida:null,abertos:{},
  carrega:function(l){var self=this;if(this.dados[l])return Promise.resolve(this.dados[l]);
    return Promise.all([fetch("data/manual_"+l+".json").then(function(r){return r.json();}),this.vida?Promise.resolve(this.vida):fetch("data/vida.json").then(function(r){return r.json();})])
      .then(function(r){self.dados[l]=r[0];self.vida=r[1];return r[0];});},
  render:function(){var self=this,l=LANG;this.carrega(l).then(function(d){if(l!==LANG)return;self.desenha(d);});},
  desenha:function(d){var self=this;var abas=[["torres",d.ui.Torres]].concat(d.fases.map(function(f){return [f.tema,d.nomesFase[f.tema]];}));
    var A=$("#abas");A.innerHTML=abas.map(function(a){return '<button role="tab" data-aba="'+a[0]+'" aria-selected="'+(a[0]===self.aba)+'">'+a[1]+'</button>';}).join("");
    $$("button",A).forEach(function(b){b.onclick=function(){self.aba=b.dataset.aba;self.desenha(d);var c=$("#lista");scrollTo({top:Math.max(0,c.offsetTop-150),behavior:"smooth"});};});
    var D=$("#dif");D.style.display=this.aba==="torres"?"none":"flex";
    D.innerHTML='<span>'+t("man.dif")+':</span>'+[["facil","Fácil"],["medio","Médio"],["dificil","Difícil"]].map(function(x){return '<button data-d="'+x[0]+'" aria-pressed="'+(x[0]===self.dif)+'">'+d.ui[x[1]]+'</button>';}).join("");
    $$("button",D).forEach(function(b){b.onclick=function(){self.dif=b.dataset.d;self.desenha(d);};});
    var L=$("#lista"),N=$("#nota");
    if(this.aba==="torres"){N.textContent=t("man.torresInfo");L.innerHTML=d.torres.concat([d.fenda]).join("");}
    else{N.textContent=t("man.spoiler");var f=d.fases.filter(function(x){return x.tema===self.aba;})[0];
      L.innerHTML=f.inimigos.map(function(e){return '<div class="cw" data-t="'+e.t+'">'+e.html+'</div>';}).join("");
      $$(".cw",L).forEach(function(w){var k=w.dataset.t,v=self.vida[k][self.dif],card=$(".hc",w);var b=$(".st span b",card);
        var fmt=function(n){return n.toLocaleString(LOC[LANG]);};
        if(b){if(v[0]===v[1])b.textContent=fmt(v[0]);else{b.innerHTML=fmt(v[0])+" → "+fmt(v[1])+"<small>"+t("man.faixa")+"</small>";}}
        if(card.classList.contains("chefe")&&!self.abertos[k]){card.classList.add("oculto");var bt=document.createElement("button");bt.className="revelar";bt.type="button";bt.innerHTML="<span>"+t("man.revelar")+"</span>";
          bt.onclick=function(){self.abertos[k]=1;card.classList.remove("oculto");bt.remove();};card.appendChild(bt);}});}
    $$("img",L).forEach(function(i){i.setAttribute("src",i.getAttribute("src").replace(/^img\//,"img/jogo/"));i.setAttribute("loading","lazy");});}};

/* ---------- tutorial ilustrado: prints do treinamento do jogo em cada idioma ---------- */
var Tutorial={render:function(){var P=window.I18N.TUT,L=$("#passos");
  L.innerHTML=P.map(function(p,i){return '<article class="passo"><img class="tela" loading="lazy" width="390" height="844" src="img/tutorial/'+LANG+'_'+(i+1)+'.webp" alt="">'+
    '<div><div class="num">'+t("tut.passo")+' '+(i+1)+'</div><h3>'+t("t"+(i+1))+'</h3>'+p[IDX[LANG]].map(function(x){return "<p>"+x+"</p>";}).join("")+'</div></article>';}).join("");}};

/* prévia em vídeo: toca sem som quando aparece na tela; o botão liga o som */
var V=document.getElementById("previa");
if(V){var SB=document.getElementById("somv");var calmo=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rot=function(){SB.setAttribute("aria-label",t(V.muted?"som.on":"som.off"));SB.title=SB.getAttribute("aria-label");SB.setAttribute("aria-pressed",!V.muted);};
  SB.onclick=function(){V.muted=!V.muted;if(!V.muted)V.play().catch(function(){});rot();};rot();
  if("IntersectionObserver" in window&&!calmo)new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)V.play().catch(function(){});else V.pause();});},{threshold:.35}).observe(V);
  else if(calmo){V.controls=true;}
  document.addEventListener("tlg-idioma",rot);}
aplicar();
})();
