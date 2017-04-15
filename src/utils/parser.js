/**
 * Parse a search string into an object.
 * Eg. '?key=val&key2=val2' => {'key':'val', 'key2':'val2'}
 */
function parseQueriesFromSearch(search) {
  return search
    .slice(search.indexOf('?') + 1)
    .split('&')
    .reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      acc[key] = value;
      return acc;
    }, {});
}

/**
 * Parse a nested pathname into an array.
 * Eg. '/nested/route/3' => ['nested, 'route', '3']
 */
function parsePathsFromPathname(pathname) {
  return pathname
    .split('/')
    .slice(1);
}

/**
 * Parse a URL resource into an object for storing on the redux state tree.
 */
function parseUrl(url) {
  // separate the hash string
  const [resourceWithoutHash, hash] = url.split('#');

  // separate the search string
  const [pathname, search] = resourceWithoutHash.split('?');

  // split and map search params into an object, if search exists
  const queries = (search) ? parseQueriesFromSearch(search) : {};

  // split and map nested paths into an array
  const paths = (pathname) ? parsePathsFromPathname(pathname) : [];

  return {
    url: url || '/',
    hash: hash || '',
    queries,
    paths,
  };
}

export { parseUrl };
