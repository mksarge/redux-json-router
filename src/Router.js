import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { match } from './match';

class Router extends React.Component {
  constructor() {
    super();
    this.state = {
      component: null,
      params: {},
    };
    this.getNewComponent = this.getNewComponent.bind(this);
  }

  componentWillMount() {
    const { routes, router } = this.props;
    this.getNewComponent(routes, router.pathname);
  }

  componentWillReceiveProps(nextProps) {
    const { routes, router } = nextProps;
    this.getNewComponent(routes, router.pathname);
  }

  getNewComponent(routes, pathname) {
    const { route, params } = match(routes, pathname);
    if (route) {
      route.load().then((component) => {
        this.setState({ params, component });
      });
    }
  }

  render() {
    const { component: Component, params } = this.state;
    const { queries, hash } = this.props.router;
    return Component ? <Component params={params} queries={queries} hash={hash} /> : null;
  }
}

Router.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    load: PropTypes.func.isRequired,
    children: PropTypes.array,
  })).isRequired,
  router: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    queries: PropTypes.object.isRequired,
    hash: PropTypes.string.isRequired,
  }),
};

const RouterContainer = connect(({ router }) => ({ router }))(Router);

export { Router, RouterContainer };
