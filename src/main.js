import './style.css';
// Vite modules are scoped, so expose the functions the HTML calls
/* ===== DATA ===== */
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),cv=$('#c'),X=cv.getContext('2d'),rnd=Math.random,GY=470;
const HERO=[
{n:'VINAYAKA',t:'LORD OF NEW BEGINNINGS',r:'Balanced',a:'Ganapati Charge',d:'A powerful forward movement that gives the player extra control over the ball.',j:'#d8332b',sp:4.4,pw:1,jm:1,sk:'#f3a58c'},
{n:'KARTIKEYA',t:'THE DIVINE WARRIOR',r:'Speed',a:'Vel Dash',d:'A fast movement burst useful for reaching the ball.',j:'#1c3d8f',sp:5.2,pw:.85,jm:1,sk:'#e9b287'},
{n:'KRISHNA',t:'THE STRATEGIST',r:'Strategy',a:'Flute Flow',d:'Temporarily improves ball control.',j:'#f2c230',sp:4.4,pw:.9,jm:1.03,sk:'#4b9fe0'},
{n:'HANUMAN',t:'THE DEVOTEE',r:'Power',a:'Vayu Leap',d:'A powerful jump that can help intercept or strike the ball.',j:'#e8531f',sp:4.2,pw:1.3,jm:1.12,sk:'#e18b3f'}];
const DIF={EASY:{s:.65,rt:16,k:.04,sp:.3},NORMAL:{s:.85,rt:8,k:.12,sp:1},HARD:{s:1.05,rt:3,k:.5,sp:2}};
const DEF={mus:.6,thm:.7,sfx:.8,on:true,diff:'NORMAL'};
let st='MAIN_MENU',from='GAME_MENU',hero=0,ci=0,bot=1,set={...DEF},W,H,T=0,M=null,b,P=[],K={};
/* ===== AUDIO (all synthesized with WebAudio, no files needed) ===== */
let A,gm,gt,gs,NB,s16=0,nt=0,mi=4;const SC=[0,1,4,5,7,8,11,12,13,16,19,20]; // Bhairav-style scale
function applyVol(){if(!A)return;gm.gain.value=set.on?set.mus*.5:0;gt.gain.value=set.on?set.thm*.5:0;gs.gain.value=set.sfx}
function ainit(){if(A){A.state=='suspended'&&A.resume();return}
 try{A=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return}
 gm=A.createGain();gt=A.createGain();gs=A.createGain();[gm,gt,gs].forEach(g=>g.connect(A.destination));
 [130.8,196].forEach((f,i)=>{const o=A.createOscillator(),g=A.createGain();o.frequency.value=f;g.gain.value=.12/(i+1);o.connect(g).connect(gm);o.start()}); // tanpura-like drone
 NB=A.createBuffer(1,A.sampleRate,A.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=rnd()*2-1;
 applyVol();setInterval(sched,90)}
function tone(f,t,d,ty='sine',v=.3,o=gs,e){if(!A)return;const s=A.createOscillator(),g=A.createGain();s.type=ty;s.frequency.setValueAtTime(f,t);if(e)s.frequency.exponentialRampToValueAtTime(e,t+d);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(g).connect(o);s.start(t);s.stop(t+d+.05)}
function nz(t,d,v,o=gs){if(!A)return;const s=A.createBufferSource(),g=A.createGain(),f=A.createBiquadFilter();f.type='highpass';f.frequency.value=3000;s.buffer=NB;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f).connect(g).connect(o);s.start(t);s.stop(t+d)}
function sfx(k){if(!A)return;const t=A.currentTime;({click:()=>tone(900,t,.08,'sine',.3),open:()=>{tone(520,t,.15);tone(780,t+.08,.2)},
 kick:()=>{tone(200,t,.12,'sine',.8,gs,60);nz(t,.06,.4)},hit:()=>tone(130,t,.08,'sine',.5),
 goal:()=>[523,659,784,1046,1318].forEach((f,i)=>tone(f,t+i*.09,.5,'triangle',.4)),sp:()=>tone(300,t,.45,'sawtooth',.2,gs,1400),
 start:()=>{tone(2100,t,.25,'sine',.3);tone(2100,t+.35,.4,'sine',.3)},win:()=>[523,659,784,1046].forEach((f,i)=>tone(f,t+i*.15,.4,'triangle',.4)),
 lose:()=>[392,330,262].forEach((f,i)=>tone(f,t+i*.2,.4,'sine',.4))})[k]?.()}
