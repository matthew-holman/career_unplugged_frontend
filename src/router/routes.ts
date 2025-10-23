import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/jobs',
      },
      {
        path: 'jobs',
        name: 'jobs',
        component: () => import('pages/JobsPage.vue'),
      },
      {
        path: 'career-pages',
        name: 'career-pages',
        component: () => import('pages/CareerPagesPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
