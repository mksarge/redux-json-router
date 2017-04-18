import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push as pushAction, replace as replaceAction } from '../redux/actions';

const Link = (props) => {
  const { to, onClick, children, dispatch, replace, ...other } = props;

  const handleClick = (event) => {
    // ignore click
    if ((event.button && event.button !== 0)
      || event.metaKey
      || event.altKey
      || event.ctrlKey
      || event.shiftKey
      || event.defaultPrevented === true) {
      return;
    }

    // prevent default link behaviour
    event.preventDefault();

    // if onClick prop exists, execute it
    if (onClick) {
      onClick(event);
    }

    if (replace) {
      // if replace prop exists, dispatch replace action
      dispatch(replaceAction(to));
    } else {
      // else, dispatch push action
      dispatch(pushAction(to));
    }
  };

  return (<a href={to} onClick={handleClick} {...other} >{children}</a>);
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node,
  replace: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
};

const LinkContainer = connect()(Link);

export { Link, LinkContainer };
