/* eslint-disable no-console */
const routes = [
  {
    path: '/',
    load: () => Promise.resolve('home'),
  },
  {
    path: '/about',
    load: () => Promise.resolve('about'),
    children: [
      {
        path: '/project',
        load: () => Promise.resolve('project'),
      },
    ],
  },
  {
    path: '/blog',
    load: () => Promise.resolve('blog'),
    children: [
      {
        path: '/:id',
        load: () => Promise.resolve('post'),
      },
    ],
  },
  {
    path: '*',
    load: () => Promise.resolve('catch-all'),
  },
];

export default routes;
