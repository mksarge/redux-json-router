/**
 * Parse the pathname string into an array.
 * Eg. '/nested/route/3' => ['nested, 'route', '3']
 */
function parsePathname(pathname) {
  return pathname.split('/').slice(1);
}

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
  return { index, params };
}

/**
 * Tries to match a nested pathname (parsed into an array) with the routing config
 */
function matchPaths(routes, paths) {
  // Try matching the first string in the paths array to the route configuration
  const { index: matchingIndex, params } = matchPath(routes, paths[0]);

  // If a matching route was found, try matching the nested routes recursively
  if (matchingIndex >= 0) {
    if (paths.length > 1 && routes[matchingIndex].children) {
      const next = matchPaths(routes[matchingIndex].children, paths.slice(1));
      if (next) {
        return next;
      }
    }

    return { route: routes[matchingIndex], params };
  }

  // Try loading the catch-all route
  const catchAllIndex = routes.findIndex(({ path }) => path === '*');
  return (catchAllIndex >= 0)
    ? { route: routes[catchAllIndex], params: {} }
    : null;
}

/**
 * Parse pathname into paths array before recursively matching the paths
 */
function match(routes, pathname) {
  const paths = parsePathname(pathname);
  return matchPaths(routes, paths);
}

export { match };
