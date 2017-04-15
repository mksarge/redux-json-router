/**
 * Tries to match a path (parameterized or exact) with the routing config
 */
function matchPath(routes, path) {
  const params = {};

  const index = routes.findIndex((route) => {
    if (/^\/:/.test(route.path)) {
      params[route.path.substring(2)] = path;
      return true;
    }

    return `/${path}` === route.path;
  });

  return {
    index,
    params,
  };
}

/**
 * Tries to match a nested pathname (parsed into an array) with the routing config
 */
function matchRoute(routes, paths) {
  // try to match the first path in the paths array to the routeConfig
  const { index: matchingIndex, params } = matchPath(routes, paths[0]);

  // a matching route was found
  if (matchingIndex >= 0) {
    // try matching the nested routes recursively
    if (paths.length > 1 && routes[matchingIndex].children) {
      const next = matchRoute(routes[matchingIndex].children, paths.slice(1));
      if (next) return next;
    }

    // return the matched route and params
    return {
      route: routes[matchingIndex],
      params,
    };
  }

  // try loading the catch-all route
  const catchAllIndex = routes.findIndex((obj) => obj.path === '*');
  return (catchAllIndex >= 0)
    ? {
      route: routes[catchAllIndex],
      params: {},
    }
    : null;
}

export { matchRoute };
