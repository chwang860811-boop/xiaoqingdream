const ACTIONS=[
 {id:'clap',icon:'👏',name:'擊掌',hint:'小晴和你擊掌！',file:'assets/actions/clap.mp4'},
 {id:'cute',icon:'🥺',name:'裝可愛',hint:'突然開始可愛模式 ✦',file:'assets/actions/cute.mp4'},
 {id:'cling',icon:'🫶',name:'撒嬌',hint:'靠近一點嘛…',file:'assets/actions/cling.mp4'},
 {id:'funny',icon:'😝',name:'鬼臉',hint:'不准笑我！',file:'assets/actions/funny.mp4'},
 {id:'tongue',icon:'😛',name:'吐舌頭',hint:'略略略～',file:'assets/actions/tongue.mp4'},
 {id:'wink',icon:'😉',name:'眨眼',hint:'收到你的訊號了 ✦',file:'assets/actions/wink.mp4'},
 {id:'heart',icon:'🫶',name:'比愛心',hint:'送你一顆小愛心',file:'assets/actions/heart.mp4'},
 {id:'wave',icon:'👋',name:'揮手',hint:'嗨～歡迎回來',file:'assets/actions/wave.mp4'},
 {id:'sleep',icon:'🌙',name:'晚安',hint:'今晚也要好好睡覺',file:'assets/actions/sleep.mp4'}
];
const actionGrid=document.querySelector('#actionGrid');
const video=document.querySelector('#actionVideo');
const poster=document.querySelector('#actionPoster');
const label=document.querySelector('#actionLabel');
const hint=document.querySelector('#actionHint');
const status=document.querySelector('#actionStatus');
function renderActions(){
 actionGrid.innerHTML=ACTIONS.map((a,i)=>`<button class="action-btn" data-action="${a.id}"><span class="action-icon">${a.icon}</span><span><b>${a.name}</b><small>${a.hint}</small></span><i>↗</i></button>`).join('');
}
function playAction(a){
 document.querySelectorAll('.action-btn').forEach(b=>b.classList.toggle('selected',b.dataset.action===a.id));
 label.textContent=a.name; hint.textContent=a.hint; status.textContent=`小晴正在：${a.name}`;
 poster.classList.add('hidden'); video.classList.add('ready'); video.src=a.file; video.load();
 const promise=video.play();
 if(promise && promise.catch) promise.catch(()=>{poster.classList.remove('hidden');video.classList.remove('ready');status.textContent=`已選擇「${a.name}」｜把 ${a.file.split('/').pop()} 放進 actions 資料夾即可播放`});
}
actionGrid?.addEventListener('click',e=>{const btn=e.target.closest('.action-btn');if(!btn)return;const a=ACTIONS.find(x=>x.id===btn.dataset.action);if(a)playAction(a)});
video?.addEventListener('ended',()=>{status.textContent='完成！再選一個動作吧 ✦';poster.classList.remove('hidden');video.classList.remove('ready')});
renderActions();
