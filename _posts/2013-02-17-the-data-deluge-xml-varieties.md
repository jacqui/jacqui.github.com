---
layout: study
study_name: "How to Win the Olympics"
title: "The Data Deluge"
tagline: "XML Variety Show"
subnav_order: 3
category: deluge
tags: [deluge]
---
{% include JB/setup %}

* [Previous: Names Are Important]({% post_url 2013-02-17-the-data-deluge-meaningful-filenames %})
* [Next: Parsing]({% post_url 2013-02-17-the-data-deluge-parsing %})

### The XML Variety Show

I've name-dropped XML and ODF a few times already, and I have also mentioned that the volume and complexity of the data was a challenge. Making sense of any of the ODF messages required having some level of knowledge not only about the Olympics in general, but about esoteric rules outlined in a variety of places including sporting rules documents, data dictionaries and from sometimes desperate Q&A's with the ODF Support team. 

So what kind of messages did we have to contend with? I thought I could give you some idea of it - without making your eyes cross too much - by listing out the different types of messages overall, along with some examples.

#### Message Types

**Athletes**: DT\_PARTIC, DT\_PARTIC\_UPDATE, DT\_PARTIC\_TEAMS, DT\_PARTIC\_TEAMS\_UPDATE, DT\_PARTIC\_HORSES, DT\_PARTIC\_HORSES\_UPDATE, DT\_BIO\_PAR, DT\_BIO\_PAR\_UPDATE, DT\_PIC, DT\_PIC\_UPDATE

All of the "PARTIC" messages contained lists of athletes, teams or (personal favorite) horses competing in the games. The BIO messages included biographical information, and the PIC messages were encoded versions of athletes' ID photos.

**Schedule**: DT\_SCHEDULE, DT\_SCHEDULE\_UPDATE

These messages contained the entire schedule for the games, broken down by sport.


**Results**: DT\_MEDALS, DT\_MEDALLISTS\_DAY, DT\_HISTORIC\_RECORD, DT\_HIST\_REC\_UPDATE, DT\_MEDALLISTS, DT\_MEDALLISTS\_DISCIPLINE

The "MEDAL" and "MEDALLISTS" messages were either round ups of medal winners by day and sport or periodic medal standings sent as they were awarded.
HISTORIC/HIST record messages included all of the current record holders (World, Olympic and more esoteric types of records set during an Olympics) prior to the games.

**More Results**: DT\_START\_LIST, DT\_RESULT, DT\_PHASE\_RESULT, DT\_CUMULATIVE\_RESULT, DT\_RT\_RESULT, DT\_RT\_PHASE\_RESULT, DT\_RT\_CUMULATIVE\_RESULT, DT\_RECORD, DT\_STATS,

Start lists included the lineup of athletes at the beginnning of a competition. Records broken or invalidated during the games trigger a DT_RECORD message. Then there were the differnet types of results, grouped by segment of competition and/or aggregated. The granularity of results goes from the unit level (a single heat) up to the phase (multiple heats in a race).

The "RT_" result messages are real-time versions of the "point-in-time" messages.

**Overall Standings**: DT\_POOL\_STANDING, DT\_RANKING, DT\_BRACKETS 

Pool standings and rankings showed how teams and athletes were doing compared to each other. Pools are used in team sports like basketball and rankings are generally for individual competitions. The bracket messages configured the setup of team play in head-to-head competition.

**Photos**: DT\_PHOTOFINISH, DT\_PRESSPHOTOFINISH\_LK

**More!**: DT\_GLOBAL\_GM, DT\_GLOBAL\_GN, DT\_GM, DT\_GN, DT\_SERIAL, DT\_RT\_KA, DT\_WEATHER, DT\_TRS, DT\_COMMUNICATION, DT\_NOTIFICATION 

I won't go into all of these, but I'll mention that the "GM" and "GN" in these types stands for "Good Morning" and "Good Night". Yep.
