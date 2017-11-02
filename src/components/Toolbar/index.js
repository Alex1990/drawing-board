import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import mousetrap from 'mousetrap';
import ToolButton from './ToolButton';
import './index.css';

const MIN_TOOL_SIZE = 1;
const MAX_TOOL_SIZE = 125; // Can not greater than 128

class Toolbar extends Component {
  static propTypes = {
    activeTool: PropTypes.shape({
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      shortcut: PropTypes.string,
      size: PropTypes.number,
    }).isRequired,
    onToolChange: PropTypes.func,
    onToolSizeChange: PropTypes.func,
  };

  static defaultProps = {
    onToolChange: _.noop,
    onToolSizeChange: _.noop,
  };

  constructor(props) {
    super(props);
    this.increaseToolSize = this.increaseToolSize.bind(this);
    this.decreaseToolSize = this.decreaseToolSize.bind(this);
  }

  componentDidMount() {
    _.forEach(this.props.tools, (tool) => {
      if (tool.shortcut) {
        mousetrap.bind(tool.shortcut, this.proxyShortcutListener(tool));
      }
    });

    mousetrap.bind(']', this.increaseToolSize);
    mousetrap.bind('[', this.decreaseToolSize);
  }

  componentWillUnmout() {
    _.forEach(this.props.tools, ({ shortcut }) => {
      if (shortcut) {
        mousetrap.unbind(shortcut);
      }
    });

    mousetrap.unbind('[');
    mousetrap.unbind(']');
  }

  proxyShortcutListener(tool) {
    return () => {
      if (this.props.activeTool.type !== tool.type) {
        this.props.onToolChange(tool.type);
      }
    };
  }

  increaseToolSize() {
    const { activeTool, onToolSizeChange } = this.props;
    let size = activeTool.size;
    if (size && size < MAX_TOOL_SIZE) {
      if (size < 10) {
        size += 1;
      } else if (size < 50) {
        size += 5;
      } else if (size < 100) {
        size += 10;
      } else if (size < 200) {
        size += 25;
      } else if (size < 300) {
        size += 50;
      } else {
        size += 100;
      }
      onToolSizeChange(size);
    }
  }

  decreaseToolSize() {
    const { activeTool, onToolSizeChange } = this.props;
    let size = activeTool.size;
    if (size && size > MIN_TOOL_SIZE) {
      if (size <= 10) {
        size -= 1;
      } else if (size <= 50) {
        size -= 5;
      } else if (size <= 100) {
        size -= 10;
      } else if (size <= 200) {
        size -= 25;
      } else if (size <= 300) {
        size -= 50;
      } else {
        size -= 100;
      }
      onToolSizeChange(size);
    }
  }

  render() {
    const { tools, activeTool, onToolChange  } = this.props;

    const toolBtns = _.map(tools, ({ type, title, shortcut }) =>
      <ToolButton
        key={type}
        icon={type}
        activated={activeTool.type === type}
        title={`${title} (${shortcut.toUpperCase()})`}
        onActive={onToolChange}
      />
    );

    return (
      <div className="toolbar">
        {toolBtns}
      </div>
    );
  }
}

export default Toolbar;
