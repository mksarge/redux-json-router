// Parse a nested pathname into an array.
// Eg. '/nested/route/3' => ['nested, 'route', '3']
function parsePathsFromPathname(pathname) {
  return pathname
    .split('/')
    .slice(1);
}

// Parse a search string into an object.
// Eg. '?key=val&key2=val2' => {'key':'val', 'key2':'val2'}
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

function parseUrl(url) {
  // separate hash string
  const [urlWithoutHash, hash] = url.split('#');

  // separate search string
  const [pathname, search] = urlWithoutHash.split('?');

  // split and map search params into an object, if search exists
  const queries = (search) ? parseQueriesFromSearch(search) : {};

  // split and map nested paths into an array
  const paths = (pathname) ? parsePathsFromPathname(pathname) : [];

  return {
    pathname: pathname || '/',
    search: search || '',
    hash: (hash && `#${hash}`) || '',
    paths,
    queries,
  };
}

export { parseUrl, parsePathsFromPathname, parseQueriesFromSearch };
