import { expect } from 'chai';
import { match } from '../src/match';
import routes from './test-utils/routes';

describe('matchRoute', () => {
  it('matches an exact pathname', () => {
    const { route, params } = match(routes, '/');
    expect(route.path).to.equal('/');
    expect(params).to.eql({});
  });

  it('matches a nested pathname', () => {
    const { route, params } = match(routes, '/about/project');
    expect(route.path).to.equal('/project');
    expect(params).to.eql({});
  });

  it('matches a parameterized pathname', () => {
    const { route, params } = match(routes, '/blog/post-1');
    expect(route.path).to.equal('/:id');
    expect(params).to.eql({ id: 'post-1' });
  });

  it('matches a catch-all pathname', () => {
    const { route, params } = match(routes, 'badpath');
    expect(route.path).to.equal('*');
    expect(params).to.eql({});
  });

  it('falls back to the previous pathname if no match', () => {
    const { route, params } = match(routes, '/about/team');
    expect(route.path).to.equal('/about');
    expect(params).to.eql({});
  });
});
