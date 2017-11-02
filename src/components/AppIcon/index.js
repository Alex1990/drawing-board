import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';

class AppIcon extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
  };

  render() {
    const { type } = this.props;

    return <i className={`app-icon app-icon-${type}`} />;
  }
}

export default AppIcon;
