import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import keycode from 'keycode';
import execCommand from '../LocalBoard/execCommand';
import AppButton from '../AppButton';
import './index.css';

class RemoteBoard extends Component {
  static propTypes = {
    receiver: PropTypes.string,
  };

  static defaultProps = {
    receiver: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      width: undefined,
      height: undefined,
      username: '',
    };
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.execCommand = this.execCommand.bind(this);
  }

  componentDidMount() {
    const wrapper = this.wrapper;
    const { width, top } = wrapper.getBoundingClientRect();
    const winHeight = window.innerHeight;
    const height = winHeight - top - 16;
    this.setState({
      width: Math.floor(width),
      height: Math.floor(height),
    });
  }

  onUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  onInputKeyDown(e) {
    if (keycode('enter') === e.keyCode) {
      this.onConnect();
    }
  }

  onConnect() {
    const { username } = this.state;

    if (!_.trim(username)) {
      alert('请输入对方用户名');
      return;
    }

    this.setState({ username: '' });
    this.props.onConnect(username);
  }

  onDisconnect() {
    this.props.onDisconnect();
  }

  execCommand(command) {
    const ctx = this.canvas.getContext('2d');
    execCommand(ctx, command);
  }

  render() {
    const { receiver } = this.props;
    const { width, height, username } = this.state;

    return (
      <div
        className="remote-board"
      >
        <div className="title">
          <h2>{receiver ? receiver : '对方'}的画板</h2>
          {receiver ?
            <AppButton
              className="disconnect-button"
              style={{ marginLeft: 16 }}
              type="primary"
              onClick={this.onDisconnect}
            >
              断开连接
            </AppButton> :
            <div>
              <input
                className="receiver-input"
                type="text"
                value={username}
                placeholder="请输入对方用户名"
                onKeyDown={this.onInputKeyDown}
                onChange={this.onUsernameChange}
              />
              <AppButton
                style={{ marginLeft: 16 }}
                type="primary"
                onClick={this.onConnect}
              >
                连接
              </AppButton>
            </div>
          }
        </div>
        <div className="board-main">
          <div
            className="drawing-canvas"
            ref={el => (this.wrapper = el)}
          >
            <canvas
              ref={el => (this.canvas = el)}
              width={width}
              height={height}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default RemoteBoard;
