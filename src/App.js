import React, { Component } from 'react';
import 'normalize.css/normalize.css';
import 'pepjs';
import axios from 'axios';
import io from 'socket.io-client';
import { getCookie, setCookie, removeCookie } from 'tiny-cookie';
import LoginModal from './components/LoginModal';
import RemoteBoard from './components/RemoteBoard';
import LocalBoard from './components/LocalBoard';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const username = getCookie('username');
    const receiver = getCookie('receiver');
    this.state = {
      username,
      receiver,
      loginModalVisible: false,
    };
    this.onShowLoginModal = this.onShowLoginModal.bind(this);
    this.onHideLoginModal = this.onHideLoginModal.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.onPushCommand = this.onPushCommand.bind(this);
  }

  componentDidMount() {
    if (this.state.username) {
      this.connect();
    }
  }

  connect() {
    const socket = io(`/?username=${getCookie('username')}`);
    this.socket = socket;
    socket.on('connect', () => {
      socket.on('connected', (data) => {
        console.log(data);
      });

      socket.on('created_relation', (data) => {
        if (data.success) {
          this.setState({
            receiver: data.to,
          });
          setCookie('receiver', data.to);
        } else {
          alert(data.message);
        }
      });

      socket.on('deleted_relation', (data) => {
        this.setState({ receiver: undefined });
        removeCookie('receiver');
      });

      socket.on('command', (command) => {
        this.remoteBoard.execCommand(command);
      });

      if (this.state.receiver) {
        this.onConnect(this.state.receiver);
      }
    });
  }

  onShowLoginModal() {
    this.setState({
      loginModalVisible: true,
    });
  }

  onHideLoginModal() {
    this.setState({
      loginModalVisible: false,
    });
  }

  onLogin({ username, password }) {
    axios.post('/api/account/login', { username, password })
      .then((response) => {
        this.connect();
        this.setState({
          username,
          loginModalVisible: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onLogout() {
    axios.post('/api/account/logout', { username: this.state.username })
      .then(() => {
        this.setState({
          username: '',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onConnect(receiver) {
    if (!this.state.username) {
      alert('请先登录');
      return;
    }
    this.socket.emit('create_relation', { username: receiver });
  }

  onDisconnect() {
    this.socket.emit('delete_relation');
    this.setState({ receiver: undefined });
    removeCookie('receiver');
  }

  onPushCommand(command) {
    if (this.socket && this.state.receiver) {
      this.socket.emit('command', command);
    }
  }

  render() {
    const {
      username,
      loginModalVisible,
      receiver,
    } = this.state;

    document.title = '画板';

    return (
      <div className="app">
        <div className="main">
          <div className="remote">
            <RemoteBoard
              ref={el => (this.remoteBoard = el)}
              receiver={receiver}
              onConnect={this.onConnect}
              onDisconnect={this.onDisconnect}
            />
          </div>
          <div className="local">
            <LocalBoard
              username={username}
              onShowLoginModal={this.onShowLoginModal}
              onLogout={this.onLogout}
              onPushCommand={this.onPushCommand}
            />
          </div>
          <LoginModal
            visible={loginModalVisible}
            onLogin={this.onLogin}
            onCancel={this.onHideLoginModal}
          />
        </div>
      </div>
    );
  }
}

export default App;
