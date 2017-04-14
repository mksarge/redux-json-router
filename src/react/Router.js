import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { matchRoute } from '../utils/matchRoute';

const Router = ({ routes, router }) => matchRoute(routes, router);

Router.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    load: PropTypes.func.isRequired,
    children: PropTypes.array,
  })).isRequired,
  router: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    paths: PropTypes.array.isRequired,
    queries: PropTypes.object.isRequired,
    previous: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
      hash: PropTypes.string.isRequired,
      paths: PropTypes.array.isRequired,
      queries: PropTypes.object.isRequired,
    }).isRequired,
  }),
};

const mapStateToProps = ({ router }) => ({ router });
const RouterContainer = connect(mapStateToProps)(Router);

export { RouterContainer };
