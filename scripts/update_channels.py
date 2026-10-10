#!/usr/bin/env python3
"""Refresh public YouTube recommendations without a paid API key."""
import json, re, urllib.request, xml.etree.ElementTree as ET
from pathlib import Path
P=Path("data/channels.json")
data=json.loads(P.read_text(encoding="utf-8"))
UA={"User-Agent":"Mozilla/5.0 (compatible; VYRON-Website/1.0)"}
def get(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=18) as r:return r.read().decode("utf-8","replace")
for key,channel in data["channels"].items():
    url=channel.get("channelUrl","")
    if not url:continue
    try:
        page=get(url)
        m=re.search(r'"channelId"\s*:\s*"(UC[\w-]{22})"',page) or re.search(r'<meta itemprop="channelId" content="(UC[\w-]{22})"',page)
        if not m:
            print(key,"channel id not found; keep existing data");continue
        xml=get("https://www.youtube.com/feeds/videos.xml?channel_id="+m.group(1))
        root=ET.fromstring(xml)
        ns={"a":"http://www.w3.org/2005/Atom","yt":"http://www.youtube.com/xml/schemas/2015"}
        videos=[]
        for entry in root.findall("a:entry",ns):
            idnode=entry.find("yt:videoId",ns)
            titlenode=entry.find("a:title",ns)
            if idnode is None or titlenode is None:continue
            videos.append({"id":idnode.text,"title":titlenode.text})
        channel["latest"]=videos[:9]
        print(key,len(videos),"videos")
    except Exception as e:print(key,"refresh failed, preserving previous:",e)
P.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
