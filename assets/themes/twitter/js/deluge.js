(function() {
  var onload = window.onload;
  window.onload = function(){
    if (typeof onload == "function") onload();
            var options = { "title": { "text": "ODF Deluge" },"legend": { "layout": "vertical","style": {  } },"xAxis": {  },"yAxis": { "title": { "text": null },"labels": {  } },"tooltip": { "enabled": true },"credits": { "enabled": false },"plotOptions": { "areaspline": {  } },"chart": { "height": 400, "defaultSeriesType": "line","renderTo": "highcharts-graph-message-counts" },"subtitle": {  },"xAxis": { "categories": [ "Jul 02","Jul 06","Jul 08","Jul 09","Jul 10","Jul 11","Jul 12","Jul 13","Jul 14","Jul 15","Jul 16","Jul 17","Jul 18","Jul 19","Jul 20","Jul 21","Jul 22","Jul 23","Jul 24","Jul 25","Jul 26","Jul 27","Jul 28","Jul 29","Jul 30","Jul 31","Aug 01","Aug 02","Aug 03","Aug 04","Aug 05","Aug 06","Aug 07","Aug 08","Aug 09","Aug 10","Aug 11","Aug 12","Aug 13" ] },"yAxis": { "min": 0,"title": { "text": null } },"series": [{ "name": "# Messages Received","data": [ 2065,60,9,6102,14100,3684,37089,23027,11854,10958,2523,2385,1816,1572,5106,1901,1597,4645,2667,10173,101071,16228,100993,97790,92729,91433,86039,75179,88053,73076,56695,63744,44665,37374,26805,25940,24669,19886,724 ] }] };

window.chart_message_counts = new Highcharts.Chart(options);

  };
})()

