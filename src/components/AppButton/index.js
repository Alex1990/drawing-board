import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import './index.css';

class AppButton extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['primary', 'secondary']),
    disabled: PropTypes.bool,
    children: PropTypes.node,
  };

  static defaultProps = {
    type: 'secondary',
    disabled: false,
    children: null,
  };

  render() {
    const { className, type, disabled, children } = this.props;
    const cls = classNames('app-btn', {
      [`app-btn-${type}`]: 1,
      'app-btn-disabled': disabled,
    }, className);
    const ownProps = _.omit(this.props, [
      'className',
      'type',
      'children',
    ]);

    return (
      <button
        {...ownProps}
        className={cls}
      >
        {children}
      </button>
    );
  }
}

export default AppButton;
