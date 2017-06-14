import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { PUSH, REPLACE, GO_BACK, GO_FORWARD } from 'redux-first-routing';
import { Link, LinkContainer } from '../src/Link';

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

    it('dispatches push action', () => {
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

    it('dispatches replace action if specified by the action prop', () => {
      const wrapper = mount(
        <Provider store={fakeStore}>
          <LinkContainer to="/pathname" action="replace" />
        </Provider>);

      wrapper.find('a').simulate('click');
      expect(dispatchSpy.calledWith({
        type: REPLACE,
        payload: '/pathname',
      })).to.equal(true);
    });

    it('dispatches goBack action if specified by the action prop', () => {
      const wrapper = mount(
        <Provider store={fakeStore}>
          <LinkContainer to="/pathname" action="goBack" />
        </Provider>);

      wrapper.find('a').simulate('click');
      expect(dispatchSpy.calledWith({
        type: GO_BACK,
      })).to.equal(true);
    });

    it('dispatches goForward action if specified by the action prop', () => {
      const wrapper = mount(
        <Provider store={fakeStore}>
          <LinkContainer to="/pathname" action="goForward" />
        </Provider>);

      wrapper.find('a').simulate('click');
      expect(dispatchSpy.calledWith({
        type: GO_FORWARD,
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
