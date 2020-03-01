import Vue from "vue";
import Vuex , { StoreOptions } from "vuex";
import  navMenu from './menus/nav-menu/nav-menu-module';
import AuthModule from './auth/auth';
Vue.use(Vuex);



export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { 
    navMenu,
    AuthModule,
  }
});
