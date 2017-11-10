import React, { Component } from 'react';
import 'normalize.css/normalize.css';
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
    const isLogin = Boolean(getCookie('isLogin'));
    const receiver = getCookie('receiver');
    this.state = {
      isLogin,
      username: getCookie('username'),
      loginModalVisible: !isLogin,
      receiver,
    };
    this.onLogin = this.onLogin.bind(this);
    this.onCancelLogin = this.onCancelLogin.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
  }

  componentDidMount() {
    if (this.state.isLogin) {
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

      if (this.state.receiver) {
        this.onConnect(this.state.receiver);
      }
    });
  }

  onLogin({ username, password }) {
    axios.post('/api/account/login', { username, password })
      .then((response) => {
        setCookie('username', username);
        this.connect();
        this.setState({
          username,
          isLogin: true,
          loginModalVisible: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onCancelLogin() {
    this.setState({
      loginModalVisible: false,
    });
  }

  onConnect(receiver) {
    this.socket.emit('create_relation', { username: receiver });
  }

  onDisconnect() {
    this.socket.emit('delete_relation');
    this.setState({ receiver: undefined });
    removeCookie('receiver');
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
              receiver={receiver}
              onConnect={this.onConnect}
              onDisconnect={this.onDisconnect}
            />
          </div>
          <div className="local">
            <LocalBoard username={username} />
          </div>
          <LoginModal
            visible={loginModalVisible}
            onLogin={this.onLogin}
            onCancel={this.onCancelLogin}
          />
        </div>
      </div>
    );
  }
}

export default App;
