;(function($, window, document, undefined) {
  
  $.fn.smartPreload = function(perimeter) {

    // only links with href attribute
    const flag = 'data-smart-preloaded',
      $links = $(this).filter('a[href]').attr(flag, false);

    // no perimeter given, trigger on mouseover
    if (!perimeter) {

      $links.on('mouseover', function() {
        $(this).attr(flag, true).off('mouseover');
        fetch(this.href);
      });

    } else {

      // perimeter given, calculate distance
      $(document).mousemove(function(e) {

        // only load links which have not been loaded yet
        $links.filter('['+flag+'="false"]').each(function() {

          var $this = $(this),
            distance = Math.floor(Math.sqrt(Math.pow(e.pageX - ($this.offset().left+($this.width()/2)), 2) + Math.pow(e.pageY - ($this.offset().top+($this.height()/2)), 2)));

          // preload URL if distance is less than perimeter
          if (distance <= perimeter) {
            $this.attr(flag, true);
            fetch(this.href);
          }

        });

      });

    }
    
  };
 
}(jQuery, window, document));