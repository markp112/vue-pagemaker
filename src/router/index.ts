import Vue from "vue";
import VueRouter from "vue-router";
import register from '@/components/auth/register.vue';
import login from '@/components/auth/login.vue';
import SitesList from '@/components/sites/sites-list.vue'

Vue.use(VueRouter);

const routes = [
 
  {
    path: "/register",
    name: "/register",
    component: register,
  },
  {
    path: "/login",
    name: "/login",
    component: login,
  },
  {
    path: "/sites",
    name: "/sites",
    component: SitesList,
  }

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
