import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import AppButton from '../AppButton';
import './index.css';

class AppModal extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    visible: PropTypes.bool,
    title: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    children: PropTypes.node,
  };

  static defaultProps = {
    className: '',
    style: {},
    visible: false,
    title: '',
    okText: '确定',
    cancelText: '取消',
    onOk: _.noop,
    onCancel: _.noop,
    children: null,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    if (this.props.visible) {
      this.renderOverlay();
      this.renderModal(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible === true && nextProps.visible === false) {
      this.removeOverlay();
    } else if (nextProps.visible) {
      this.renderOverlay();
      this.renderModal(nextProps);
    }
  }

  componentWillUnmount() {
    this.removeOverlay();
  }

  renderOverlay() {
    if (!this.overlay) {
      const overlay = document.createElement('div');
      overlay.className = 'app-overlay';
      this.overlay = overlay;
      document.body.appendChild(this.overlay);
    }
  }

  renderModal(props) {
    const {
      className,
      style,
      title,
      okText,
      cancelText,
      onOk,
      onCancel,
      children,
    } = props;

    const footer = (
      <div className="app-modal-footer">
        <AppButton
          type="secondary"
          onClick={onCancel}
        >
          {cancelText}
        </AppButton>
        <AppButton
          type="primary"
          onClick={onOk}
        >
          {okText}
        </AppButton>
      </div>
    );
    const cls = classNames('app-modal', className);
    const modal = (
      <div className={cls} style={style}>
        <div className="app-modal-header">
          <h3>{title}</h3>
        </div>
        <div className="app-modal-body">
          {children}
        </div>
        {footer}
      </div>
    );

    ReactDOM.render(modal, this.overlay);
  }

  removeOverlay() {
    document.body.removeChild(this.overlay);
    this.overlay = null;
  }

  render() {
    return false;
  }
}

export default AppModal;
