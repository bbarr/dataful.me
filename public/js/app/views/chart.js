define([
  'backbone',
  'charts'
], function(Backbone) {
  
  return Backbone.View.extend({
    
    initialize: function() {
      this.gchart = new google.visualization.LineChart(this.el);
    },

    render: function() {
      var timestamp = Math.round(Date.parse((new Date).toUTCString()) / 1000);
      $.get('/stats/' + this.model.get('id') + '/historic/' + timestamp, function(data) {
        this['render_' + data.action](data);
      }.bind(this))
    },

    render_count: function(data) {

      var chart_data = [[ 'Date', 'Count' ]];

      _(data.values.reverse()).each(function(v) { 
        chart_data.push([ this.extract_date_string(v.date), v.value ]); 
      }.bind(this));

      this.gchart.draw(google.visualization.arrayToDataTable(chart_data), {});
    },

    render_sum: function(data) {
      
      var chart_data = [[ 'Date', 'Sum' ]];

      _(data.values.reverse()).each(function(v) { 
        if (!v.value) v.value = 0;
        chart_data.push([ this.extract_date_string(v.date), v.value ]); 
      }.bind(this));

      this.gchart.draw(google.visualization.arrayToDataTable(chart_data), {});
    },

    render_average: function(data) {
      
      var chart_data = [[ 'Date', 'Average' ]];

      _(data.values.reverse()).each(function(v) {
        if (v.value === '') v.value = null;
        chart_data.push([ this.extract_date_string(v.date), v.value ]); 
      }.bind(this));

      this.gchart.draw(google.visualization.arrayToDataTable(chart_data), {});
    },

    render_usual: function(data) {

      var chart_data = [[ 'Date' ]];

      var keys = _(data.values).chain().map(function(val) {
        if (val.value) {
          return _(val.value).keys();
        }
      }).flatten().compact().uniq().value();

      chart_data[0] = chart_data[0].concat(keys);

      _(data.values).each(function(val) {
        _(keys).each(function(key) {
          if (typeof val.value === 'string') {
            val.value = {};
          }
          val.value[key] = val.value[key] || 0;
        });
      });

      _(data.values.reverse()).each(function(daily) { 
        var values = [ this.extract_date_string(daily.date) ];
        _(daily.value).each(function(value, key) {
          var index = chart_data[0].indexOf(key);
          values[index] = value;
        });
        chart_data.push(values); 
      }.bind(this));

      var options = {
        isStacked: true
      };

      var chart = new google.visualization.SteppedAreaChart(this.el);
      chart.draw(google.visualization.arrayToDataTable(chart_data), options);
    },

    extract_date_string: function(date) {
      var date_info = date.match(/(\d+)-(\d+)T/)
      return date_info[1] + '/' + date_info[2];
    }
  });
});
