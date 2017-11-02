import React, { Component } from 'react';
import 'normalize.css/normalize.css';
import Toolbar from './components/Toolbar';
import RemoteBoard from './components/RemoteBoard';
import LocalBoard from './components/LocalBoard';
import './App.css';

class App extends Component {
  render() {
    document.title = '画板';

    return (
      <div className="app">
        <div className="main">
          <div className="remote">
            <h2>对方画板</h2>
            <RemoteBoard />
          </div>
          <div className="local">
            <LocalBoard />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
