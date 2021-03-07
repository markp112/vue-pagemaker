import Vue from 'vue';
import VueRouter from 'vue-router';
import home from '@/components/core/home/home.vue';
import register from '@/components/auth/register/register.vue';
import login from '@/components/auth/login/login.vue';
import siteslist from '@/components/sites/sites-list.vue';
import newSite from '@/components/sites/new-site.vue';
import PageEditor from '@/views/pages/page.vue';
import PageBuilder from '@/views/page-builders/page-builder-raw.vue';
import SideBarIconEditor from '@/views/admin/sidebar-icon-editor/sidebar-icon-editor.vue';
import SiteSettings from '@/views/settings/index.vue';
import imageLibrary from '@/views/image-library/image-library.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: home,
    meta: {
      breadcrumb: [{ name: 'home' }]
    }
  },
  {
    path: '/register',
    name: 'register',
    component: register,
    meta: {
      breadcrumb: [{ name: 'home', link: 'home' }, { name: 'register' }]
    }
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      breadcrumb: [{ name: 'home', link: 'home' }, { name: 'login' }]
    }
  },
  {
    path: '/sites',
    name: 'sites',
    component: siteslist,
    meta: {
      breadcrumb: [{ name: 'home', link: 'home' }, { name: 'sites' }]
    }
  },
  {
    path: '/newSite',
    name: 'newSite',
    component: newSite,
    meta: {
      breadcrumb: [
        { name: 'home', link: 'home' },
        { name: 'sites', link: 'sites' },
        { name: 'new site' }
      ]
    }
  },
  {
    path: '/pageList',
    name: 'pageList',
    component: () => import('@/views/pages/page-list.vue'),
    meta: {
      breadcrumb: [
        { name: 'home', link: 'home' },
        { name: 'sites', link: 'sites' },
        { name: 'pages' }
      ]
    }
  },
  {
    path: '/settings',
    name: 'siteSettings',
    component: SiteSettings,
    meta: {
      breadcrumb: [
        { name: 'home', link: 'home' },
        { name: 'sites', link: 'sites' },
        { name: 'settings', link: 'settings' }
      ]
    }
  },
  {
    path: '/pageEditor/:title',
    name: 'page-editor',
    component: PageEditor,
    meta: {
      breadcrumb: [
        { name: 'home', link: 'home' },
        { name: 'sites', link: 'sites' },
        { name: 'page list', link: 'pageList' },
        { name: 'page-editor' }
      ]
    }
  },
  {
    path: '/pagebuilder/:title',
    name: 'page-builder',
    component: PageBuilder,
    meta: {
      breadcrumb: [
        { name: 'home', link: 'home' },
        { name: 'sites', link: 'sites' },
        { name: 'page list', link: 'pageList' },
        { name: 'page-Builder' }
      ]
    }
  },
  {
    path: '/imageLibrary',
    name: 'image-library',
    component: imageLibrary,
    meta: {
      breadcrumb: [
        { name: 'home', link: 'home' },
        { name: 'sites', link: 'sites' },
        { name: 'image-library' }
      ]
    }
  },
  {
    path: '/iconeditor',
    name: 'icon-editor',
    component: SideBarIconEditor,
    meta: {
      breadcrumb: [{ name: 'home', link: 'home' }, { name: 'icon editor' }]
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export interface BreadcrumbLink {
  name: string;
  link?: string;
}

export default router;
