<search-opponent>
  <h3>Fight or die!</h3>
  <div class={ hidden: parent.searching }>
    <button onclick={ searchOpponent }>Find me a worthy opponent!</button>
  </div>
  <div class={ hidden: !parent.searching || parent.found }>
    Searching...
    <button onclick={ stopSearch }>Cancel</button>
  </div>
  <div class={ hidden: !parent.found }>
    Found an opponent!
  </div>

  <script>

    searchOpponent = function() {
      this.parent.update({searching: true});
      this.parent.trigger('search-opponent');
    };

    stopSearch = function() {
      this.parent.update({searching: false});
      this.parent.trigger('stop-search-opponent');
    };
  </script>
</search-opponent>
