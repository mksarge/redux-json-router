import { PUSH, REPLACE, MANUAL_CHANGE } from './constants';
import { parseUrl, parsePathsFromPathname, parseQueriesFromSearch } from '../utils/parser';

function getInitialState() {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    paths: [...parsePathsFromPathname(window.location.pathname)],
    queries: { ...parseQueriesFromSearch(window.location.search) },
    previous: {
      pathname: '',
      search: '',
      hash: '',
      paths: [],
      queries: {},
    },
  };
}

const routerReducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case PUSH:
    case REPLACE:
    case MANUAL_CHANGE:
      return {
        ...parseUrl(action.payload),
        previous: {
          pathname: state.pathname,
          search: state.search,
          hash: state.hash,
          paths: state.paths,
          queries: state.queries,
        },
      };
    default:
      return state;
  }
};

export { routerReducer };
