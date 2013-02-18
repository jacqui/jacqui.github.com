---
layout: study
study_name: "How to Win the Olympics"
title: "1. The Data Deluge"
tagline: "Recovery"
category: 
tags: [deluge]
---
{% include JB/setup %}

* [Previous: Parsing]({% post_url 2013-02-17-the-data-deluge-parsing %})
* [Next: Toolbox]({% post_url 2013-02-17-the-data-deluge-toolbox %})

### Problem: Not Letting One Bad Apple Ruin the Whole Olympics

Automated exception alerting and monitoring tools helped us stay aware of the health of the application, down to each queue and even message parsing status. 

There was a basic UI displaying key stats for each message with some search functionality:

![image](http://f.cl.ly/items/3D3B1I2H0f1J0a1i1t3U/Screen%20Shot%202013-02-11%20at%2010.40.04%20AM.png)

In addition to watching various admin screens, though, we were notified via email, and in some cases, text messages if the queues became too slow or broke down. 

If we found ourselves in that predicament, though, we wanted to be sure that getting the systems back up and running was relatively straightforward. Since we followed the same naming convention as the IOC did on their backup site, all we had to do was download a missing file to our server alongside the rest of the messages. The parsers would pick them up in the same way as the messages posted to the Listener. We also had the ability to requeue messages that failed due to faulty logic in our parsers.

