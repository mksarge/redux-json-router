# Redux JSON Router

[![build status](https://api.travis-ci.org/mksarge/redux-json-router.svg?branch=master)](https://travis-ci.org/mksarge/redux-json-router)
[![npm version](https://img.shields.io/npm/v/redux-json-router.svg?style=flat)](https://www.npmjs.org/package/redux-json-router)

`redux-json-router` is a minimal router intended for use with client-rendered React/Redux applications.

#### Features

- **Declarative routing** — The routing configuration is defined declaratively with JSON, or with plain JavaScript.
- **Redux-first routing** — The URL is just a regular part of Redux state, and can be updated by dispatching actions.
- **Practical handling of browser history** — The URL held in the browser history and Redux store stay in sync behind the scenes, so that the UI can always trust the URL in the store as its source of truth.
- **Code-splitting** — Code-splitting and asynchronous loading of routes is easily enabled with a webpack loader.
- **React bindings** — `<Router/>` for matching/loading/rendering routes, and `<Link/>` for push/replace navigation.

#### Quick Links

- [Motivation](#motivation)
- [Installation](#installation)
- [API](#api)
- [Usage](#usage)
- [Credits](#credits)
- [Contributing](#contributing)
- [License](#license)

## Motivation

#### Background

I know what you're thinking - yet another React/Redux router? [Really?][yarr]

Yes, there are [many existing solutions](#credits) out there already. Of course, you already know [`react-router`][react-router]. But you may have also heard of solutions like [`redux-little-router`][redux-little-router] or [`universal-router`][universal-router].

Every router has its strengths - and, as with any library, choosing a router comes down to finding the one that best suits your needs. Here are some of the categories that similar routers target:

- **Environment**: Browser-only, or universal
- **Libraries**: React-only, Redux (React optional), or other
- **Routing config**: JSX, plain JS, or JSON-based

`redux-json-router` similarly targets a subset of the above categories. It attempts to answer the question: *What is the minimal API needed in a Redux-first router for client-rendered React/Redux applications with a JSON-based routing configuration?*

#### Redux-First Routing

> **Key point:** Like with any other complex/dynamic state, the application view should depend solely on the URL held in the Redux store (a single source of truth).

In modern browsers, the URL state and history are held in [`window.location`][window-location] and [`window.history`][window-history]. We can manipulate the browser history directly using the [history API][history-api], but even better, we can utilize the awesome [`history`][history] module to accomplish this.

Without Redux-first routing, a React/Redux application view may depend on URL state from outside of the store, like this:

```sh
# using react-router:                                  
history → React Router ↘
                        View
                 Redux ↗

# using react-router + react-router-redux:
history → React Router ↘
                   ↕    View
                 Redux ↗
```

With Redux-first routing, a React/Redux application view depends solely on the URL from the Redux store.

```sh
# using redux-json-router:
history
    ↕      
  Redux → View 
```

`redux-json-router` accomplishes Redux-first routing by making the URL a regular part of the state tree, allowing Redux actions to dispatch URL changes, and keeping the store and browser history in sync behind the scenes.

Here's what the URL looks like on the state tree:

```js
// current URL: https://www.website.com/redux/json/router?is=cool#yup
// previous URL: https://www.website.com/previous/route
{
  ..., // other redux state 
  router: {
    url: '/redux/json/router?is=cool#yup',
    hash: 'yup',
    queries: {
      is: 'cool'
    },
    paths: [
      'redux',
      'json',
      'router'
    ],
    previous: {
      url: '/previous/route',
      hash: '',
      queries: {},
      paths: [
        'previous',
        'route'
      ]
    }
  }
}
```

## Installation

```sh
npm install --save redux-json-router
```

## API

`redux-json-router` has a reasonably small API. Here's a look at the exports in [`src/index.js`][index.js]:

```js
// History API
export { createBrowserHistory } from './history/createBrowserHistory';
export { startListener } from './history/startListener';

// Redux API
export { routerMiddleware } from './redux/middleware';
export { routerReducer } from './redux/reducer';
export { push, replace, go, goBack, goForward, manualChange } from './redux/actions';
export { PUSH, REPLACE, GO, GO_BACK, GO_FORWARD, MANUAL_CHANGE } from './redux/constants';

// React API
export { RouterContainer as Router } from './react/Router';
export { LinkContainer as Link } from './react/Link';

/* The webpack loader 'route-loader' is not exported here.
   Import it directly into your webpack config, following the instructions below. */
```

- **History API**
  - [`createBrowserHistory()`][createBrowserHistory.js]
    - creates a history object; exported directly from `history` ([learn more][history-usage])
  - [`startListener(history, store)`][startListener.js]
    - creates a [history listener][listening] to listen for external navigation changes (`popstate` events, eg. browser navigation buttons and address bar) and subsequently dispatch a `manualChange` action
- **Redux API**
  - [`routerMiddleware(history)`][middleware.js]
    - intercepts router actions (`push`, `replace`, `go`, `goBack` and `goForward`) to update the browser history, before continuing/breaking the middleware chain
  - [`routerReducer`][reducer.js]
    - parses and adds the URL to the Redux state
  - [`routerActions`][actions.js]
    - used to dispatch URL updates; middleware intercepts and calls [equivalent `history` navigation actions][history-navigation]
      - **push(href)** — updates the current and previous URL in the Redux state
      - **replace(href)** — updates the current URL, but not the previous URL, in the Redux state
      - **go(index)** — intercepted by `routerMiddleware`; `startListener` subsequently dispatches `manualChange` action
      - **goBack()** — intercepted by `routerMiddleware`; `startListener` subsequently dispatches `manualChange` action
      - **goForward()** — intercepted by `routerMiddleware`; `startListener` subsequently dispatches `manualChange` action
      - **manualChange(href)** — updates the current and previous URL in the Redux state
  - [`routerConstants`][constants.js]
    - public action types for use in user-defined middleware
- **React components**
  - [`<Router/>`][Router.js]
    - matches the current URL with the routing configuration, loads, then renders the page
    - props:
      - **routes** (array) — the routing configuration (see [Routing Configuration](#routing-configuration))
  - [`<Link/>`][Link.js]
    - used for internal navigation (as opposed to `<a/>`, for external navigation)
    - props:
      - **to** (string) — required; the internal URL (pathname + query + hash) to navigate to (eg. `'/about'`, `'/blog?posted=2017'`, `'/blog/post/1#introduction'`)
      - **replace** (boolean) — optional; set to true for the link to dispatch a `replace` action (default: `push`)
      - **onClick** (function) — optional; specify a callback to run on click, before the push/replace action is dispatched
- **Webpack loader (optional)**
  - [`route-loader`][route-loader]
    - translates a `.json` routing configuration file into JavaScript; see [Routing Configuration](#routing-configuration) for acceptable JSON, and [Webpack Configuration](#webpack-configuration-optional) for set-up instructions
    - options:
      - **debug** (boolean) — optional; if `true`, logs the output to the console (default: `false`)
      - **chunks** (boolean) — optional; if `true`, splits routes without a specified `chunk` property into [separate chunks][code-splitting]; if `false`, adds pages without a specified `chunk` into the main code chunk (default: `true`)

## Usage

Let's look at how we'd add `redux-json-router` to a React/Redux application. We'll only make a few changes:

- **Routing config** — We'll define the routes in a `routes.json` or `routes.js` file.
- **Redux config** — We'll add the Redux reducer and middleware to the `store.js` configuration file.
- **App entry point** — We'll add a bit of boilerplate to `index.js` and render the app with `<Router/>`.
- **Webpack config (optional)** — To load `routes.json`, we'll add a custom loader to `webpack.config.js`.

#### Routing Configuration

Declare your routes in a `routes.json` file with an array of "route objects":

```js
// routes.json
[
  {
    "path": "/",  // an exact path
    "page": "./pages/Home",
    "chunk": "main"
  },
  {
    "path": "/docs",
    "page": "./pages/Docs",
    "chunk": "main",
    "children": [
      {
        "path": "/:id",  // a nested and parameterized path
        "page": "./pages/Post"
      }
    ]
  },
  {
    "path": "*",  // a catch-all path
    "page": "./pages/Error"
  }
]
```

Route objects are defined as follows:

```typescript
type RouteObject {
  path: string,             // Required. Specifies the path name (options: exact, param, or catch-all).
  page: string,             // Required. Specifies the React component to be instantiated.
  chunk?: string,           // Optional. Specifies the code chunk to be loaded in (default: separate chunks for all pages).
  children?: [RouteObject]  // Optional. Specifies any nested routes.
}
```

The bundled webpack loader is used to translate `routes.json` into JavaScript that can be read by the `<Router/>` component. Alternatively, you may choose to write the routing config in JavaScript yourself:

```js
// routes.js - equivalent to routes.json above
export default [
  {
    path: '/',
    load: () => Promise.resolve(require('./pages/Home').default), // file loaded in the main code chunk
  },
  {
    path: '/docs',
    load: () => Promise.resolve(require('./pages/Docs').default), // file loaded in the main code chunk
    children: [
      {
        path: '/:id',
        load: () => new Promise((resolve, reject) => {
          try {
            require.ensure(['./pages/Post'], (require) => { // file loaded in a separate code chunk
              resolve(require('./pages/Post').default);
            });
          } catch (err) {
            reject(err);
          }
        }),
      },
    ],
  },
  {
    path: '*',
    load: () => new Promise((resolve, reject) => {
      try {
        require.ensure(['./pages/Error'], (require) => { // file loaded in a separate code chunk
          resolve(require('./pages/Error').default);
        });
      } catch (err) {
        reject(err);
      }
    }),
  },
];
```

#### Redux Configuration

In your Redux config, add `routerReducer` to the root reducer under the `router` key, and add `routerMiddleware` to your Redux middlewares, passing it the history singleton created in the application entry point (as shown in the following section).

```js
// store.js
import { combineReducers, applyMiddleware, compose, createStore } from 'redux';
import { routerReducer, routerMiddleware } from 'redux-json-router';
import { otherReducers, otherMiddlewares } from './other';

// add `routerReducer` to your root reducer
const makeRootReducer = () => combineReducers({
  ...otherReducers,
  router: routerReducer
});

function configureStore(history, initialState = {}) {
  // add `routerMiddleware` to your middlewares, passing it the history singleton from the app's entry point
  const middlewares = [...otherMiddlewares, routerMiddleware(history)];
  
  const enhancers = [applyMiddleware(...middlewares)];
  
  return createStore(makeRootReducer(), initialState, composeEnhancers(...enhancers));
}
```

#### Application Entry Point

In your app's entry point, import the routing config, create the history singleton, create the store with the history singleton, and call `startListener` to initialize the router state in the store and start listening for external actions. Finally, render the application using `<Router/>` inside the Redux `<Provider/>`.

```js
// index.js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory, startListener, Router } from 'redux-json-router';
import configureStore from './store';
import routes from './routes.json'; // webpack-loaded JSON routing config
// import routes from './routes'; // plain JavaScript routing config

// create a history singleton
const history = createBrowserHistory();

// configure store with history
const store = configureStore(history);

// dispatch actions when the history is manually changed (with navigation buttons / address bar)
startListener(history, store);

// render the application with <Router /> to match the current URL to the routing config
render(
  <Provider store={store}>
    <Router routes={routes} />
  </Provider>,
  document.getElementById('app'));
```

#### Webpack Configuration (Optional)

To use the included webpack loader, import `route-loader` directly into your webpack config:

```js
// webpack.config.js
const routes = [path.resolve(__dirname, './app/routes.json')]; // the path to your JSON routing config
const config = {
  ...,
  module: {
    rules: [
      ...,
      {
        test: /\.json$/,
        exclude: routes, // exclude routes.json from being loaded by the usual json-loader
        loader: 'json-loader',
      },
      {
        test: /\.json$/,
        include: routes, // load routes.json with route-loader instead
        loader: 'redux-json-router/lib/route-loader',
        options: {
          // debug (boolean) - defaults to false
          // chunks (boolean) - defaults to true
        },
      },
      ...
```

## Credits

This project was heavily inspired by similar work and research on JavaScript/React/Redux routing including:

- Routers
  - [ReactTraining/react-router][react-router]
  - [FormidableLabs/redux-little-router][redux-little-router]
  - [kriasoft/react-static-boilerplate][rsb]
  - [kriasoft/universal-router][universal-router]
  - [colinmeinke/universal-redux-router][universal-redux-router]
- Articles
  - [You might not need React Router][might-not-need] by Konstantin Tarkus
  - [Let The URL Do The Talking][url-talking] by Tyler Thompson
- Other
  - [ReactTraining/history][history]
  - [reactjs/react-router-redux][react-router-redux]
  
## Contributing

Contributions are welcome and are greatly appreciated!

Feel free to file an issue, start a discussion, or send a pull request.

## License

[MIT][license]

<!--- Browser history stuff --->
[window-location]: <https://developer.mozilla.org/en-US/docs/Web/API/Window/location>
[window-history]: <https://developer.mozilla.org/en-US/docs/Web/API/Window/history>
[history-api]: <https://developer.mozilla.org/en-US/docs/Web/API/History_API>
[history]: <https://github.com/ReactTraining/history>
[history-usage]: <https://github.com/ReactTraining/history#usage>
[history-navigation]: <https://github.com/ReactTraining/history#navigation>
[listening]: <https://github.com/ReactTraining/history#listening>

<!--- Routers --->
[react-router]: <https://github.com/ReactTraining/react-router>
[universal-router]: <https://github.com/kriasoft/universal-router>
[redux-little-router]: <https://github.com/FormidableLabs/redux-little-router>
[universal-redux-router]: <https://github.com/colinmeinke/universal-redux-router>
[react-router-redux]: <https://github.com/reactjs/react-router-redux>
[rsb]: <https://github.com/kriasoft/react-static-boilerplate/blob/master/docs/routing-and-navigation.md>
[yarr]: <https://github.com/nmn/yarr>

<!--- Articles --->
[might-not-need]: <https://medium.freecodecamp.com/you-might-not-need-react-router-38673620f3d>
[url-talking]: <https://formidable.com/blog/2016/07/11/let-the-url-do-the-talking-part-1-the-pain-of-react-router-in-redux/>
[ssot]: <https://twitter.com/dan_abramov/status/727278011591045122>

<!--- Webpack --->
[code-splitting]: <https://webpack.js.org/guides/code-splitting-async/>

<!--- Source files --->
[index.js]: <https://github.com/mksarge/redux-json-router/blob/master/src/index.js>
[createBrowserHistory.js]: <https://github.com/mksarge/redux-json-router/blob/master/src/history/createBrowserHistory.js>
[startListener.js]: <https://github.com/mksarge/redux-json-router/blob/master/src/history/startListener.js>
[middleware.js]: <https://github.com/mksarge/redux-json-router/blob/master/src/redux/middleware.js>
[reducer.js]: <https://github.com/mksarge/redux-json-router/blob/master/src/redux/reducer.js>
[actions.js]: <https://github.com/mksarge/redux-json-router/blob/master/src/redux/actions.js>
[constants.js]: <https://github.com/mksarge/redux-json-router/blob/master/src/redux/constants.js>
[Router.js]: <https://github.com/mksarge/redux-json-router/blob/master/src/react/Router.js>
[Link.js]: <https://github.com/mksarge/redux-json-router/blob/master/src/react/Link.js>
[route-loader]: <https://github.com/mksarge/redux-json-router/blob/master/src/webpack/route-loader.js>
[license]: </blob/master/LICENSE.txt>
