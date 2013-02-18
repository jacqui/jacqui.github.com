---
layout: study
study_name: "How to Win the Olympics"
title: "1. The Data Deluge"
tagline: "Names are Important"
category: 
tags: [deluge]
---
{% include JB/setup %}

### Problem: Finding the Important Messages

Ok, the listener is saving ODF messages on the server. The thing about these messages is that you don't have to parse every single one to get a full accurate view of the data. There are incremental messages updating a single athlete's time in a race, immediately followed by a fuller message listing every athlete's results in that race. 

Which messages are the most important? Parsing XML takes up system resources and time - and we didn't want to use up either unnecessarily. We wanted to be selective. We realized that everything we needed to determine which messages has to be parsed could be stored in the message file names.

What naming convention should we follow, though? Well, There's a famous quote among computer programmers:

> "There are only two hard things in Computer Science: cache invalidation and naming things." 
> -- Phil Karlton


In the end, we decided to follow the naming convention that the IOC used on its backup data site. I have to admit, it looks a bit insane:

```
20110929125431235000-ATM001000__________DT_RT_CUMULATIVE_RESULT_______ATM001908___________00001P___.xml
```

However, it does include all the data points required to make that determination: to parse, or not to parse? Using the same filenames as the backup site meant we could download files directly and not worry about the name mismatching, too.

How do you construct that rather long, fixed width, padded-with-underscores name without slowing things down? Why, you use regular expressions :)

The first line of every single ODF message has a node called "OdfBody" with consistent attributes that describe the kind of data included in the xml.

Here's how we used the OdfBody node to streamline the Listener and prep the right files for parsing:

* upon receiving an xml messsage,
* grab the first line of text (the OdfBody node)
* run a pattern match on it
* resulting in a simple key-value structure of attributes
* order the values correctly, ensure there's enough '_' padding
* and save the message contents to a file with the newly constructed name

Limiting ourselves to a single line of xml and using a regular expression instead of the most costly approach of an XML parser - which reads the entire file into memory and creates objects in ruby for each node - for this step meant the process was fast.  

Perhaps an example 'OdfBody' will clarify: 

```xml
<OdfBody DocumentCode="ATM001000" DocumentType="DT_RT_CUMULATIVE_RESULT" Venue="STA" Date="20110929" Time="125431235" LogicalDate="20110929" FeedFlag="P" ResultStatus="LIVE_MANDATORY" DocumentSubtype="ATM001908" Version="1" RTSerial="151" Serial="95">
```

Results in the filename:

```
20110929125431235000-ATM001000__________DT_RT_CUMULATIVE_RESULT_______ATM001908___________00001P___.xml
```

That filename, deciphered:

LogicalDate + Time + DocumentCode + Document Subcode + DocumentType + DocumentSubtype + Version + FeedFlag + ".xml"

Underscores are used for padding when one of those attributes is missing, blank or shorter than the maximum size.

* [Previous: Gigabytes of XML]({% post_url 2013-02-17-the-data-deluge-accepting-gigabytes-of-xml %})
* [Next: XML Variety Show]({% post_url 2013-02-17-the-data-deluge-xml-varieties %})