// Music sequencer: MUSIC slider = drone + tabla, THEME slider = flute melody + bell. Calm in menus, energetic in matches.
function sched(){if(!A)return;const fast=['PLAYING','PAUSED','MATCH_INTRO'].includes(st),d=60/(fast?132:84)/4;if(nt<A.currentTime)nt=A.currentTime+.05;
 while(nt<A.currentTime+.3){const i=s16,t=nt;
  if(i%4==0||(fast&&i%8==6))tone(110,t,.25,'sine',.9,gm,55);
  if(fast?i%2:i==4||i==12)nz(t,.05,.5,gm);
  if(i%8==0)tone(1568,t,.8,'sine',.12,gt);
  if(i%(fast?2:4)==0&&rnd()<.85){mi=Math.max(0,Math.min(11,mi+(rnd()*5|0)-2));tone(261.6*2**(SC[mi]/12),t,d*(fast?2:4),'triangle',.3,gt)}
  s16=(s16+1)%16;nt+=d}}
/* ===== ART (characters drawn procedurally; same function used in menus, cards and match) ===== */
function dh(g,k,x,y,s,f,t,run,air){const p=HERO[k],sw=Math.sin(t*13)*run*11,r=k?20:25,sk=p.sk,a=air?8:sw,c=air?-8:-sw;
 const el=(x,y,rx,ry,col)=>{g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill()};
 g.save();g.translate(x,y);g.scale(s*f,s);g.lineCap='round';
 if(k==3){g.strokeStyle='#c96a1e';g.lineWidth=6;g.beginPath();g.moveTo(-10,-45);g.bezierCurveTo(-50,-40,-42,-95,-22,-98);g.stroke()}
 if(k==1){g.strokeStyle='#f5b82e';g.lineWidth=4;g.beginPath();g.moveTo(-24,-8);g.lineTo(-32,-140);g.stroke();g.fillStyle='#ffe08a';g.beginPath();g.moveTo(-33,-168);g.lineTo(-41,-138);g.lineTo(-24,-138);g.fill()}
 g.fillStyle=sk;g.fillRect(-14+a,-36,10,30);g.fillRect(4+c,-36,10,30);g.fillStyle='#fff';g.fillRect(-15+a,-14,12,8);g.fillRect(3+c,-14,12,8);
 el(-8+a,-3,10,5,'#222');el(10+c,-3,10,5,'#222');
 g.fillStyle='#12225e';g.fillRect(-18,-46,36,14);g.fillStyle=p.j;g.beginPath();g.roundRect(-19,-82,38,40,8);g.fill();
 g.strokeStyle=sk;g.lineWidth=9;g.beginPath();g.moveTo(-17,-74);g.lineTo(-24,-52+sw*.5);g.moveTo(17,-74);g.lineTo(26,-54-sw*.5);g.stroke();
 g.strokeStyle='#f5b82e';g.lineWidth=3;g.beginPath();g.arc(0,-82,13,0,3.14);g.stroke();el(0,-62,6,6,'#f5b82e');
 if(k==0){el(-25,-92,15,20,'#f7b39a');el(27,-92,15,20,'#f7b39a')}
 if(k==1||k==2)el(-2,-97,r+2,r,'#1a1010');
 if(k==1)el(-7,-120,7,8,'#1a1010');
 el(0,-92,r,r,sk);
 if(k==3){el(9,-86,10,9,'#f3b06a');el(-r+2,-92,5,7,sk)}
 if(k==0){g.strokeStyle=sk;g.lineWidth=10;g.beginPath();g.moveTo(8,-84);g.quadraticCurveTo(24,-66,10,-56);g.stroke();g.fillStyle='#fff';g.beginPath();g.moveTo(14,-80);g.lineTo(24,-74);g.lineTo(14,-73);g.fill();g.fillStyle='#d8332b';g.fillRect(6,-112,3,10)}
 el(3,-95,4,5,'#fff');el(14,-95,4,5,'#fff');el(4,-95,2,3,'#222');el(15,-95,2,3,'#222');
 if(k){g.strokeStyle='#5a2a1a';g.lineWidth=2;g.beginPath();g.arc(9,-87,5,.2,2.9);g.stroke()}
 if(k==2){g.strokeStyle='#8a4b1a';g.lineWidth=3;g.beginPath();g.moveTo(10,-68);g.lineTo(36,-58);g.stroke();el(-4,-121,5,13,'#1f9d6a');el(-4,-125,2.5,5,'#2a5cd0')}
 else{g.save();g.translate(0,-(r-20));g.fillStyle='#f5b82e';g.beginPath();g.moveTo(-14,-105);g.lineTo(-12,-124);g.lineTo(-5,-113);g.lineTo(0,-130);g.lineTo(5,-113);g.lineTo(12,-124);g.lineTo(14,-105);g.fill();g.restore()}
 g.restore()}
