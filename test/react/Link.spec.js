import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Link, LinkContainer } from '../../src/react/Link';
import { PUSH, REPLACE } from '../../src/redux/constants';

describe('Link', () => {
  describe('Base component', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <Link to="/" dispatch={() => { }} style={{ color: 'blue' }}>Link text</Link>);
    });

    it('renders without exploding', () => {
      expect(wrapper).to.have.lengthOf(1);
    });

    it('renders child nodes', () => {
      expect(wrapper.contains('Link text')).to.equal(true);
    });

    it('allows us to set props', () => {
      expect(wrapper.props().style).to.eql({ color: 'blue' });
      wrapper.setProps({ style: { color: 'red' } });
      expect(wrapper.props().style).to.eql({ color: 'red' });
    });
  });

  describe('Connected component', () => {
    let sandbox;
    let fakeStore;
    let dispatchSpy;
    const createFakeStore = (state) => ({
      getState: () => ({ ...state }),
      dispatch: () => { },
      subscribe: () => { },
    });

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      fakeStore = createFakeStore({});
      dispatchSpy = sandbox.spy(fakeStore, 'dispatch');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('dispatches push action on click', () => {
      const wrapper = mount(
        <Provider store={fakeStore}>
          <LinkContainer to="/pathname" />
        </Provider>);

      wrapper.find('a').simulate('click');
      expect(dispatchSpy.calledWith({
        type: PUSH,
        payload: '/pathname',
      })).to.equal(true);
    });

    it('dispatches replace action if prop supplied', () => {
      const wrapper = mount(
        <Provider store={fakeStore}>
          <LinkContainer to="/pathname" replace />
        </Provider>);

      wrapper.find('a').simulate('click');
      expect(dispatchSpy.calledWith({
        type: REPLACE,
        payload: '/pathname',
      })).to.equal(true);
    });

    it('executes onClick prop if supplied', () => {
      const onClick = sandbox.spy();
      const wrapper = mount(
        <Provider store={fakeStore}>
          <LinkContainer to="/pathname" onClick={onClick} />
        </Provider>);

      wrapper.find('a').simulate('click');
      expect(onClick.calledOnce).to.equal(true);
      expect(dispatchSpy.calledWith({
        type: PUSH,
        payload: '/pathname',
      })).to.equal(true);
    });
  });
});
