import { PUSH, REPLACE, GO, GO_BACK, GO_FORWARD } from './constants';

/**
 * The router middleware intercepts the above actions types to update the browser history
 * before updating the state.
 *
 * For PUSH and REPLACE actions, the new location is contained in the action payload, so the
 * middleware chain continues as usual.
 *
 * For GO, GO_BACK, and GO_FORWARD actions, the new location isn't known yet - so the browser
 * history is updated and the listener in '../history/startListener' dispatches a second action,
 * MANUAL_CHANGE, that contains the new location and is handled by the reducer.
 */
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
      break;
    case GO_BACK:
      history.goBack();
      break;
    case GO_FORWARD:
      history.goForward();
      break;
    default:
      return next(action);
  }
};

export { routerMiddleware };
