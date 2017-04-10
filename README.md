# redux-json-router

[![Build Status](https://api.travis-ci.org/mksarge/redux-json-router.svg?branch=master)](https://travis-ci.org/mksarge/redux-json-router)

`redux-json-router` is a small React-Redux router for browser applications, with a simple, JSON-defined routing configuration.

## Motivation

[under construction]

## Install

```sh
# requires node >= 4
npm install redux-json-router
```

## API

#### Overview

`redux-json-router` only has a few exports. From `src/index.js`:

```js
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
  MANUAL_CHANGE,
} from './redux/constants';

// Public action creators
export {
  push,
  replace,
  go,
  goBack,
  goForward,
  manualChange,
} from './redux/actions';
```

#### History API

**createBrowserHistory**:

#### Redux API

**routerReducer**:

**routerMiddleware**:

#### React API

**Router**:

**Link**:

#### Public action types and creators

**push**:

**replace**:

**go**:

**goBack**:

**goForward**:

**manualChange**:

## Usage

#### Routing configuration

Declare your routes in a `.json` or `.js` file with a JSON array of route objects:

```typescript
type RouteObject {
	path: string,
    component: string,
    children?: [RouteObject]
}
```

Example config:

```js
// routes.json
[
  {
    "path": "/",
    "component": "./pages/HomePage"
  },
  {
    "path": "/posts",
    "component": "./pages/BlogPage",
    "children": [
      {
        "path": "/:id",
        "component": "./pages/Post"
      }
    ]
  },
  {
    "path": "*",
    "component": "./pages/ErrorPage"
  }
]

// or, in routes.js
const routes = [
  {
    "path": "/",
    "component": "./pages/HomePage"
  },
  ...
];
export default routes;
```

Renders:

```
<HomePage />               at www.website.com/
<BlogPage />               at www.website.com/blog
<Post id={'post-name'} />  at www.website.com/blog/post-name
<ErrorPage />              at www.website.com/other
```

#### Root reducer

Import `routerReducer` and add it to your root reducer:

```js
// reducer.js
import { combineReducers } from 'redux';
import { routerReducer } from 'redux-json-router';
import { * as yourReducers } from './yourReducers';

const makeRootReducer = () => combineReducers({
  ...yourReducers,
  router: routerReducer,
});

export default makeRootReducer;
```

#### Redux store

Import and add `routerMiddleware` to your redux store config, passing it the history singleton created in the app's entry point.

```js
// store.js
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'redux-json-router';
import makeRootReducer from './reducer';

function configureStore(history, initialState = {}) {
  const middlewares = [
    routerMiddleware(history),
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(...enhancers),
  );
}
```

#### Entry point

In the entry point of your application:

- create a the history singleton
- create the redux store with the history singleton passed in, so the router middleware can access it
- create a history listener to intercept manual actions like the click of the browser's back/forward buttons and the manual entering of a URL in the address bar
- use the `Router` component at any point in the React hierarchy, as long as it's inside the Redux `Provider`.

```js
// index.js
import { createBrowserHistory, manualChange, Router } from 'redux-json-router';
import configureStore from './store';
import routes from './routes.json';

// create history singleton
const history = createBrowserHistory();

// configure store with history and default initialState
const store = configureStore(history);

// dispatch redux actions upon manual manipulation of the browser history
// eg. browser back/forward buttons, or entering a URL on the address bar
history.listen((location, action) => {
  if (action === 'POP') {
    const url = `${location.pathname}${location.search}${location.hash}`;
    store.dispatch(manualChange(url));
  }
});

// create a <Router/> component inside the <Provider/>, passing it the routing config object
render(
  <Provider store={store}>
    <Router routes={routes} />
  </Provider>,
  document.getElementById('app'));
```

## License

[MIT license][license]

[license]: </blob/master/LICENSE.txt>
