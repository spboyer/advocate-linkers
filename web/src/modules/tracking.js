/* eslint-disable no-console */

const tracking = {
  addTracking: (url, tactic, category, alias) => {
    let baseUrl = url || "";
    if (baseUrl === "") return;

    const defaultDomains = [
      /(.*\.)?microsoft\.com$/,
      /(.*\.)?msdn\.com$/,
      /(.*\.)?visualstudio\.com$/,
      "www.microsoftevents.com"
    ];

    const config = {
      tactic,
      category,
      alias
    };
    let domains = config.domains;
    if (domains || Array.isArray(domains)) {
      domains = domains.concat(defaultDomains);
    } else {
      domains = defaultDomains;
    }
    config.domains = domains;
    let shouldAddTrackingInfo = false;
    if (baseUrl) {
      var re = new RegExp("^(http|https)://", "i");
      if (!re.test(baseUrl)) {
        baseUrl = `https://${baseUrl}`;
      }

      const uri = new URL(baseUrl);
      for (let i = 0; i < config.domains.length; i++) {
        let domain = config.domains[i];
        if (uri.host.match(domain)) {
          shouldAddTrackingInfo = true;
          break;
        }
      }

      if (shouldAddTrackingInfo) {
        //remove locale
        const localeRegex = /^\/\w{2}-\w{2}/g;
        uri.pathname = uri.pathname.replace(localeRegex, "");

        baseUrl = uri.toString();
      }
    }
    if (shouldAddTrackingInfo) {
      return appendTrackingInfo(config, baseUrl);
    }
    return baseUrl;
  }
};

function appendTrackingInfo(config, link) {
  const tracking =
    "WT.mc_id=" + config.tactic + "-" + config.category + "-" + config.alias;
  //respect or ignore currect query string
  const separator = link.indexOf("?") > 0 ? "&" : "?";
  //respect or ignore hash
  let hash = "";
  const hasHash = link.indexOf("#");
  if (hasHash != -1) {
    hash = link.substr(hasHash);
    link = link.replace(hash, "");
  }
  return link + separator + tracking + hash;
}

export { tracking as default };
