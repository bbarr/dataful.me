define(function(require) {

  return function() {

    function generateTagArray(tags) {
      var arr = [];
      for (var k in tags) {
        arr.push({ key: k, val: tags[k] });
      }
      return arr;
    }
    
    this.tagArray = generateTagArray(this.tags || {});
    this.link('tags', 'tagArray', generateTagArray);

    this.meta_id = function() { return this.meta('id'); };
  }
});
