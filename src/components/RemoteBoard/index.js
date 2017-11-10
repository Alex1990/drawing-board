import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
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

  componentWillUnmout() {
  }

  onUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  onConnect() {
    const { username } = this.state;
    if (username) {
      this.props.onConnect(username);
    }
  }

  onDisconnect() {
    this.props.onDisconnect();
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
