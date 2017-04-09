import {
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  LOCATION_CHANGED,
} from './constants';

const initialState = {
  history: [window.location.pathname],
  index: 0,
};

const routerReducer = (state = initialState, action) => {
  switch (action.type) {
    case PUSH:
      return (state.history.length < 15)
        ? {
          history: [...state.history, action.payload],
          index: state.index + 1,
        } : {
          ...state,
          history: [...state.history.slice(1), action.payload],
        };
    case REPLACE:
      return {
        ...state,
        history: [...state.history.slice(0, state.history.length - 1), action.payload],
      };
    case GO:
      return {
        ...state,
        index: Math.min(
          Math.max(
            state.index + action.payload,
            0),
          state.history.length - 1),
      };
    case GO_BACK:
      return {
        ...state,
        index: (state.index > 0)
          ? (state.index - 1)
          : 0,
      };
    case GO_FORWARD:
      return {
        ...state,
        index: (state.index < state.history.length - 1)
          ? (state.index + 1)
          : state.history.length - 1,
      };
    case LOCATION_CHANGED:
      return {
        ...state,
        history: [...state.history.slice(0, state.history.length - 1), action.payload],
      };
    default:
      return state;
  }
};

export { routerReducer };
