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

### Errata

In addition to making sense of the data, we faced other challenges, including:

- how to trace each fact and figure back to the original message provided by the IOC?
- how to store this data, deciding to model it in a more streamlined, human-readable way or keeping it close to the original
- providing context: instead of showing esoteric codes and id numbers, follow typical relational db associations and/or use other rules determined by understanding the flow and types of messages

Do we care about every single kilobyte of that XML? Which can we skip?


### The Problem: Recovering from Errors

Since we followed the same naming convention as the IOC did on their backup site, all we had to do was download the problematic or missing files to our server alongside the rest of the messages. The parsers would pick them up in the same way as the messages posted to the Listener.


### The Spectrum of Data Types

**Athletes**: DT_PARTIC, DT_PARTIC_UPDATE, DT_PARTIC_TEAMS, DT_PARTIC_TEAMS_UPDATE, DT_PARTIC_HORSES, DT_PARTIC_HORSES_UPDATE, DT_BIO_PAR, DT_BIO_PAR_UPDATE, DT_PIC, DT_PIC_UPDATE

**Schedule**: DT_SCHEDULE, DT_SCHEDULE_UPDATE

**Standings**: DT_MEDALS, DT_MEDALLISTS_DAY, DT_HISTORIC_RECORD, DT_HIST_REC_UPDATE, DT_NOTIFICATION 

**Results**: DT_START_LIST, DT_RESULT, DT_PHASE_RESULT, DT_CUMULATIVE_RESULT, DT_POOL_STANDING, DT_RANKING, DT_STATS, DT_MEDALLISTS, DT_MEDALLISTS_DISCIPLINE, DT_RECORD, DT_PHOTOFINISH, DT_COMMUNICATION, DT_BRACKETS, DT_PRESSPHOTOFINISH_LK

**More!**: DT_GLOBAL_GM, DT_GLOBAL_GN, DT_GM, DT_GN, DT_SERIAL, DT_RT_KA, DT_WEATHER, DT_TRS


### Tools

**Listener**

* [Rack](https://github.com/rack/rack) - the simplest way to serve a dynamic ruby application, without all the overhead of a rails or even sinatra framework
* [Nginx](http://wiki.nginx.org/Main) - a blazingly fast web server, "known for its high performance, stability, rich feature set, simple configuration, and low resource consumption"
* [Regular expressions](http://rubular.com/) - when dealing with text in a predictable format, regular expressions are a fast alternative to full-scale XML parsing. [Related take on this issue, only for HTML](http://www.codinghorror.com/blog/2009/11/parsing-html-the-cthulhu-way.html)
* [Amazon Web Services (AWS) EC2](http://aws.amazon.com/ec2/) - server used to host the application in the cloud.
* [AWS Elastic Block Store (EBS)](http://aws.amazon.com/ebs/) - storage volume mounted on the EC2 server where all the xml files were saved

**Parsers**

* [Resque](https://github.com/defunkt/resque#readme)
* [Redis](http://redis.io/topics/introduction)
* [MySQL](http://dev.mysql.com/doc/refman/5.6/en/what-is-mysql.html)
* [Nokogiri](http://nokogiri.org/)

**Admin**

Basic UI showing stats for each message, allowing us to monitor the parsers and find specific messages:

![image](http://f.cl.ly/items/3D3B1I2H0f1J0a1i1t3U/Screen%20Shot%202013-02-11%20at%2010.40.04%20AM.png)


