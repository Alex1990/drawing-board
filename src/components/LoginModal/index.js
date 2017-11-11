import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import keycode from 'keycode';
import AppModal from '../AppModal';
import './index.css';

class LoginModal extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onLogin: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onOk = this.onOk.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible === false && nextProps.visible === true) {
      this.setState({ username: '', password: '' });
    }
  }

  onUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  onPasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  onInputKeyDown(e) {
    if (keycode('enter') === e.keyCode) {
      this.onOk();
    }
  }

  onOk() {
    const { username, password } = this.state;

    if (!_.trim(username)) {
      alert('请输入用户名');
      return;
    }

    if (!password) {
      alert('请输入密码');
      return;
    }

    this.props.onLogin({
      username: _.trim(username),
      password,
    });
  }

  render() {
    const {
      visible,
      onCancel,
    } = this.props;
    const {
      username,
      password,
    } = this.state;

    return (
      <AppModal
        style={{ width: 400 }}
        visible={visible}
        title="用户登录"
        okText="登录"
        onOk={this.onOk}
        onCancel={onCancel}
      >
        <form className="app-form" action="/">
          <div className="app-form-item">
            <label className="app-form-item-label" htmlFor="username">用户名：</label>
            <div className="app-form-item-control-wrapper">
              <input
                type="text"
                id="username"
                className="app-form-item-control"
                value={username}
                placeholder="请输入用户名"
                onKeyDown={this.onInputKeyDown}
                onChange={this.onUsernameChange}
              />
            </div>
          </div>
          <div className="app-form-item">
            <label className="app-form-item-label"  htmlFor="password">密码：</label>
            <div className="app-form-item-control-wrapper">
              <input
                type="password"
                className="app-form-item-control"
                value={password}
                placeholder="请输入密码"
                onKeyDown={this.onInputKeyDown}
                onChange={this.onPasswordChange}
              />
            </div>
          </div>
        </form>
      </AppModal>
    );
  }
}

export default LoginModal;
