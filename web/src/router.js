import Vue from 'vue';
import Router from 'vue-router';
import LinkShare from './views/LinkShare.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: LinkShare,
    },
    {
      path: '/settings',
      name: 'settings',
      component: () =>
        import(/* webpackChunkName: "settings" */ './views/Settings.vue'),
    },
    {
      path: '/credits',
      name: 'credits',
      component: () =>
        import(/* webpackChunkName: "settings" */ './views/Credits.vue'),
    },
  ],
});
