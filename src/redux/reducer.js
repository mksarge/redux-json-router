import { PUSH, REPLACE, MANUAL_CHANGE } from './constants';
import { parseUrl } from '../utils/parser';

const getInitialState = {
  url: '/',
  hash: '',
  queries: {},
  paths: [
    '',
  ],
  previous: {
    url: '',
    hash: '',
    queries: {},
    paths: [],
  },
};

/**
 * The router reducer intercepts the above actions types to update the browser history before
 * updating the state.
 *
 * For PUSH and MANUAL_CHANGE, the current state (bar 'previous') is moved into 'previous', and
 * the new URL resource (eg. '/nested/path?with=query#and-hash') is parsed into separate properties
 * for easy access from the Redux state.
 *
 * For REPLACE, the new URL resource replaces the current one, but the 'previous' property is
 * left unchanged.
 */
const routerReducer = (state = getInitialState, action) => {
  switch (action.type) {
    case PUSH:
    case MANUAL_CHANGE:
      return {
        ...parseUrl(action.payload),
        previous: {
          url: state.url,
          hash: state.hash,
          queries: state.queries,
          paths: state.paths,
        },
      };
    case REPLACE:
      return {
        ...parseUrl(action.payload),
        previous: {
          ...state.previous,
        },
      };
    default:
      return state;
  }
};

export { routerReducer };
