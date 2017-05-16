import { manualChange } from '../redux/actions';

/**
 * Dispatches a manualChange action once on app start,
 * and whenever a popstate navigation event occurs.
 */
function startListener(history, store) {
  store.dispatch(manualChange(`${history.location.pathname}${history.location.search}${history.location.hash}`));

  history.listen((location, action) => {
    if (action === 'POP') {
      store.dispatch(manualChange(`${location.pathname}${location.search}${location.hash}`));
    }
  });
}

export { startListener };
