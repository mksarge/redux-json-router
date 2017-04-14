import { expect } from 'chai';
import { push, replace, go, goBack, goForward, manualChange } from '../../src/redux/actions';

const testUrl = '/nested/path?has=query#and-hash';

describe('action creators', () => {
  it('push', () => {
    expect(push(testUrl)).to.eql({
      type: '@@ROUTER/PUSH',
      payload: '/nested/path?has=query#and-hash',
    });
  });

  it('replace', () => {
    expect(replace(testUrl)).to.eql({
      type: '@@ROUTER/REPLACE',
      payload: '/nested/path?has=query#and-hash',
    });
  });

  it('go', () => {
    expect(go(-1)).to.eql({
      type: '@@ROUTER/GO',
      payload: -1,
    });

    expect(go(0)).to.eql({
      type: '@@ROUTER/GO',
      payload: 0,
    });

    expect(go(1)).to.eql({
      type: '@@ROUTER/GO',
      payload: 1,
    });
  });

  it('goBack', () => {
    expect(goBack()).to.eql({
      type: '@@ROUTER/GO_BACK',
    });
  });

  it('goForward', () => {
    expect(goForward()).to.eql({
      type: '@@ROUTER/GO_FORWARD',
    });
  });

  it('manualChange', () => {
    expect(manualChange(testUrl)).to.eql({
      type: '@@ROUTER/MANUAL_CHANGE',
      payload: '/nested/path?has=query#and-hash',
    });
  });
});
