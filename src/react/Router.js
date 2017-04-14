import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { matchRoute } from '../utils/matcher';

class Router extends React.Component {
  constructor() {
    super();
    this.state = {
      component: null,
      params: {},
      loaded: false,
    };
  }

  componentWillMount() {
    const { routes, router } = this.props;
    const { route, params } = matchRoute(routes, router.paths);
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

  componentWillReceiveProps(nextProps) {
    const { routes, router } = nextProps;
    if (router.url !== this.props.router.url) {
      const { route, params } = matchRoute(routes, router.paths);
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
  }

  render() {
    const Component = this.state.component;
    const params = this.state.params;
    return this.state.loaded ? <Component params={params} /> : null;
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

export { RouterContainer };
