import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import requiredIf from 'react-required-if';
import { push, replace, goBack, goForward } from 'redux-first-routing';

const Link = (props) => {
  const { to, action, onClick, children, dispatch, ...other } = props;

  const handleClick = (event) => {
    // Ignore any click other than a left click
    if ((event.button && event.button !== 0)
      || event.metaKey
      || event.altKey
      || event.ctrlKey
      || event.shiftKey
      || event.defaultPrevented === true) {
      return;
    }

    // Prevent page reload
    event.preventDefault();

    // Execute onClick callback, if it exists
    if (onClick) {
      onClick(event);
    }

    // Dispatch the action specified in the props (default: push action)
    if (action === 'replace') {
      dispatch(replace(to));
    } else if (action === 'back' || action === 'goBack') {
      dispatch(goBack());
    } else if (action === 'forward' || action === 'goForward') {
      dispatch(goForward());
    } else {
      dispatch(push(to));
    }
  };

  return (<a href={to} onClick={handleClick} {...other} >{children}</a>);
};

Link.propTypes = {
  to: requiredIf(PropTypes.string, (props) => !props.action),
  action: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  dispatch: PropTypes.func.isRequired,
};

const LinkContainer = connect()(Link);

export { Link, LinkContainer };
