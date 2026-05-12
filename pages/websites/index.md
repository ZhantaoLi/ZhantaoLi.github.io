---
title: Websites
aside: false
nav: false
# Use relative path so it works in SSG (Node) and on GitHub Pages base path
websites: /websites/links.json
icon: i-ri-window-line
---
<YunWebsite :Websites="frontmatter.websites" />

<!--
/public/websites/links.json
  {
    "name": "",
    "url": "",
    "avatar": "",
    "type": "",
    "reason": ""
  }
-->
