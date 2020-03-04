/* eslint-disable no-console */
import localforage from 'localforage';

localforage.config({
  driver: localforage.LOCALSTORAGE,
  name: 'cxa-social-linker',
});

const saveToStorage = function(key, data) {
  return localforage
    .setItem(key, data)
    .then(value => console.log('saved: ' + value))
    .catch(err => console.log(err));
};

const getFromStorage = function(key) {
  return localforage
    .getItem(key)
    .then(value => {
      if (value != null) {
        return value;
      }
      return '';
    })
    .catch(err => console.log(err));
};

const getters = {
  alias: () => getFromStorage('alias'),
  shortenerProvider: () => getFromStorage('shortenerProvider'),
  shortApiKey: () => getFromStorage('shortApiKey'),
  shortUsername: () => getFromStorage('shortUsername'),
  shortVanity: () => getFromStorage('shortVanity'),
};

const actions = {
  saveAlias: data => saveToStorage('alias', data),
  saveShortProvider: data => saveToStorage('shortenerProvider', data),
  saveShortApiKey: data => saveToStorage('shortApiKey', data),
  saveShortUsername: data => saveToStorage('shortUsername', data),
  saveShortVanity: data => saveToStorage('shortVanity', data),
};

export const storage = {
  getters,
  actions,
};
