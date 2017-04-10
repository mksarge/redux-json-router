import { expect } from 'chai';
import {
  parseQueriesFromSearch,
  parsePathsFromPathname,
  parseUrl,
} from '../../src/helpers/parseUrl';

describe('parseQueriesFromSearch', () => {
  it('parses a search string correctly', () => {
    const search = '?key=val&1=2';
    const expectedResult = {
      key: 'val',
      1: '2',
    };
    const actualResult = parseQueriesFromSearch(search);
    expect(actualResult).to.eql(expectedResult);
  });
});

describe('parsePathsFromPathname', () => {
  it('parses a pathname correctly', () => {
    const pathname = '/nested/route/1';
    const expectedResult = [
      'nested',
      'route',
      '1',
    ];
    const actualResult = parsePathsFromPathname(pathname);
    expect(actualResult).to.eql(expectedResult);
  });
});

describe('parseUrl', () => {
  it('parses a url resource correctly', () => {
    const resource = '/nested/route?query=string#hash';
    const expectedResult = {
      pathname: '/nested/route',
      search: '?query=string',
      hash: '#hash',
      paths: [
        'nested',
        'route',
      ],
      queries: {
        query: 'string',
      },
    };
    const actualResult = parseUrl(resource);
    expect(actualResult).to.eql(expectedResult);
  });
});
