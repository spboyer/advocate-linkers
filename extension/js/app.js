let CxALinkerApp = angular.module("CxALinkerApp", []);

CxALinkerApp.controller("PopupController", function(
  $scope,
  $timeout,
  ChromeFunctions,
  LinkService
) {
  $scope.originalUrl = "https://www.google.com";
  $scope.config = {
    props: ["event", "channel", "alias"]
  };

  /* These two functions are called when the extension is opened */

  // 1. Gets the last stored alias, event and channel from local storage
  ChromeFunctions.getConfiguration($scope.config.props).then(result => {
    $scope.config.values = result;
  });

  // 2. Prefills the input with the URL of the current page
  ChromeFunctions.getCurrentUrl().then(result => {
    $scope.originalUrl = result;
  });

  /* */

  $scope.saveConfiguration = function() {
    chrome.storage.sync.set($scope.config.values);
  };

  $scope.shortenUrl = function() {
    $scope.status = "Shortening...";
    const trackedUrl = LinkService.track(this.originalUrl, this.config);
    LinkService.shorten(trackedUrl)
      .then(result => {
        ChromeFunctions.copyToClipboard(result);
        window.close();
      })
      .catch(() => {
        $scope.status = "FAILED";
      });
  };

  $scope.trackUrl = function() {
    const trackedUrl = LinkService.track(this.originalUrl, this.config);
    ChromeFunctions.copyToClipboard(trackedUrl);
    window.close();
  };
});

CxALinkerApp.service("LinkService", function($q, $http) {
  const API_URL = "https://cda.ms/save";
  const WEBTRENDS = "WT.mc_id=";

  return {
    track(url, config) {
      var separator =
          (url = url.replace(
            /microsoft.com\/\w{2}-\w{2}\//g,
            "microsoft.com/"
          )).indexOf("?") > 0
            ? "&"
            : "?",
        fragment = "",
        hashIndex = url.indexOf("#");
      -1 != hashIndex &&
        ((fragment = url.substr(hashIndex)), (url = url.replace(fragment, "")));

      let wtUrl = `${url}${separator}${WEBTRENDS}`;

      // add in the tracking details
      config.props.forEach((prop, index) => {
        wtUrl = `${wtUrl}${config.values[prop]}`;
        index < config.props.length - 1 && (wtUrl += "-");
      });

      return wtUrl + fragment;
    },

    shorten(url) {
      const defer = $q.defer();
      $http({
        method: "POST",
        url: API_URL,
        data: JSON.stringify({
          url: url
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }).then(result => {
        defer.resolve(result.data.url);
      });

      return defer.promise;
    }
  };
});

CxALinkerApp.factory("ChromeFunctions", function($q) {
  return {
    getConfiguration(props) {
      const defer = $q.defer();
      chrome.storage.sync.get(props, result => {
        defer.resolve(result);
      });

      return defer.promise;
    },

    getCurrentUrl() {
      const defer = $q.defer();

      chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        defer.resolve(tabs[0].url);
      });

      return defer.promise;
    },

    copyToClipboard(url) {
      const input = document.createElement("input");
      input.style.position = "fixed";
      input.style.opacity = 0;
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
      document.body.removeChild(input);
    }
  };
});
