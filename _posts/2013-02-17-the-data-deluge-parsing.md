---
layout: study
study_name: "How to Win the Olympics"
title: "1. The Data Deluge"
tagline: "Actually Parsing the Right Messages"
category: 
tags: [deluge]
---
{% include JB/setup %}

### Problem: Knowing What To Do

So we had a lot of xml. Results came in many shapes and forms even for a single race. For example, the 100m Dash included the following types of result messages:

DT_RESULT, DT_PHASE_RESULT, DT_CUMULATIVE_RESULT, DT_RT_CUMULATIVE_RESULT

Which one provides the most up-to-date, accurate data? If we missed a incremental message, could we just parse the next full one if we already have it?

Messages usually did not include the full story, either. Some were more straight forward than others:

{% highlight xml %}
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
{% endhighlight %}

That shows Usain Bolt winning a preliminary race in the 100m dash, qualifying for the next round and breaking a world record to boot. 

{% highlight xml %}
      <Period Code="Q2_H" HomeScore="20" AwayScore="35"/>
{% endhighlight %}

The above snippet shows the score in a men's basketball game. However: which period is "Q2_H"*? More importantly, who are the "Home" and "Away" teams in an international sporting event? 

Some validation was done at this step (described in a later study in better detail) but the parse jobs were intended to do a couple of things only, and do them well: read in xml, parse it, insert the data in the right database (mysql or redis, in our case).

Displaying the data, including doing things like contextualizing it, grouping related results together, etc., is handled at a later step.

* Q2_H: code for 'halfway through the second quarter'

### Implementation

All files were sent to a dispatcher whose sole job was to determine whether or not the message should be parsed. The rules for determining this were complex and varied depending on sport, application health, and a wealth of other factors too esoteric to get into here.

Basically, though, once the decision was made, the message was sent off to the parsers.

We used [Resque](https://github.com/defunkt/resque#readme) - a ruby library for placing jobs on one or more queues for later processing - to handle the division of labor across sports-specific job queues. Resque is backed by [Redis](http://redis.io/topics/introduction), a high performance data store for key-value and advanced data structures. Redis was so fast that we ended up using it to store the more extended data points, not just as a lightweight backend for Resque. In other words, what didn't go in MySQL ended up in here. [MySQL](http://dev.mysql.com/doc/refman/5.6/en/what-is-mysql.html) is a popular relational database server and we stored the bulk of top-level Olympics data in it.

For the actual parsing of XML, we turned to the ruby gem [Nokogiri](http://nokogiri.org/), known for its speed and reliability with massive amounts of XML. 


