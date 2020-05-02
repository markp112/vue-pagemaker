

import Snackbar from '../src/components/base/notifications/snackbar/snackbar.vue'
import Vue from 'vue';
import Vuex from 'vuex';



Vue.use(Vuex);
export const store = new Vuex.Store({
  modules: {
    State: {
      namespaced: true,
      state: {
        snackbar:{ 
        message: 'Hello Storybook' ,
        title: 'Snackbar Component',
        type: 'error',
        duration: 5000,
        show: true,
        
        }
      },
      getters: {
      snackbarMessage() {
        return this.snackbar;
      }
      },
    },
  },
});


export default {
  title: 'snackbar',
  component: Snackbar,
};



export const simpleSnackbar = () => ({
  name:'Snackbar',
  components: Snackbar,
  template: '<snackbar />',
  store
});
