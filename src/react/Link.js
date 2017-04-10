import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from '../redux/actions';

// TODO: Link should have an option to scroll to the top, and should by default scroll to a #hash
class Link extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (event.button !== 0
      || event.metaKey
      || event.altKey
      || event.ctrlKey
      || event.shiftKey
      || event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();
    this.props.dispatch(push(this.props.to));
  }

  render() {
    const { to, children, dispatch, ...rest } = this.props;
    return (
      <a href={to} onClick={this.handleClick} {...rest} >{children}</a>
    );
  }
}

Link.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node,
  dispatch: PropTypes.func,
};

const LinkContainer = connect()(Link);

export { LinkContainer };
