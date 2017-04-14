import { PUSH, REPLACE, GO, GO_BACK, GO_FORWARD } from './constants';

// eslint-disable-next-line consistent-return
const routerMiddleware = (history) => () => (next) => (action) => {
  switch (action.type) {
    /* Update the browser history with the new URL resource, then add it to the redux store. */
    case PUSH:
      history.push(action.payload);
      return next(action);
    case REPLACE:
      history.replace(action.payload);
      return next(action);

    /**
     * Update the browser history with the appropriate action, but break the middleware
     * chain, because we don't know the new URL resource yet. Instead, let the history
     * listener dispatch a MANUAL_CHANGE action that will update the redux state appropriately.
     */
    case GO:
      history.go(action.payload);
      break;
    case GO_BACK:
      history.goBack();
      break;
    case GO_FORWARD:
      history.goForward();
      break;

    // continue middleware chain
    default:
      return next(action);
  }
};

export { routerMiddleware };
