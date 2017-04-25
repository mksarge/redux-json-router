import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { matchRoute } from '../utils/matcher';

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
    this.getNewComponent(routes, router.paths);
  }

  componentWillReceiveProps(nextProps) {
    const { routes, router } = nextProps;
    if (router.url !== this.props.router.url) {
      this.getNewComponent(routes, router.paths);
    }
  }

  getNewComponent(routes, paths) {
    const { route, params } = matchRoute(routes, paths);
    if (route) {
      route.load().then((component) => {
        this.setState({
          params,
          component,
          loaded: true,
        });
      });
    }
  }

  render() {
    const { component: Component, params } = this.state;
    return Component ? <Component params={params} /> : null;
  }

}

Router.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    load: PropTypes.func.isRequired,
    children: PropTypes.array,
  })).isRequired,
  router: PropTypes.shape({
    url: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    queries: PropTypes.object.isRequired,
    paths: PropTypes.array.isRequired,
    previous: PropTypes.shape({
      url: PropTypes.string.isRequired,
      hash: PropTypes.string.isRequired,
      queries: PropTypes.object.isRequired,
      paths: PropTypes.array.isRequired,
    }).isRequired,
  }),
};

const mapStateToProps = ({ router }) => ({ router });

const RouterContainer = connect(mapStateToProps)(Router);

export { Router, RouterContainer };
