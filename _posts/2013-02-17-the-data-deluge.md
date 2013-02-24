---
layout: study
study_name: "How to Win the Olympics"
title: "The Data Deluge"
tagline: "Intro"
toc: "Data Deluge"
toc_order: 1
subnav_title: "Intro"
subnav_order: 0
description: "Practically endless amounts of XML pushed to us over the Internet from LOCOG."
category: deluge
tags: [studies, deluge, navbar]
---
{% include JB/setup %}

* [Next: Gigabytes of XML]({% post_url 2013-02-17-the-data-deluge-accepting-gigabytes-of-xml %})

This is the first in a series of case studies giving you insight into the challenges faced and lessons learned during over a year of wrangling data and syndicating results to clients around the world. Here I’ll focus on the sheer volume of data we were trying to make accurate and consumable in a news context. 

The London Olympic Games took place over 17 days and involved over 32,000 athletes from 204 countries around the world. These athletes competed in 304 medal-awarding events spread across 36 different sports. In all, there were over 7,200 competitive units in the London games. 

We received the data for all this through the IOC's Olympic Data Feed (ODF). ODF includes everything from athlete biographies to competition results to records broken and medals awarded. This data is sent over the internet in XML. 

The various documentation resources for the feed suggested that we should expect to receive about 1GB of xml per day during the games. In the end, our servers received over 40GB of xml messages during the entire competition. In other words, more than double the amount we were expecting. Our job was to parse as much of it as necessary, as quickly as possible, and then store and present key data points in ways that hopefully would make sense to human beings.

{% include studies/deluge_graph.html %}

