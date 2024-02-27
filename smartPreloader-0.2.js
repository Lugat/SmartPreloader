/**
 * Smart Prealoder v0.2
 * 
 * This plugin will preload links before a user clicks on it.
 * As this URLs will be cached, the user will experiance a better performance.
 * 
 * @param object config
 * @returns {SmartPreloader}
 */

function SmartPreloader(config) {
    
  this.config = Object.assign({
    selector: 'a[href]',
    perimeter: 0,
    flat: 'data-smart-preloaded',
    getUrl: function() {
      return this.href;
    }
  }, config);
        
  this.init();
  
}

SmartPreloader.prototype = {
  
  _getDistance: function(e, element) {
    
    const rect = element.getBoundingClientRect(),
      x1 = rect.left,
      y1 = rect.top,
      x2 = x1 + rect.width,
      y2 = y1 + rect.height,
      intersectX = Math.min(e.pageX, x2) >= Math.max(e.pageX, x1),
      intersectY = Math.min(e.pageY, y2) >= Math.max(e.pageY, y1),
      distX = (intersectX ? e.pageX : x2 < e.pageX ? x2 : x1) - e.pageX,
      distY = (intersectY ? e.pageY : y2 < e.pageY ? y2 : y1) - e.pageY;

    return Math.sqrt(distX * distX + distY * distY);
    
  },
  
  _load: function(element) {
    
    element.setAttribute(this.config.flag, true);

    fetch(this.config.getUrl.apply(element));

  },
  
  init: function() {
        
    document.querySelectorAll(this.config.selector).forEach((link) => {

      link.setAttribute(this.config.flag, false);

      if (this.config.perimeter === 0) {
        link.addEventListener('mouseover', this._load(link), { once: true });
      }

    });

    if (this.config.perimeter > 0) {

      document.addEventListener('mousemove', (e) => {

        document.querySelectorAll(this.config.selector+'['+this.config.flag+'="false"]').forEach((link) => {
          
          if (this._getDistance(e, link) <= this.config.perimeter) {
            this._load(link);
          }

        });

      });

    } 
    
  }
  
};