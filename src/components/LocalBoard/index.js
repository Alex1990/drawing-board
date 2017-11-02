import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Toolbar from '../Toolbar';
import DrawingCanvas from './DrawingCanvas';
import './index.css';

const defaultTools = [
  {
    type: 'pencil',
    title: '铅笔',
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
  constructor(props) {
    super(props);
    this.state = {
      tools: _.map(defaultTools, tool => ({ ...tool })),
      activeToolType: 'pencil',
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
        x: Math.floor(window.screenLeft + window.innerWidth / 2),
        y: Math.floor(window.screenTop + window.outerHeight - window.innerHeight),
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
    const { activeToolType, coordinate, tools } = this.state;
    const activeTool = getActiveTool(tools, activeToolType);

    return (
      <div
        className="local-board"
      >
        <div className="title">
          <h2>我的画板</h2>
          <p className="coordinate-info">
            x: {coordinate.x},
            y: {coordinate.y},
            width: {coordinate.width},
            height: { coordinate.height}
          </p>
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
          />
        </div>
      </div>
    );
  }
}

export default LocalBoard;
