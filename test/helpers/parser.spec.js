import { expect } from 'chai';
import { parseUrl } from '../../src/utils/parser';

describe('parser', () => {
  it('parses a URL correctly', () => {
    const url = '/nested/route?query=string#hash';
    const actualResult = parseUrl(url);
    const expectedResult = {
      url: '/nested/route?query=string#hash',
      hash: 'hash',
      queries: {
        query: 'string',
      },
      paths: [
        'nested',
        'route',
      ],
    };

    expect(actualResult).to.eql(expectedResult);
  });
});
