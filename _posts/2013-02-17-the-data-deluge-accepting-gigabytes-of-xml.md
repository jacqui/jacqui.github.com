---
layout: study
study_name: "How to Win the Olympics"
title: "1. The Data Deluge"
tagline: "Gigabytes of XML"
category: 
tags: [deluge]
---
{% include JB/setup %}

### Problem: Keeping Up With The ODFs

Even a quick glance at the schedule of events in teh Summer Games told us that we'd have to handle a lot of inbound traffic from the ODF. 

Missing a message could lead to gaps in results data on the live site, or even worse, incorrect results. If we missed an 'official', final results message, we might end up showing the wrong country winning the gold! 

Slowness could also cause trouble - we wanted our results data to be accurate and timely. 

So, to avoid drowning in the downpour of DT_RESULTs, we wrote an application called the "Listener" with the following goals in mind:

* speed!
* single-purpose!
* simple!
* reliable!
* fault-tolerant!

The Listener app was the initial point of entry for every single piece of Olympics data. It had to work fast in order to keep up with the  of XML. It couldn't fall over and die during the games as we'd end up missing important information.

We ran the app on a dedicated ec2 server that waited for posts during the games. As soon as it received data, it did very minimal parsing and then saved it to the filesystem.

Given that some of the messages reached 20MB or more in size, we realized that fully parsing each one as it arrived would slow down the entire process. The most important thing was to get the data in the first place. We could worry about parsing it once it was saved on our servers.

### Implementation

We skipped all the overheard of a Rails - or even Sinatra - framework and decided to write the Listener in [Rack](https://github.com/rack/rack), perhaps the simplest way to serve a dynamic ruby application. Traffic was routed to the app by [Nginx](http://wiki.nginx.org/Main), a blazingly fast web server, "known for its high performance, stability, rich feature set, simple configuration, and low resource consumption."

Limited use of [regular expressions](http://rubular.com/) was our fast alternative to full-scale XML parsing. There are risks inherent in this approach, generally speaking, but we found it worked great with predictably consistent, well-structured text in ODF XML. [Related take on this issue, only for HTML](http://www.codinghorror.com/blog/2009/11/parsing-html-the-cthulhu-way.html).

For hosting, we used [Amazon Web Services (AWS) EC2](http://aws.amazon.com/ec2/) instances (servers in the cloud) along with an [AWS Elastic Block Store (EBS)](http://aws.amazon.com/ebs/) volume mounted on the EC2 server the Listener ran on.

* [Previous: The Data Deluge]({% post_url 2013-02-17-the-data-deluge %})
* [Next: Names are Important]({% post_url 2013-02-17-the-data-deluge-meaningful-filenames %})
