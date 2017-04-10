// History API
export { createBrowserHistory } from './helpers/createBrowserHistory';

// Redux API
export { routerReducer } from './redux/reducer';
export { routerMiddleware } from './redux/middleware';

// React API
export { RouterContainer as Router } from './react/Router';
export { LinkContainer as Link } from './react/Link';

// Public action types
export {
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  LOCATION_CHANGED,
} from './redux/constants';

// Public action creators
export {
  push,
  replace,
  go,
  goBack,
  goForward,
  locationChanged,
} from './redux/actions';
