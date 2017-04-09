import {
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
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

export {
  push,
  replace,
  go,
  goBack,
  goForward,
};
