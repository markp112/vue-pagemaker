import Vue from "vue";
import VueRouter from "vue-router";
import home from '@/components/core/home/home.vue'
import register from '@/components/auth/register/register.vue';
import login from '@/components/auth/login/login.vue';
import siteslist from '@/components/sites/sites-list.vue';
import newSite from '@/components/sites/new-site.vue';
import PageList from '@/views/pages/page-list.vue'
import PageEditor from '@/views/pages/page.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: home,
    meta: {
      breadcrumb: [
        { name: 'home' }
      ]
    },
  },
  {
    path: "/register",
    name: "register",
    component: register,
    meta: {
      breadcrumb: [
        { name: 'home', link: 'home' },
        { name: 'register' }
      ]
    },
  },
  {
    path: "/login",
    name: "login",
    component: login,
    meta: {
      breadcrumb: [
        { name: 'home', link: 'home' },
        { name: 'login' }
      ]
    },
  },
  {
    path: "/sites",
    name: "sites",
    component: siteslist,
    meta: {
      breadcrumb: [
        { name: 'home', link: 'home' },
        { name: 'sites' }
      ]
    },
  },
  {
    path: "/newSite",
    name: "/newsite",
    component: newSite,
    meta: {
      breadcrumb: [
        { name: 'home', link: 'home' },
        { name: 'sites', link: 'sites' },
        { name: 'new site' }
      ]
    },
  },
  {
    path: "/pages/:id",
    name: "pageList",
    component: PageList,
    meta: {
      breadcrumb: [
        { name: 'home', link: 'home' },
        { name: 'sites', link: 'sites' },
        { name: 'page list' }
      ]
    },
  },
  {
    path: "/pageEditor/:title",
    name: "page-editor",
    component: PageEditor,
    meta: {
      breadcrumb: [
        { name: 'home', link: 'home' },
        { name: 'sites', link: 'sites' },
        { name: 'page list', link: 'pageList' },
        { name: 'page-editor' }
      ]
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export interface BreadcrumbLink {
  name: string,
  link?: string,
}

export default router;
