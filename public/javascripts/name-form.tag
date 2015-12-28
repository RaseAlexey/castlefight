<name-form>
  <form class={ hidden: parent.name } onsubmit={ enter }>
    <input type="text" class="name" placeholder="what is your name today?">
    <input type="submit">
  </form>

  <div class={ hidden: !parent.name }>
    Hello {parent.name}.
  </div>

  <script>
    enter = function() {
      var name = $('.name').val();
      if(name) {
        localStorage.setItem('castlefight-name', name);
        this.parent.update({name: name});
      }
    };
  </script>
</name-form>
