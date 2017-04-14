import { PUSH, REPLACE, MANUAL_CHANGE } from './constants';
import { parseUrl, parsePathsFromPathname, parseQueriesFromSearch } from '../utils/parser';

function getInitialState() {
  return {
    url: `${location.pathname}${location.search}${location.hash}`,
    hash: window.location.hash,
    paths: [...parsePathsFromPathname(window.location.pathname)],
    queries: { ...parseQueriesFromSearch(window.location.search) },
    previous: {
      url: '',
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
          url: state.url,
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