function pc(id,k,f=1){const c=$('#'+id),g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);dh(g,k,c.width/2,c.height-8,c.height/175,f,0,0)}
const BG={};
function bg(w,h){w|=0;h|=0;const key=w+'x'+h;if(BG[key])return BG[key];if(Object.keys(BG).length>3)for(const q in BG)delete BG[q];
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),hz=h*.56,k=h/560;
 let q=g.createLinearGradient(0,0,0,hz);q.addColorStop(0,'#1a1450');q.addColorStop(.55,'#8a2f6b');q.addColorStop(1,'#ff9a3c');g.fillStyle=q;g.fillRect(0,0,w,hz);
 g.fillStyle='#2b1240';[.14,.86].forEach(p=>{for(let i=0;i<6;i++){const bw=(110-i*15)*k,bh=22*k;g.fillRect(w*p-bw/2,hz*.75-(i+1)*bh,bw,bh-2)}}); // temple towers
 q=g.createLinearGradient(0,hz*.72,0,hz);q.addColorStop(0,'#1c1640');q.addColorStop(1,'#0d0a26');g.fillStyle=q;g.fillRect(0,hz*.72,w,hz*.28);
 const cs=['#ff8a2a','#f5b82e','#d8332b','#3d6ad6','#fff3d6','#7a3fa0'];g.globalAlpha=.55;
 for(let r=0,y=hz*.76;y<hz-4;y+=9*k,r++)for(let x=(r%2)*6*k;x<w;x+=12*k){g.fillStyle=cs[(x*7/k+r*13|0)%6];g.beginPath();g.arc(x,y,3.4*k,0,7);g.fill()}
 g.globalAlpha=1;for(let x=20*k,i=0;x<w;x+=58*k,i++){g.fillStyle=cs[i%3];g.fillRect(x,hz*.66,16*k,38*k);g.fillStyle='#f5b82e';g.fillRect(x,hz*.66,16*k,3*k)} // festival banners
 for(let i=0;i<10;i++){g.fillStyle=i%2?'#2f9a3d':'#278a35';g.fillRect(i*w/10,hz,w/10+1,h-hz)}
 q=g.createLinearGradient(0,hz,0,h);q.addColorStop(0,'rgba(0,0,0,.35)');q.addColorStop(.5,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(0,hz,w,h-hz);
 g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=3*k;g.beginPath();g.moveTo(w/2,hz);g.lineTo(w/2,h);g.stroke();g.beginPath();g.ellipse(w/2,(hz+h)/2+h*.03,90*k,45*k,0,0,7);g.stroke();
 g.fillStyle='#0b1230';g.fillRect(0,hz-6*k,w,8*k);g.fillStyle='#f5b82e';g.fillRect(0,hz-6*k,w,2*k);
 for(let x=30*k;x<w;x+=90*k){g.fillStyle='#ff8a2a';g.beginPath();g.arc(x,hz-12*k,3*k,0,7);g.fill()} // diyas
 return BG[key]=c}
