---
layout: study
title: "The Data Deluge"
toc: "The Data Deluge"
toc_order: 1
description: "Practically endless amounts of XML pushed to us over the Internet from LOCOG."
category: 
tags: [studies]
---
{% include JB/setup %}

The London Olympic Games took place over 17 days and involved over 32,000 athletes from 204 countries around the world. These athletes competed in 304 medal-awarding events spread across 36 different sports. In all, there were over 7,200 competitive units in the London games. 

We received the data for all this through the IOC's Olympic Data Feed (ODF). ODF includes everything from athlete biographies to competition results to records broken and medals awarded. This data is sent over the internet in XML. 

Before the games began, the IOC promised us a gigabyte of xml/day. We ended up receiving over 40 gigs in the end, which is way more than the already large amount we were told to expect!

![image](http://f.cl.ly/items/3A420b292d1D3p0H2z2f/Screen%20Shot%202013-01-27%20at%207.39.58%20PM.png)

And we had to parse it, figure out the important pieces, store them, and present them in ways that hopefully would make sense to human beings.

### The Problem: Accepting Gigabytes of XML ASAP

In order to receive the XML messages that the IOC sent during the games, we wrote an application called the Listener with the following goals in mind:

* the app has to do its job - quickly
* the codebase should be simple
* … and single-purpose
* the app has to be reliable
* … and fault-tolerant

The Listener app was the initial point of entry for every single piece of Olympics data. It had to work fast in order to keep up with the deluge of XML. It couldn't fall over and die during the games as we'd end up missing important information.

We ran the app on a dedicated ec2 server that waited for posts during the games. As soon as it received data, it did very minimal parsing and then saved it to the filesystem.

Given that some of the messages reached 20MB or more in size, we realized that fully parsing each one as it arrived would slow down the entire process. The most important thing was to get the data in the first place. We could worry about parsing it once it was saved on our servers.


### The Problem: Naming Files in a Meaningful Way

How do you determine which xml messages have the data you need without actually parsing all of them? We decided to follow the naming convention that the IOC used on its backup data site. It is not a scheme any of us on the team would have chosen, but it did include all the data points required to make that determination.

The first line of every ODF message contained a node called "OdfBody" with attributes describing the kind of data included in the xml.

Here's how we used the OdfBody node to streamline the Listener and prep the right files for parsing:
 upon receiving an xml messsage, the app read in the first line (the OdfBody) and pulled out key data using a simple regular expression. Limiting ourselves to a single line of xml and using a regular expression instead of the most costly approach of an XML parser (which reads the entire file into memory and creates objects in ruby for each node) for this step meant the process was fast.  

An example OdfBody: 

```xml
<OdfBody DocumentCode="ATM001000" DocumentType="DT_RT_CUMULATIVE_RESULT" Venue="STA" Date="20110929" Time="125431235" LogicalDate="20110929" FeedFlag="P" ResultStatus="LIVE_MANDATORY" DocumentSubtype="ATM001908" Version="1" RTSerial="151" Serial="95">
```

And the resulting filename:

```
20110929125431235000-ATM001000__________DT_RT_CUMULATIVE_RESULT_______ATM001908___________00001P___.xml
```

That filename, deciphered:

LogicalDate + Time + DocumentCode + Document Subcode + DocumentType + DocumentSubtype + Version + FeedFlag + ".xml"

Underscores are used for padding when one of those attributes is missing and/or blank.

### The Problem: Parsing Key Data Accurately and Quickly

So we had a lot of xml. Results came in many shapes and forms even for a single race. For example, the 100m Dash included the following types of result messages:

DT_RESULT, DT_PHASE_RESULT, DT_CUMULATIVE_RESULT, DT_RT_CUMULATIVE_RESULT

Which one provides the most up-to-date, accurate data? 

Messages usually did not include the full story, either. Some were more straight forward than others:

```xml
    <CumulativeResult SortOrder="1" Rank="1" RankEqual="N" ResultType="TIME" Result="9.54" QualificationMark="Q">
			<RecordIndicators>
				<RecordIndicator Order="1" Code="WR" />
			</RecordIndicators>
			<ResultItems>
				<ResultItem Phase="9" Unit="08">
					<Result Rank="1" RankEqual="N" ResultType="TIME" Result="9.54" QualificationMark="Q" SortOrder="1">
						<RecordIndicators>
							<RecordIndicator Order="1" Code="WR" />
						</RecordIndicators>
					</Result>
				</ResultItem>
			</ResultItems>
			<Competitor Type="A" Code="7011630">
				<Composition>
					<Athlete Code="7011630" Order="1" />
				</Composition>
			</Competitor>
		</CumulativeResult>
```

That shows Usain Bolt winning a preliminary race in the 100m dash, qualifying for the next round and breaking a world record to boot. 

```xml
      <Period Code="Q2_H" HomeScore="20" AwayScore="35"/>
```

The above snippet shows the score in a men's basketball game. However: which period is "Q2_H" (halfway through the second quarter)? Who is the "Home" team vs the "Away" team? 

And how would we know if that score was accurate? 

In addition to making sense of the data, we faced other challenges, including:

- how to trace each fact and figure back to the original message provided by the IOC?
- how to store this data, deciding to model it in a more streamlined, human-readable way or keeping it close to the original
- providing context: instead of showing esoteric codes and id numbers, follow typical relational db associations and/or use other rules determined by understanding the flow and types of messages

Do we care about every single kilobyte of that XML? Which can we skip?

Once the data was stored locally on our servers in xml files using the above file naming convention, we were able to determine pretty quickly which ones were relevant and should be parsed (most of them, most of the time). We took those filenames and added them to a queue of jobs focused solely on parsing the xml and storing the key data in our data stores.

Some validation was done at this step (described in a later study in better detail) but the parse jobs were intended to do a couple of things only, and do them well: read in xml, parse it, insert the data in the right database (mysql or redis, in our case).

Displaying the data, including doing things like contextualizing it, grouping related results together, etc., is handled at a later step.


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

* [Resque](https://github.com/defunkt/resque#readme) - a ruby library for placing jobs on one or more queues for later processing, backed by Redis
* [Redis](http://redis.io/topics/introduction) - a high performance data store for key-value and advanced data structures. This not only provided a lightweight backend for redis, we also used it to store the more extended data points - in other words, what didn't go in MySQL ended up in here.
* [MySQL](http://dev.mysql.com/doc/refman/5.6/en/what-is-mysql.html) - a popular relational database server, it stored the bulk of top-level Olympics data for us.
* [Nokogiri](http://nokogiri.org/) - a ruby library for parsing XML (and HTML) quickly

**Admin**

Basic UI showing stats for each message, allowing us to monitor the parsers and find specific messages:

![image](http://f.cl.ly/items/3D3B1I2H0f1J0a1i1t3U/Screen%20Shot%202013-02-11%20at%2010.40.04%20AM.png)


