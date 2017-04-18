import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { Router, RouterContainer } from '../../src/react/Router';
import routes from '../test-utils/routes';

const router = {
  url: '/current',
  hash: '',
  queries: {},
  paths: [
    'current',
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

describe('Router base component', () => {
  describe('Base component', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <Router routes={routes} router={router} />);
    });

    it('renders without exploding', () => {
      expect(wrapper).to.have.lengthOf(1);
    });
  });

  describe('Connected component', () => {
    let fakeStore;
    const createFakeStore = (state) => ({
      getState: () => ({ ...state }),
      dispatch: () => { },
      subscribe: () => { },
    });

    beforeEach(() => {
      fakeStore = createFakeStore({ router });
    });

    it('renders without exploding', () => {
      const wrapper = mount(
        <Provider store={fakeStore}>
          <RouterContainer routes={routes} />
        </Provider>);

      expect(wrapper).to.have.lengthOf(1);
    });
  });
});
