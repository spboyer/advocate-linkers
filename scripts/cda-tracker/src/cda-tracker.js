// credit to github.com/anthonychu
(function() {
    function cdaTracker(config) {
      var defaultDomains = [
        /(.*\.)?azure\.microsoft\.com$/,
        /(.*\.)?blogs\.msdn\.microsoft.com$/,
        /(.*\.)?channel9\.msdn\.com$/,
        /(.*\.)?code\.visualstudio\.com$/,
        /(.*\.)?cloudblogs\.microsoft\.com$/,
        /(.*\.)?devblogs\.microsoft\.com$/,
        /(.*\.)?docs\.microsoft\.com$/,
        /(.*\.)?marketplace\.visualstudio\.com$/,
        /(.*\.)?techcommunity\.microsoft\.com$/
      ];
    
      var domains = config.domains;
      if (domains || Array.isArray(domains)) {
        domains = domains.concat(defaultDomains);
      } else {
        domains = defaultDomains;
      }
    
      config.domains = domains;
    
      appendTrackingInfo(config, [].slice.call(document.getElementsByTagName('a')));
    }
    
    function appendTrackingInfo(config, links) {
      var needsTracking = 
        links.filter(l => domainNeedsTracking(l, config.domains) && !isAlreadyTracked(l));
    
      for (var l of needsTracking) {
        var tracking = 'WT.mc_id=' + config.event + '-' + config.channel + '-' + config.alias;
        if (l.search) {
          l.search = l.search + '&' + tracking;
        } else {
          l.search = '?' + tracking;
        }
      }
    }
    
    function isAlreadyTracked(link) {
      return /[\?\&]WT\.mc_id=/i.test(link.search);
    }
    
    function domainNeedsTracking(link, domains) {
      return domains.some(function(d) {
        if (d instanceof RegExp) {
          return d.test(link.hostname);
        } else if (typeof(d) === 'string') {
          return d === link.hostname;
        }
        return false;
      });
    }
    
    if (typeof(module) !== 'undefined' && module.exports) {
      module.exports.appendTrackingInfo = appendTrackingInfo;
    }
  
    if (typeof(window) !== 'undefined') {
      window.cdaTracker = cdaTracker;
    }
  }());
