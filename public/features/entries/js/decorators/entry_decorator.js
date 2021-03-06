define(function(require) {

  return function() {

    this.viewName = function() {
      return (this.editing ? 'EntryFormView' : 'EntryView') + ' ' + this.meta('id');
    }

    function generateTagArray(tags) {
      var arr = [];
      for (var k in tags) {
        arr.push({ key: k, val: tags[k] });
      }
      return arr;
    }
    
    this.tagArray = generateTagArray(this.tags || {});
    this.link('tags', 'tagArray', generateTagArray);
  }
});
