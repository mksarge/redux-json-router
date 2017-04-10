const stripBasePath = (url) => url.split('/').slice(1);

function findAndLoad(routes, pathsArray) {
  let matchVar;
  let matchExact;

  const index = routes.findIndex((obj) => {
    matchVar = /^\/:/.test(obj.path);
    matchExact = obj.path === `/${pathsArray[0]}`;
    return matchVar || matchExact;
  });

  if (index >= 0) {
    if (pathsArray[1] && routes[index].children) {
      const next = findAndLoad(routes[index].children, pathsArray.slice(1));
      if (next) {
        return next;
      }
    }
    return routes[index].load(pathsArray[0]);
  } else {
    const errIndex = routes.findIndex((obj) => obj.path === '*');
    return (errIndex >= 0)
      ? routes[errIndex].load(pathsArray[0])
      : null;
  }
}

const loadRoute = (routes, url) => {
  const paths = stripBasePath(url);
  return findAndLoad(routes, paths);
};

export { loadRoute };

/*
pathname: window.location.pathname,
href: window.location.href,
search: window.location.search,
hash: window.location.hash,
origin: window.location.origin,
host: window.location.host,
*/