function lights(w,h){[.04,.96].forEach(p=>{const q=X.createRadialGradient(w*p,h*.16,2,w*p,h*.16,h*.3);q.addColorStop(0,'rgba(255,240,180,.9)');q.addColorStop(1,'rgba(255,200,90,0)');X.fillStyle=q;X.fillRect(0,0,w,h*.6)})}
function goal(x,d){X.fillStyle='rgba(255,255,255,.14)';X.fillRect(x,GY-150,60,160);X.strokeStyle='rgba(255,255,255,.3)';X.lineWidth=1;
 for(let i=0;i<=60;i+=10){X.beginPath();X.moveTo(x+i,GY-150);X.lineTo(x+i,GY+10);X.stroke()}for(let j=0;j<=160;j+=10){X.beginPath();X.moveTo(x,GY-150+j);X.lineTo(x+60,GY-150+j);X.stroke()}
 X.strokeStyle='#fff';X.lineWidth=6;const xi=d>0?x+60:x;X.beginPath();X.moveTo(x,GY-150);X.lineTo(x+60,GY-150);X.moveTo(xi,GY-150);X.lineTo(xi,GY+10);X.stroke()}
/* ===== MATCH LOGIC ===== */
function mk(h,x,f){return{hi:h,h:HERO[h],x,y:GY,vx:0,vy:0,f,kc:0,spc:0,scd:0,boost:0,mag:0,dash:0,sl:0,sm:1,tx:x}}
function rst(){b={x:500,y:200,vx:0,vy:0,r:14,rot:0};M.p1.x=250;M.p2.x=750;[M.p1,M.p2].forEach(p=>{p.y=GY;p.vx=p.vy=0})}
function newMatch(){M={time:60,tk:0,fz:0,sc:[0,0],txt:'',p1:mk(hero,250,1),p2:mk(bot,750,-1)};M.p2.sm=DIF[set.diff].s;rst();
 $('#hn1').textContent='YOU • '+HERO[hero].n;$('#hn2').textContent=HERO[bot].n+' • BOT';$('#s1').textContent=$('#s2').textContent=0;go('PLAYING');sfx('start')}
function kick(p){if(p.kc>0)return;p.kc=18;if(Math.hypot(b.x-(p.x+p.f*30),b.y-(p.y-20))<64){b.vx=p.f*(9+p.h.pw*3)*(p.boost>0?1.3:1);b.vy=-3.5-rnd()*5;sfx('kick')}}
function spec(p){p.spc=420;sfx('sp');[()=>p.boost=90,()=>p.dash=14,()=>p.mag=180,()=>{p.vy=-17;p.boost=60}][p.hi]()} // each hero's special move
function ctl(p,l,r,u,s,k,x){const a=(r?1:0)-(l?1:0);if(a)p.f=a;['kc','spc','scd','boost','mag','dash','sl'].forEach(q=>{if(p[q]>0)p[q]--});
 const sp=p.h.sp*(p.boost>0&&p.hi==0?1.5:1)*p.sm;p.vx=p.sl>0?p.f*9:p.dash>0?p.f*17:a*sp; // S = defensive slide
 if(u&&p.y>=GY)p.vy=-11.5*p.h.jm;if(s&&p.scd<=0&&p.y>=GY){p.sl=12;p.scd=50}if(k)kick(p);if(x&&p.spc<=0)spec(p);
 p.vy+=.6;p.y+=p.vy;if(p.y>GY){p.y=GY;p.vy=0}p.x=Math.max(35,Math.min(965,p.x+p.vx))}
