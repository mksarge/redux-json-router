import { expect } from 'chai';
import sinon from 'sinon';
import { routerMiddleware } from '../../src/redux/middleware';

let sandbox;
let history;
let nextHandler;
let actionHandler;
const expected = 'next';
const actions = [
  {
    action: 'push',
    type: 'PUSH',
    returnVal: 'next',
  },
  {
    action: 'replace',
    type: 'REPLACE',
    returnVal: 'next',
  },
  {
    action: 'go',
    type: 'GO',
    returnVal: undefined,
  },
  {
    action: 'goBack',
    type: 'GO_BACK',
    returnVal: undefined,
  },
  {
    action: 'goForward',
    type: 'GO_FORWARD',
    returnVal: undefined,
  },
];

describe('middleware', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    history = {
      push: sandbox.stub(),
      replace: sandbox.stub(),
      go: sandbox.stub(),
      goBack: sandbox.stub(),
      goForward: sandbox.stub(),
      listen: sandbox.stub(),
    };
    nextHandler = routerMiddleware(history)();
    actionHandler = nextHandler(() => expected);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns a function to handle next', () => {
    expect(typeof nextHandler).to.equal('function');
    expect(nextHandler.length).to.equal(1);
  });

  it('returns a function to handle an action', () => {
    expect(typeof actionHandler).to.equal('function');
    expect(actionHandler.length).to.equal(1);
  });

  actions.forEach((currentAction) => {
    const { action, type, returnVal } = currentAction;
    it(`${type} calls history.${action} only, and ${returnVal ? 'returns next' : 'breaks chain'}`, () => {
      const outcome = actionHandler({ type: `@@ROUTER/${type}` });
      expect(outcome).to.eql(returnVal);

      Object.keys(history).forEach((property) => {
        expect(history[property].calledOnce).to.equal((property === action));
      });
    });
  });

  it('MANUAL_CHANGE returns next', () => {
    const action = { type: '@@ROUTER/MANUAL_CHANGE' };
    const outcome = actionHandler(action);

    expect(outcome).to.eql(expected);
  });

  it('returns next for other action types', () => {
    const action = { type: 'OTHER' };
    const outcome = actionHandler(action);

    expect(outcome).to.eql(expected);
  });
});
