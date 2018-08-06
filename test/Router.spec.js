import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';

import { Router, RouterContainer } from '../src/Router';
import routes from './test-utils/routes';

const router = {
  pathname: '/current',
  search: '',
  queries: {},
  hash: '',
};

describe('Router', () => {
  describe('Base component', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <Router routes={routes} router={router} />,
      );
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
        </Provider>,
      );

      expect(wrapper).to.have.lengthOf(1);
    });
  });
});
