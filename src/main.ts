import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/tailwind.css";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLanguage, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { firestorePlugin } from 'vuefire'
import Firebase from 'firebase/app'
import { secrets } from '@/firebase/secrets'

export const firebaseApp = Firebase.initializeApp(secrets.google);



Vue.config.productionTip = false;

library.add(faLanguage, faBars);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(firestorePlugin);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
