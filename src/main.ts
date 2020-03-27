import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/tailwind.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLanguage, faBars, faChevronCircleLeft, faChevronCircleRight, faPlusCircle, faImage, faAlignJustify, faHome, faQuestion, faQuestionCircle, faBlog, faPhotoVideo, faCamera, faImages, faIdCard, faPhone, faEnvelope  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { firestorePlugin } from 'vuefire';
import Firebase from 'firebase/app';
import  'firebase/firestore';
import { secrets } from '@/firebase/secrets';
import VueFilterDateFormat from 'vue-filter-date-format';
import VueFilterDateParse from 'vue-filter-date-parse';
import Datepicker from "vuejs-datepicker";
Vue.component("datepicker", Datepicker);

export const firebaseApp = Firebase.initializeApp(secrets.google);
// The default cache size threshold is 40 MB. Configure "cacheSizeBytes"
// for a different threshold (minimum 1 MB) or set to "CACHE_SIZE_UNLIMITED"
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
// Subsequent queries will use persistence, if it was enabled successfully
  




Vue.config.productionTip = false;

library.add(faLanguage, faBars, faChevronCircleLeft, faChevronCircleRight, faPlusCircle, faImage, faAlignJustify, faHome, faQuestion, faQuestionCircle, faBlog, faPhotoVideo, faCamera, faImages, faIdCard, faPhone, faEnvelope);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(firestorePlugin);
Vue.use(VueFilterDateFormat);
Vue.use(VueFilterDateParse);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
