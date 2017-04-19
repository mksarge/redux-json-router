const loaderUtils = require('loader-utils');

/**
 * Load chunk asynchronously.
 */
function asyncRequire(page, chunk, shouldChunk) {
  // load in main chunk if explicitly specified, or if chunks option was set to false
  if ((chunk && chunk === 'main') || (!chunk && shouldChunk === false)) {
    return `Promise.resolve(require('${page}').default)`;
  }
  // load in separate chunk if chunk name was not specified, or if is not named "main"
  return `new Promise(function (resolve, reject) {
      try {
        require.ensure(['${page}'], function (require) {
          resolve(require('${page}').default);
        }${typeof chunk === 'string' ? `, '${chunk}'` : ''});
      } catch (err) {
        reject(err);
      }
    })`;
}

/**
 * Transform a route object into JavaScript.
 */
function transform(route, shouldChunk) {
  const output = ['{\n'];
  output.push(`  path: '${route.path}',\n`);
  output.push(`  load: function () {
    return ${asyncRequire(route.page, route.chunk, shouldChunk)};
  },\n`);

  // if children key exists, transform child routes recursively
  if (route.children) {
    output.push('  children: [');
    for (const nestedRoute of route.children) { // eslint-disable-line no-restricted-syntax
      output.push(transform(nestedRoute, shouldChunk));
    }
    output.push(']\n');
  }

  output.push('},\n');
  return output.join('');
}

/**
 * Transforms an array of route objects into JavaScript.
 */
function routeLoader(source) {
  // get options from webpack config
  const options = {
    debug: loaderUtils.getOptions(this).debug || false, // defaults to false;
    chunks: loaderUtils.getOptions(this).chunks !== false, // defaults to true
  };

  // parse JSON
  const routes = JSON.parse(source);

  // stringify transformed JavaScript
  const output = ['['];
  for (const route of routes) { // eslint-disable-line no-restricted-syntax
    output.push(transform(route, options.chunks));
  }
  output.push(']');

  // create the final export value
  const module = `export default ${output.join('')}`;

  // print to console if debug enabled
  if (options.debug) {
    console.log(`\nredux-json-router/route-loader\noptions: ${JSON.stringify(options, null, 2)}\noutput: ${module}`); // eslint-disable-line no-console
  }

  return module;
}

module.exports = routeLoader;
