<lobby>
  <name-form></name-form>
  <search-opponent class={ hidden: !name }></search-opponent>

  <script>
    this.name = localStorage.getItem('castlefight-name');
    this.searching = false;
    this.found = false;

    this.on('search-opponent', function() {
      socket.send('search-opponent', {name: this.name});
    });
    this.on('stop-search-opponent', function() {
      socket.send('stop-search-opponent');
    });

    self = this;
    socket.bind('opponent-found', function() {
      self.update({found: true});
    });
  </script>
</lobby>
