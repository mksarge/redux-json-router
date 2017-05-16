import { manualChange } from '../redux/actions';

/**
 * Dispatches a manualChange action once on app start,
 * and whenever a popstate navigation event occurs.
 */
function startListener(history, store) {
  store.dispatch(manualChange(history.location.path));

  history.listen((location, action) => {
    if (action === 'POP') {
      store.dispatch(manualChange(location.path));
    }
  });
}

export { startListener };