// Bot AI: chases ball from the right side, guards near own goal when ball is behind, kicks/jumps/uses specials by difficulty
function aiu(t){const d=DIF[set.diff];if(M.tk%d.rt==0){t.tx=b.x<t.x?b.x+38:740;if(b.x>t.x&&b.x-t.x<90&&b.y<GY-30)t.tx=t.x}
 const near=Math.abs(b.x-t.x)<110,u=(near&&b.y<t.y-60&&rnd()<.15)||(b.x>t.x&&b.x-t.x<80&&rnd()<.05);
 ctl(t,t.tx<t.x-8,t.tx>t.x+8,u,0,0,0);if(b.x<t.x)t.f=-1;
 if(b.x<t.x+10&&Math.hypot(b.x-(t.x-30),b.y-(t.y-20))<62&&rnd()<d.k){t.f=-1;kick(t)}if(t.spc<=0&&rnd()<.004*d.sp)spec(t)}
function hit(p){[[0,-38,26],[0,-90,22]].forEach(([dx,dy,r])=>{const cx=p.x+dx,cy=p.y+dy,ex=b.x-cx,ey=b.y-cy,d=Math.hypot(ex,ey),m=r+b.r;
 if(d<m&&d>0){const nx=ex/d,ny=ey/d;b.x=cx+nx*m;b.y=cy+ny*m;const vn=(b.vx-p.vx)*nx+(b.vy-p.vy)*ny;if(vn<0){b.vx-=1.6*vn*nx;b.vy-=1.6*vn*ny;if(vn<-3)sfx('hit')}}})}
function score(i){M.sc[i]++;M.fz=100;M.txt='GOAL!';$('#s'+(i+1)).textContent=M.sc[i];sfx('goal');burst(W/2,H/2,60)}
function ball(){[M.p1,M.p2].forEach(p=>{if(p.mag>0){const fx=p.x+p.f*30,fy=p.y-20,d=Math.hypot(fx-b.x,fy-b.y);if(d<260&&d>1){b.vx+=(fx-b.x)/d*.5;b.vy+=(fy-b.y)/d*.3;b.vx*=.97}}}); // Krishna's Flute Flow
 b.vy+=.42;b.vx*=.998;const sp=Math.hypot(b.vx,b.vy);if(sp>20){b.vx*=20/sp;b.vy*=20/sp}b.x+=b.vx;b.y+=b.vy;b.rot+=b.vx*.03;
 if(b.y>GY-4){b.y=GY-4;b.vy=b.vy>1.5?-b.vy*.72:0;b.vx*=.985}
 const bar=GY-150;for(const s of[0,1]){const m=s?1000-b.x:b.x;
  if(m<72&&b.vy>0&&b.y+b.r>bar&&b.y<bar+8){b.y=bar-b.r;b.vy*=-.5}
  if(m<45&&b.y>bar+8){score(s?0:1);return}
  if(m<b.r){b.x=s?1000-b.r:b.r;b.vx*=-.6}}}
function step(){const m=M;if(m.fz>0){if(--m.fz==0){m.txt='';rst()}return}
 m.time-=1/60;m.tk++;ctl(m.p1,K.l,K.r,K.u,K.s,K.k,K.x);aiu(m.p2);ball();hit(m.p1);hit(m.p2);
 const t=Math.max(0,Math.ceil(m.time));$('#tm').textContent='00:'+String(t).padStart(2,'0');$('#spb i').style.width=(100-m.p1.spc/4.2)+'%';if(m.time<=0)end()}
function end(){const[a,c]=M.sc;$('#rs').innerHTML=HERO[hero].n+' <b style="color:#ffd769">'+a+'</b> &nbsp;—&nbsp; <b style="color:#ffd769">'+c+'</b> BOT';
 $('#rt').textContent=a>c?'DIVINE VICTORY':a<c?'TRY AGAIN':'BLESSINGS FOR BOTH';sfx('start');setTimeout(()=>sfx(a>=c?'win':'lose'),500);K={};go('MATCH_RESULT')}
