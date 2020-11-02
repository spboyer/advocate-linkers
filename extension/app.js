let WTifyApp = angular.module("WTify", []);

WTifyApp.controller("PopupController", function (
  $scope,
  AreaPathService,
  ChromeFunctions,
  LinkService
) {
  ($scope.areaPaths = []), ($scope.originalUrl = "https://www.google.com");
  $scope.config = {
    props: ["areaPath", "ADOid", "alias"]
  };

  /* These three functions are called when the extension is opened */

  // 1. Gets the last stored alias, areapath and adoid from local storage
  ChromeFunctions.getConfiguration($scope.config.props).then((result) => {
    $scope.config.values = result;
  });

  // 2. Gets the list of available areapaths from https://github.com/spboyer/advocate-linkers
  AreaPathService.get().then((data) => {
    $scope.areaPaths = data;
  });

  // 3. Prefills the input with the URL of the current page
  ChromeFunctions.getCurrentUrl().then((result) => {
    $scope.originalUrl = result;
  });

  /* */

  $scope.saveConfiguration = function () {
    chrome.storage.sync.set($scope.config.values);
  };

  $scope.shortenUrl = function () {
    $scope.status = "Shortening...";
    const trackedUrl = LinkService.track(this.originalUrl, this.config);
    LinkService.shorten(trackedUrl)
      .then((result) => {
        ChromeFunctions.copyToClipboard(result);
        window.close();
      })
      .catch(() => {
        $scope.status = "FAILED";
      });
  };

  $scope.trackUrl = function () {
    const trackedUrl = LinkService.track(this.originalUrl, this.config);
    ChromeFunctions.copyToClipboard(trackedUrl);
    window.close();
  };
});

WTifyApp.service("AreaPathService", function ($q, $http) {
  return {
    get() {
      const URL =
        "https://raw.githubusercontent.com/spboyer/advocate-linkers/master/area-paths.json";
      const defer = $q.defer();
      $http.get(URL).then((result) => {
        defer.resolve(result.data);
      });

      return defer.promise;
    }
  };
});

WTifyApp.service("LinkService", function ($q, $http) {
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

      config.values.ADOid = config.values.ADOid || "0000";

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
      }).then((result) => {
        defer.resolve(result.data.url);
      });

      return defer.promise;
    }
  };
});

WTifyApp.factory("ChromeFunctions", function ($q) {
  return {
    getConfiguration(props) {
      const defer = $q.defer();
      chrome.storage.sync.get(props, (result) => {
        defer.resolve(result);
      });

      return defer.promise;
    },

    getCurrentUrl() {
      const defer = $q.defer();

      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        defer.resolve(tabs[0].url);
      });

      return defer.promise;
    },

    setValue(key, value) {
      chrome.storage.sync.set({ key, value });
    },

    copyToClipboard(url) {
      const input = document.createElement("input");
      input.style.position = "fixed";
      input.style.opacity = "0";
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
      document.body.removeChild(input);
    }
  };
});
