import { expect } from 'chai';
import { matchRoute } from '../../src/utils/matcher';
import routes from '../test-utils/routes';

describe('matchRoute', () => {
  it('matches an exact path', () => {
    const path = [''];
    const { route, params } = matchRoute(routes, path);

    expect(route.path).to.equal('/');
    expect(params).to.eql({});
  });

  it('matches a nested path', () => {
    const path = ['about', 'project'];
    const { route, params } = matchRoute(routes, path);

    expect(route.path).to.equal('/project');
    expect(params).to.eql({});
  });

  it('matches a parameterized path', () => {
    const path = ['blog', 'post-1'];
    const { route, params } = matchRoute(routes, path);

    expect(route.path).to.equal('/:id');
    expect(params).to.eql({ id: 'post-1' });
  });

  it('matches a catch-all path', () => {
    const path = ['other'];
    const { route, params } = matchRoute(routes, path);

    expect(route.path).to.equal('*');
    expect(params).to.eql({});
  });

  it('falls back to the previous path if no match', () => {
    const path = ['about', 'team'];
    const { route, params } = matchRoute(routes, path);

    expect(route.path).to.equal('/about');
    expect(params).to.eql({});
  });
});
