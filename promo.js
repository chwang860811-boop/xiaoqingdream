(() => {
  const validId = id => /^[A-Za-z0-9_-]{11}$/.test(id || '');
  const yt = id => 'https://www.youtube.com/watch?v=' + id;
  const thumb = id => 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
  const el = (tag, cls, value) => { const node = document.createElement(tag); if (cls) node.className = cls; if (value) node.textContent = value; return node; };
  const link = (text, href, cls, external = false) => { const a = el('a', cls, text); a.href = href; if (external) { a.target = '_blank'; a.rel = 'noopener'; } return a; };
  function player(button) {
    const id = button.dataset.videoId;
    if (!validId(id)) return;
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    iframe.title = button.getAttribute('aria-label') || '官方 YouTube 影片';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin'; iframe.allowFullscreen = true;
    button.parentNode.replaceChild(iframe, button);
  }
  document.querySelectorAll('[data-video-id]').forEach(button => button.addEventListener('click', () => player(button)));
  const share = document.querySelector('[data-share]');
  if (share) share.addEventListener('click', async () => {
    const url = location.origin + location.pathname;
    const feedback = document.querySelector('.share-feedback');
    try {
      if (navigator.share) await navigator.share({title: document.title, url});
      else { await navigator.clipboard.writeText(url); feedback.textContent = '連結已複製，可以貼到社群分享。'; }
    } catch (error) { if (error.name !== 'AbortError') feedback.textContent = '請複製瀏覽器網址分享這個作品頁。'; }
  });
  const sections = document.querySelectorAll('[data-releases]');
  if (!sections.length) return;
  fetch('data/youtube.json', {cache: 'no-cache'}).then(r => { if (!r.ok) throw new Error('feed unavailable'); return r.json(); }).then(data => {
    const videos = (data.videos || []).filter(v => validId(v.id) && typeof v.title === 'string');
    if (!videos.length) return;
    const latest = videos[0];
    sections.forEach(section => {
      if (latest.id !== section.dataset.featuredId) {
        const image = section.querySelector('.release-art img'); image.src = thumb(latest.id); image.alt = latest.title;
        section.querySelector('.release-art').href = yt(latest.id);
        section.querySelector('.release-art').target = '_blank'; section.querySelector('.release-art').rel = 'noopener';
        section.querySelector('.release-copy h2').textContent = latest.title;
        section.querySelector('.release-artist').textContent = data.channelName || 'VYREN MUSIC';
        section.querySelector('.release-kind').textContent = 'YOUTUBE · 最新上傳';
        section.querySelector('.release-description').textContent = 'VYREN MUSIC 最新影像作品。前往官方 YouTube 觀看完整影片，訂閱頻道，接收下一次音樂更新。';
        section.querySelector('.release-watch').href = yt(latest.id);
        const secondary = section.querySelector('.release-secondary'); secondary.textContent = '探索更多官方影片 →'; secondary.href = data.channelUrl;
      }
      const grid = section.querySelector('.video-grid'); if (!grid) return;
      grid.replaceChildren();
      videos.slice(0, 9).forEach(video => {
        const a = link('', video.id === '3es9wob1jHA' ? 'light-me-alive.html' : yt(video.id), 'video-tile', video.id !== '3es9wob1jHA');
        const img = document.createElement('img'); img.src = thumb(video.id); img.alt = video.title; img.loading = 'lazy'; img.width = 480; img.height = 270;
        a.append(img, el('h4', '', video.title));
        const date = new Date(video.published || '');
        a.append(el('p', '', (Number.isNaN(date.getTime()) ? 'VYREN MUSIC' : date.toLocaleDateString('zh-TW',{timeZone:'Asia/Taipei'})) + ' · YouTube'));
        grid.append(a);
      });
    });
  }).catch(() => { /* Keep the complete static promotion if the feed cannot load. */ });
})();
