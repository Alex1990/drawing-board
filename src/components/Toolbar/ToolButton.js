import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import AppIcon from '../AppIcon';
import './ToolButton.css';

class ToolButton extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    activated: PropTypes.bool,
    onActive: PropTypes.func,
  };

  static defaultProps = {
    activated: false,
    onActive: _.noop,
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (!this.props.activated) {
      this.props.onActive(this.props.icon);
    }
  }

  render() {
    const { className, icon, activated } = this.props;
    const cls = classNames('tool-btn', {
      'tool-btn-activated': activated,
    }, className);
    const ownProps = _.omit(this.props, [
      'className',
      'icon',
      'activated',
      'onActive',
    ]);

    return (
      <button
        {...ownProps}
        className={cls}
        onClick={this.onClick}
      >
        <AppIcon type={icon} />
      </button>
    );
  }
}

export default ToolButton;
