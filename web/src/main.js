/* eslint-disable no-console */
import Vue from 'vue';

import vuetify from '@/plugins/vuetify';

import App from './App.vue';
import router from './router';

import VueClipboard from 'vue-clipboard2';
import Toasted from 'vue-toasted';
import Vuelidate from 'vuelidate';

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import VueAppInsights from 'vue-application-insights';

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: 'd8d11b38-ae34-4d38-b5cd-dab76f992722',
    maxBatchInterval: 2000
  }
});
appInsights.loadAppInsights();

Vue.use(VueAppInsights, {
  appInsights: appInsights,
  router
});

Vue.use(VueClipboard);
Vue.use(Toasted);
Vue.use(Vuelidate);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app');
