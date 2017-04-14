function findAndLoad(routes, paths) {
  let matchVar;
  let matchExact;
  const currentPath = paths[0];

  const index = routes.findIndex((route) => {
    matchVar = /^\/:/.test(route.path);
    matchExact = `/${currentPath}` === route.path;
    return matchVar || matchExact;
  });

  if (index >= 0) {
    // if the paths array has length > 1, and the current route object
    // has a 'children' property, search recursively for nested routes
    if (paths.length > 1 && routes[index].children) {
      const next = findAndLoad(routes[index].children, paths.slice(1));
      if (next) {
        return next;
      }
    }
    // else, load the current route object
    return routes[index].load(currentPath);
  } else {
    const errIndex = routes.findIndex((obj) => obj.path === '*');
    return (errIndex >= 0)
      ? routes[errIndex].load(currentPath)
      : null;
  }
}

const matchRoute = (routes, router) => {
  const component = findAndLoad(routes, router.paths);
  return component;
};

export { matchRoute };
