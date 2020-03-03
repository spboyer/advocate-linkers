/* eslint-disable no-console */
import localforage from "localforage";
localforage.config({
  driver: localforage.LOCALSTORAGE,
  name: "cxa-social-linker"
});

const getters = {
  alias: () => {
    return localforage
      .getItem("alias")
      .then(value => {
        if (value != null) {
          return value;
        }
        return "";
      })
      .catch(err => {
        console.log(err);
      });
  },
  shortenerProvider: () => {
    return localforage
      .getItem("shortenerProvider")
      .then(value => {
        if (value != null) {
          return value;
        }
        return "";
      })
      .catch(err => {
        console.log(err);
      });
  },
  shortApiKey: () => {
    return localforage
      .getItem("shortApiKey")
      .then(value => {
        if (value != null) {
          return value;
        }
        return "";
      })
      .catch(err => {
        console.log(err);
      });
  },

  shortUsername: () => {
    return localforage
      .getItem("shortUsername")
      .then(value => {
        if (value != null) {
          return value;
        }
        return "";
      })
      .catch(err => {
        console.log(err);
      });
  },

  shortVanity: () => {
    return localforage
      .getItem("shortVanity")
      .then(value => {
        if (value != null) {
          return value;
        }
        return "";
      })
      .catch(err => {
        console.log(err);
      });
  }
};

const actions = {
  saveAlias: data => {
    localforage
      .setItem("alias", data)
      .then(value => {
        console.log("saved: " + value);
      })
      .catch(err => {
        console.log(err);
      });
  },
  saveShortProvider: data => {
    localforage
      .setItem("shortenerProvider", data)
      .then(value => {
        console.log("saved: " + value);
      })
      .catch(err => {
        console.log(err);
      });
  },
  saveShortApiKey: data => {
    localforage
      .setItem("shortApiKey", data)
      .then(value => {
        console.log("saved: " + value);
      })
      .catch(err => {
        console.log(err);
      });
  },
  saveShortUsername: data => {
    localforage
      .setItem("shortUsername", data)
      .then(value => {
        console.log("saved: " + value);
      })
      .catch(err => {
        console.log(err);
      });
  },
  saveShortVanity: data => {
    localforage
      .setItem("shortVanity", data)
      .then(value => {
        console.log("saved: " + value);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

const storage = {
  getters,
  actions
};

export { storage as default };
