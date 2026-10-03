(function(){
  const tracks=[
    {id:'dream',name:'夢境晨光',file:'assets/music/dream-morning.mp3'},
    {id:'night',name:'星夜陪伴',file:'assets/music/starry-night.mp3'},
    {id:'room',name:'房間午後',file:'assets/music/room-afternoon.mp3'}
  ];
  const key='xiaoqing-music';
  function mount(){
    if(document.querySelector('.music-player')) return;
    const wrap=document.createElement('div'); wrap.className='music-player';
    wrap.innerHTML=`<audio id="bgMusic" preload="metadata"></audio><button class="music-toggle" aria-label="音樂播放">♫</button><div class="music-panel"><div class="music-title"><span>小晴的背景音樂</span><small id="musicState">選一首陪伴你的音樂</small></div><select id="musicSelect">${tracks.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select><div class="music-row"><button id="musicPlay">▶ 播放</button><button id="musicMute">🔊</button><input id="musicVol" type="range" min="0" max="1" step="0.01" value="0.42" aria-label="音量"></div></div>`;
    document.body.appendChild(wrap);
    const audio=wrap.querySelector('#bgMusic'), select=wrap.querySelector('#musicSelect'), play=wrap.querySelector('#musicPlay'), mute=wrap.querySelector('#musicMute'), vol=wrap.querySelector('#musicVol'), state=wrap.querySelector('#musicState');
    let saved={}; try{saved=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
    if(saved.track && tracks.some(t=>t.id===saved.track)) select.value=saved.track;
    audio.volume=typeof saved.volume==='number'?saved.volume:.42;
    vol.value=audio.volume;
    function load(){const t=tracks.find(x=>x.id===select.value); audio.src=t.file; state.textContent=t.name+' · 點播放開始'; try{localStorage.setItem(key,JSON.stringify({track:t.id,volume:audio.volume}))}catch(e){}}
    function update(){play.textContent=audio.paused?'▶ 播放':'Ⅱ 暫停'; state.textContent=audio.paused?`${tracks.find(t=>t.id===select.value)?.name||'音樂'} · 已暫停`:'正在播放 · '+(tracks.find(t=>t.id===select.value)?.name||'音樂')}
    load();
    select.onchange=()=>{load();audio.play().then(update).catch(()=>{state.textContent='請先把音樂檔放進 assets/music/';update()})};
    play.onclick=()=>{if(audio.paused) audio.play().then(update).catch(()=>{state.textContent='請先加入 MP3 音樂檔';}); else {audio.pause();update()}};
    mute.onclick=()=>{audio.muted=!audio.muted;mute.textContent=audio.muted?'🔇':'🔊'};
    vol.oninput=()=>{audio.volume=+vol.value;try{localStorage.setItem(key,JSON.stringify({track:select.value,volume:audio.volume}))}catch(e){}};
    audio.onended=()=>{audio.currentTime=0;audio.play().catch(()=>{});};
    wrap.querySelector('.music-toggle').onclick=()=>wrap.classList.toggle('open');
  }
  document.addEventListener('DOMContentLoaded',mount);
})();
