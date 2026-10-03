const DREAM_SCENES={
 night:{label:'星夜',title:'月光湖',text:'今晚的星星離你很近。',bg:'night'},
 dawn:{label:'晨光',title:'日出島',text:'第一束光正在海面上慢慢醒來。',bg:'dawn'},
 ocean:{label:'海岸',title:'藍色海岸',text:'把今天不想說的話，交給海浪。',bg:'ocean'}
};
(function(){
 const planet=document.querySelector('#dreamPlanet'), orbit=document.querySelector('#dreamOrbit'), label=document.querySelector('#dreamSceneLabel'), title=document.querySelector('#dreamSceneTitle'), text=document.querySelector('#dreamSceneText'), energy=document.querySelector('#dreamEnergy'), fill=document.querySelector('#dreamMeterFill');
 if(!planet)return;
 let rot=0,drag=false,lastX=0,score=0, stars=[];
 const setScene=(id)=>{const s=DREAM_SCENES[id]; document.querySelectorAll('.dream-tab').forEach(b=>b.classList.toggle('active',b.dataset.scene===id)); label.textContent=s.label;title.textContent=s.title;text.textContent=s.text;planet.dataset.scene=s.bg;};
 document.querySelectorAll('.dream-tab').forEach(b=>b.onclick=()=>setScene(b.dataset.scene));
 const renderScore=()=>{energy.textContent=`${score} / 3`;fill.style.width=`${Math.min(score,3)/3*100}%`;};
 function spawnStar(){if(stars.length>=3)return;const s=document.createElement('button');s.className='collect-star';s.textContent='✦';s.style.left=(12+Math.random()*76)+'%';s.style.top=(14+Math.random()*65)+'%';s.title='點我收集星星';s.onclick=()=>{score++;renderScore();s.remove();stars=stars.filter(x=>x!==s);if(score>=3){text.textContent='你找到了三顆星。小晴想告訴你：今天也值得被溫柔對待。';toast('願望解鎖了 ✦');}else{toast(`找到第 ${score} 顆星 ✦`);spawnStar();}};orbit.appendChild(s);stars.push(s);}
 document.querySelector('#discoverBtn')?.addEventListener('click',()=>{if(score<3)spawnStar();else toast('三顆星都找到了 ✦')});
 document.querySelector('#wishBtn')?.addEventListener('click',()=>{const wishes=['希望今天的你被好好接住。','願你正在期待的事情慢慢發生。','把一點點勇氣留給明天。','願你今晚有一個好夢。'];text.textContent=wishes[Math.floor(Math.random()*wishes.length)];toast('願望已經送往星空 ✦')});
 document.querySelector('#dreamReset')?.addEventListener('click',()=>{score=0;stars.forEach(s=>s.remove());stars=[];renderScore();setScene('night');toast('夢境重新整理好了')});
 orbit.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;drag=true;lastX=e.clientX;orbit.setPointerCapture(e.pointerId)});
 orbit.addEventListener('pointermove',e=>{if(!drag)return;rot+=(e.clientX-lastX)*.4;lastX=e.clientX;planet.style.transform=`rotateY(${rot}deg) rotateX(${Math.max(-12,Math.min(12,(e.clientY-orbit.getBoundingClientRect().top-orbit.clientHeight/2)*-.025))}deg)`});
 orbit.addEventListener('pointerup',()=>drag=false);orbit.addEventListener('pointercancel',()=>drag=false);
 orbit.addEventListener('wheel',e=>{e.preventDefault();rot+=e.deltaY*.08;planet.style.transform=`rotateY(${rot}deg)`},{passive:false});
 setScene('night');renderScore();
})();
