---
layout: study
study_name: "How to Win the Olympics"
title: "1. The Data Deluge"
tagline: "Intro"
toc: "The Data Deluge"
toc_order: 1
description: "Practically endless amounts of XML pushed to us over the Internet from LOCOG."
category: 
tags: [studies]
---
{% include JB/setup %}

The London Olympic Games took place over 17 days and involved over 32,000 athletes from 204 countries around the world. These athletes competed in 304 medal-awarding events spread across 36 different sports. In all, there were over 7,200 competitive units in the London games. 

We received the data for all this through the IOC's Olympic Data Feed (ODF). ODF includes everything from athlete biographies to competition results to records broken and medals awarded. This data is sent over the internet in XML. 

Before the games began, the IOC promised us a gigabyte of xml/day. We ended up receiving over 40 gigs in the end, which is way more than the already large amount we were told to expect!  And we had to parse it, figure out the important pieces, store them, and present them in ways that hopefully would make sense to human beings.

{% include studies/deluge_graph.html %}

* [Next: Gigabytes of XML]({% post_url 2013-02-17-the-data-deluge-accepting-gigabytes-of-xml %})
