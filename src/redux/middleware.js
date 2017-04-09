import {
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  LOCATION_CHANGED,
} from './constants';

// eslint-disable-next-line consistent-return
const routerMiddleware = (history) => () => (next) => (action) => {
  switch (action.type) {
    case PUSH:
      history.push(action.payload);
      return next(action);
    case REPLACE:
      history.replace(action.payload);
      return next(action);
    case GO:
      history.go(action.payload);
      return next(action);
    case GO_BACK:
      history.goBack();
      return next(action);
    case GO_FORWARD:
      history.goForward();
      return next(action);
    case LOCATION_CHANGED:
      return next(action);
    default:
      return next(action);
  }
};

export { routerMiddleware };
