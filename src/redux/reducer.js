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
