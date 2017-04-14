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
