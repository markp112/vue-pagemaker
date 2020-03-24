import Vue from 'vue';
import Vuex , { Store } from 'vuex';
import { initialiseStore, modules } from './store-accessors';

Vue.use(Vuex);

const initialiser = (store: Store<any>) => initialiseStore(store);
export const plugins = [initialiser];
export * from './store-accessors';

export default new Store({
  plugins,
  modules,
  state: {root: 'globalRoot'},
  mutations: {},
  actions: {},
});
