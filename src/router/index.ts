import Vue from "vue";
import VueRouter from "vue-router";
import home from '@/components/core/home/home.vue'
import register from '@/components/auth/register.vue';
import login from '@/components/auth/login.vue';
import siteslist from '@/components/sites/sites-list.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "/home",
    component: home,
  },
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
    component: siteslist,
  }

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
