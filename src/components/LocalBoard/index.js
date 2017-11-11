import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AppButton from '../AppButton';
import Toolbar from '../Toolbar';
import DrawingCanvas from './DrawingCanvas';
import './index.css';

const defaultTools = [
  {
    type: 'brush',
    title: '画笔',
    shortcut: 'b',
    size: 1,
  },
  {
    type: 'eraser',
    title: '橡皮擦',
    shortcut: 'e',
    size: 50,
  },
];
const getActiveTool = (tools, type) => {
  return _.find(tools, tool => tool.type === type);
};

class LocalBoard extends Component {
  static propTypes = {
    username: PropTypes.string,
    onShowLoginModal: PropTypes.func,
    onLogout: PropTypes.func,
    onPushCommand: PropTypes.func,
  };

  static defaultProps = {
    username: '',
    onShowLoginModal: _.noop,
    onLogout: _.noop,
    onPushCommand: _.noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      tools: _.map(defaultTools, tool => ({ ...tool })),
      activeToolType: 'brush',
      coordinate: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    };
    this.onToolChange = this.onToolChange.bind(this);
    this.onToolSizeChange = this.onToolSizeChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      coordinate: {
        x: Math.floor(window.screenX + window.innerWidth / 2),
        y: Math.floor(window.screenY + window.outerHeight - window.innerHeight),
        width: Math.floor(window.innerWidth / 2),
        height: Math.floor(window.innerHeight),
      },
    });
  }

  onToolChange(type) {
    this.setState({ activeToolType: type });
  }

  onToolSizeChange(size) {
    const { tools, activeToolType } = this.state;
    this.setState({
      tools: _.map(tools, tool => {
        if (tool.type === activeToolType) {
          return {
            ...tool,
            size,
          };
        }
        return { ...tool };
      }),
    });
  }

  render() {
    const {
      username,
      onShowLoginModal,
      onLogout,
      onPushCommand,
    } = this.props;
    const {
      activeToolType,
      coordinate,
      tools,
    } = this.state;
    const activeTool = getActiveTool(tools, activeToolType);

    return (
      <div
        className="local-board"
      >
        <div className="title">
          <h2>{username ? username : '我'}的画板</h2>
          <div style={{ marginLeft: 32 }}>
            {username ?
              <AppButton
                type="primary"
                onClick={onLogout}
              >
                退出
              </AppButton> :
              <AppButton
                type="primary"
                onClick={onShowLoginModal}
              >
                登录
              </AppButton>
            }
          </div>
        </div>
        <div className="board-main">
          <Toolbar
            tools={tools}
            activeTool={activeTool}
            onToolChange={this.onToolChange}
            onToolSizeChange={this.onToolSizeChange}
          />
          <DrawingCanvas
            activeTool={activeTool}
            onPushCommand={onPushCommand}
          />
        </div>
      </div>
    );
  }
}

export default LocalBoard;
