import { manualChange } from '../redux/actions';

/**
 * Dispatch an action to initialize the router state in the store, then create
 * a history listener that updates the state upon an external (popstate) event
 */
function startListener(history, store) {
  // dispatch once on app start
  store.dispatch(manualChange(`${location.pathname}${location.search}${location.hash}`));

  // dispatch on history 'POP' actions
  history.listen((location, action) => {
    if (action === 'POP') {
      store.dispatch(manualChange(`${location.pathname}${location.search}${location.hash}`));
    }
  });
}

export { startListener };
