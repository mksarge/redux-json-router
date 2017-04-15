import { expect } from 'chai';
import { routerReducer } from '../../src/redux/reducer';
import { push, replace, manualChange } from '../../src/redux/actions';

const fakeAction = () => ({
  type: 'FAKE',
});

describe('reducer', () => {
  it('initializes correctly', () => {
    const expectedResult = {
      url: '/',
      hash: '',
      queries: {},
      paths: [
        '',
      ],
      previous: {
        url: '',
        hash: '',
        queries: {},
        paths: [],
      },
    };
    const actualResult = routerReducer(undefined, fakeAction);

    expect(actualResult).to.eql(expectedResult);
  });

  it('returns the state on action type mismatch', () => {
    const state = {
      url: '/nested/path?has=query#and-hash',
      hash: 'and-hash',
      queries: {
        has: 'query',
      },
      paths: [
        'nested',
        'path',
      ],
      previous: {
        url: '/previous',
        hash: '',
        queries: {},
        paths: [
          'previous',
        ],
      },
    };
    const actualResult = routerReducer(state, fakeAction);

    expect(actualResult).to.eql(state);
  });

  it('handles the push and manualChange actions correctly', () => {
    const previousState = {
      url: '/previous',
      hash: '',
      queries: {},
      paths: [
        'previous',
      ],
      previous: {
        url: '/',
        hash: '',
        queries: {},
        paths: [
          '',
        ],
      },
    };
    const action1 = push('/nested/path?has=query#and-hash');
    const action2 = manualChange('/nested/path?has=query#and-hash');
    const actualResult1 = routerReducer(previousState, action1);
    const actualResult2 = routerReducer(previousState, action2);
    const expectedResult = {
      url: '/nested/path?has=query#and-hash',
      hash: 'and-hash',
      queries: {
        has: 'query',
      },
      paths: [
        'nested',
        'path',
      ],
      previous: {
        url: '/previous',
        hash: '',
        queries: {},
        paths: [
          'previous',
        ],
      },
    };

    expect(actualResult1).to.eql(expectedResult);
    expect(actualResult2).to.eql(expectedResult);
  });

  it('handles the replace action correctly', () => {
    const previousState = {
      url: '/previous',
      hash: '',
      queries: {},
      paths: [],
      previous: {
        url: '/',
        hash: '',
        queries: {},
        paths: [
          '',
        ],
      },
    };
    const action = replace('/nested/path?has=query#and-hash');
    const actualResult = routerReducer(previousState, action);
    const expectedResult = {
      url: '/nested/path?has=query#and-hash',
      hash: 'and-hash',
      queries: {
        has: 'query',
      },
      paths: [
        'nested',
        'path',
      ],
      previous: {
        url: '/',
        hash: '',
        queries: {},
        paths: [
          '',
        ],
      },
    };

    expect(actualResult).to.eql(expectedResult);
  });
});