/* ===== UI STATE ===== */
function go(s){st=s;$$('.scr').forEach(e=>e.classList.toggle('on',e.id==s));$('#hud').style.display=(s=='PLAYING'||s=='PAUSED'||(s=='SETTINGS'&&from=='PAUSED'))?'block':'none'}
function intro(){bot=[0,1,2,3].filter(i=>i!=hero)[rnd()*3|0];$('#n1').textContent=HERO[hero].n;$('#n2').textContent=HERO[bot].n;go('MATCH_INTRO');pc('v1',hero);pc('v2',bot,-1);sfx('open');setTimeout(()=>{if(st=='MATCH_INTRO')newMatch()},2200)}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.remove('sh');void e.offsetWidth;e.classList.add('sh')}
function build(){$('#car').innerHTML=HERO.map((h,i)=>`<div class="cd" data-a="foc" data-i="${i}"><canvas id="cc${i}" width="200" height="230"></canvas><b>${h.n}</b><i>${h.t}</i><button class="b s" data-a="pick" data-i="${i}">SELECT</button></div>`).join('');HERO.forEach((h,i)=>pc('cc'+i,i))}
function mark(){$$('.cd').forEach((e,i)=>{e.classList.toggle('foc',i==ci);e.classList.toggle('sel',i==hero)});const h=HERO[ci];$('#info').innerHTML=`<b>${h.n}</b> — Role: ${h.r}<br><em>${h.a}</em>: ${h.d}`;$$('.cd')[ci].scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'})}
function choose(i){hero=i;mark();toast(HERO[i].n+' SELECTED');sfx('open');setTimeout(()=>{if(st=='CHARACTER_SELECT')go('GAME_MENU')},1000)}
function sync(){['mus','thm','sfx'].forEach(k=>{$('#'+k).value=set[k]*100;$('#'+k+'v').textContent=Math.round(set[k]*100)+'%'});$$('.mt').forEach(e=>e.textContent=set.on?'🔊 MUSIC ON':'🔇 MUSIC OFF');$('#mi').textContent=set.on?'🔊':'🔇';
 $$('[data-d]').forEach(e=>e.classList.toggle('on',e.dataset.d==set.diff));$('#fsb').textContent=document.fullscreenElement?'ON':'OFF'}
const act={start(){burst(W/2,H*.35,100);go('GAME_MENU');sfx('open')},match:intro,chars(){go('CHARACTER_SELECT');ci=hero;mark()},sett(){from=st;go('SETTINGS');sync()},
 back(){go(st=='SETTINGS'?from:st=='GAME_MENU'?'MAIN_MENU':'GAME_MENU')},prev(){ci=(ci+3)%4;mark()},next(){ci=(ci+1)%4;mark()},foc(t){ci=+t.dataset.i;mark()},pick(t){choose(+t.dataset.i)},sel(){choose(ci)},
 resume(){go('PLAYING')},pause(){if(st=='PLAYING')go('PAUSED')},restart:newMatch,menu(){go('MAIN_MENU')},again:intro,mon(){set.on=!set.on;applyVol();sync()},
 fs(){try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(e){}},diff(t){set.diff=t.dataset.d;sync()},reset(){set={...DEF};applyVol();sync()}};
document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;ainit();sfx('click');t.blur();act[t.dataset.a](t)});
document.addEventListener('fullscreenchange',sync);
$$('input[type=range]').forEach(i=>{i.oninput=()=>{set[i.id]=i.value/100;applyVol();sync()};i.onchange=()=>{ainit();sfx('click')}});
/* ===== INPUT ===== */
const KM={KeyA:'l',ArrowLeft:'l',KeyD:'r',ArrowRight:'r',KeyW:'u',ArrowUp:'u',KeyS:'s',ArrowDown:'s',Space:'k',ShiftLeft:'x',ShiftRight:'x'};
addEventListener('keydown',e=>{ainit();if(e.code=='Escape'){if(st=='PLAYING')go('PAUSED');else if(st=='PAUSED')go('PLAYING');return}const k=KM[e.code];if(k){K[k]=1;e.preventDefault()}});
addEventListener('keyup',e=>{const k=KM[e.code];if(k){K[k]=0;e.preventDefault()}});addEventListener('blur',()=>K={});
$$('[data-k]').forEach(el=>{const k=el.dataset.k;el.onpointerdown=e=>{e.preventDefault();ainit();K[k]=1};['pointerup','pointerleave','pointercancel'].forEach(v=>el.addEventListener(v,()=>K[k]=0))});
addEventListener('pointerdown',ainit);
/* ===== RENDER LOOP ===== */
function rs(){const d=devicePixelRatio||1;W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;X.setTransform(d,0,0,d,0,0)}addEventListener('resize',rs);rs();
function burst(x,y,n){for(let i=0;i<n;i++)P.push({x,y,vx:(rnd()-.5)*10,vy:(rnd()-.8)*9,l:60+rnd()*40,g:.2})}
let last=0,acc=0;
function draw(){const inM=M&&(st=='PLAYING'||st=='PAUSED'||st=='MATCH_RESULT'||(st=='SETTINGS'&&from=='PAUSED'));X.fillStyle='#0b1230';X.fillRect(0,0,W,H);
 if(inM){const s=Math.min(W/1000,H/560);X.save();X.translate((W-1000*s)/2,(H-560*s)/2);X.scale(s,s);X.beginPath();X.rect(0,0,1000,560);X.clip();X.drawImage(bg(1000,560),0,0);lights(1000,560);goal(0,1);goal(940,-1);
  [M.p1,M.p2].forEach((p,i)=>{X.fillStyle='rgba(0,0,0,.3)';X.beginPath();X.ellipse(p.x,GY+4,32,8,0,0,7);X.fill();
   if(p.boost>0||p.mag>0||p.dash>0){X.strokeStyle='rgba(255,215,90,.85)';X.lineWidth=4;X.beginPath();X.ellipse(p.x,p.y-60,42,78,0,0,7);X.stroke()}
   dh(X,p.hi,p.x,p.y,.9,p.f,T+p.hi,Math.abs(p.vx)>.5&&p.y>=GY?1:0,p.y<GY-2);X.fillStyle=i?'#ff8a2a':'#ffd769';X.font='900 14px Nunito';X.textAlign='center';X.fillText(i?'▼ BOT':'▼ YOU',p.x,p.y-162)});
  X.fillStyle='rgba(0,0,0,.3)';X.beginPath();X.ellipse(b.x,GY+6,14,4,0,0,7);X.fill();X.save();X.translate(b.x,b.y);X.rotate(b.rot);X.fillStyle='#fff';X.strokeStyle='#222';X.lineWidth=1.5;X.beginPath();X.arc(0,0,b.r,0,7);X.fill();X.stroke();
  X.fillStyle='#222';X.beginPath();for(let i=0;i<5;i++)X.lineTo(Math.cos(i*1.2566)*6,Math.sin(i*1.2566)*6);X.fill();X.restore();
  if(M.txt){X.font='400 90px "Rozha One",serif';X.textAlign='center';X.lineWidth=8;X.strokeStyle='#7a1d0a';X.fillStyle='#ffd769';X.strokeText(M.txt,500,250);X.fillText(M.txt,500,250)}X.restore()}
 else{X.drawImage(bg(W,H),0,0);lights(W,H);const sc=H/321,y=H*.94;
  [[2,.3,.88,1],[1,.7,.88,-1],[3,.87,.88,-1],[0,.5,1,1]].forEach(([k,px,m,f],i)=>dh(X,k,W*px,y+Math.sin(T*2+i)*3,sc*m,f,T,0,0));
  if(rnd()<.4)P.push({x:rnd()*W,y:H,vx:(rnd()-.5)*.6,vy:-.6-rnd(),l:220,g:0})}
 P=P.filter(p=>p.l>0);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.l--;X.globalAlpha=Math.min(1,p.l/40);X.fillStyle='#ffd769';X.beginPath();X.arc(p.x,p.y,2.5,0,7);X.fill()});X.globalAlpha=1}
function loop(t){const dt=Math.min(.05,(t-last)/1000||0);last=t;T+=dt;if(st=='PLAYING'&&M){acc+=dt;while(acc>1/60){step();acc-=1/60}}draw();requestAnimationFrame(loop)}
build();mark();sync();go('MAIN_MENU');requestAnimationFrame(loop);
