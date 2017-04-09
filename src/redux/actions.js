import {
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  LOCATION_CHANGED,
} from './constants';

const push = (href) => ({
  type: PUSH,
  payload: href,
});

const replace = (href) => ({
  type: REPLACE,
  payload: href,
});

const go = (index) => ({
  type: GO,
  payload: index,
});

const goBack = () => ({
  type: GO_BACK,
});

const goForward = () => ({
  type: GO_FORWARD,
});

const locationChanged = (href) => ({
  type: LOCATION_CHANGED,
  payload: href,
});

export {
  push,
  replace,
  go,
  goBack,
  goForward,
  locationChanged,
};
