"""Sync only verified public uploads from the configured YouTube channel.

Run from the repository root: python scripts/sync_youtube.py
An empty/unavailable feed never clears existing releases.
"""
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime, timezone

CHANNEL_ID = 'UCPHytK_39IBmBsfpl4FFtGw'
ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / 'data/youtube.json'
NS = {'a': 'http://www.w3.org/2005/Atom', 'yt': 'http://www.youtube.com/xml/schemas/2015'}

def sync():
    old = json.loads(DATA_PATH.read_text())
    request = urllib.request.Request(
        f'https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}',
        headers={'User-Agent': 'VYRON-Website-Sync/1.0'})
    with urllib.request.urlopen(request, timeout=35) as response:
        root = ET.fromstring(response.read())
    feed_id = root.findtext('yt:channelId', namespaces=NS)
    channel_uri = root.findtext('a:author/a:uri', namespaces=NS)
    if feed_id not in (CHANNEL_ID, CHANNEL_ID[2:]) or channel_uri != f'https://www.youtube.com/channel/{CHANNEL_ID}':
        raise RuntimeError('Feed channel identity mismatch; existing content preserved.')
    entries = []
    for entry in root.findall('a:entry', NS):
        vid = entry.findtext('yt:videoId', namespaces=NS)
        title = entry.findtext('a:title', namespaces=NS)
        published = entry.findtext('a:published', namespaces=NS)
        if not re.fullmatch(r'[A-Za-z0-9_-]{11}', vid or '') or not title or not published:
            raise RuntimeError('Incomplete feed entry; existing content preserved.')
        datetime.fromisoformat(published.replace('Z', '+00:00'))
        entries.append({'id':vid,'title':title,'published':published})
    if not entries:
        print('YouTube feed has no public entries yet; existing promotion preserved.')
        return
    merged = {v['id']: v for v in old['videos']}
    for video in entries:
        merged[video['id']] = video
    videos = sorted(merged.values(), key=lambda v:v.get('published') or '', reverse=True)
    if videos == old['videos']:
        print('No new uploads or metadata changes.')
        return
    old['videos'] = videos
    old['lastSyncedAt'] = datetime.now(timezone.utc).isoformat()
    DATA_PATH.write_text(json.dumps(old, ensure_ascii=False, indent=2)+'\n')
    print(f'Synced {len(entries)} feed entries; archived {len(videos)} videos.')

if __name__ == '__main__':
    sync()
