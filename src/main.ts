import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { firestorePlugin } from 'vuefire';
import Firebase from 'firebase/app';
import  'firebase/firestore';
import { secrets } from './firebase/secrets';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
import VueFilterDateParse from '@vuejs-community/vue-filter-date-parse';

import('@/assets/styles/index.css');

export const firebaseApp = Firebase.initializeApp(secrets.google);

// The default cache size threshold is 40 MB. Configure 'cacheSizeBytes'
// for a different threshold (minimum 1 MB) or set to 'CACHE_SIZE_UNLIMITED'
// to disable clean-up.
firebaseApp.firestore().settings({
  cacheSizeBytes: 4000000,
});

firebaseApp.firestore().enablePersistence()
  .catch(err => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });

Vue.config.productionTip = false;
Vue.use(firestorePlugin);
Vue.use(VueFilterDateFormat);
Vue.use(VueFilterDateParse);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
