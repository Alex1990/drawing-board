import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './DrawingCanvas.css';

function drawBrushLine(ctx, {
  from,
  to,
  size,
}) {
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.lineWidth = size;
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.closePath();
}

function drawEraserLine(ctx, {
  from,
  to,
  size,
}) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.lineWidth = size;
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

function execCommand(ctx, command) {
  switch (command.type) {
    case 'brush': drawBrushLine(ctx, command); break;
    case 'eraser': drawEraserLine(ctx, command); break;
  }
}

class DrawingCanvas extends Component {
  static propTypes = {
    activeTool: PropTypes.shape({
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      shortcut: PropTypes.string,
    }).isRequired,
    onPushCommand: PropTypes.func,
  };

  static defaultProps = {
    onPushCommand: _.noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      width: undefined,
      height: undefined,
    };
    this.onResize = this.onResize.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerOut = this.onPointerOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.setDimension();
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointerout', this.onPointerOut);
    this.setCursor(this.props.activeTool);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.activeTool !== nextProps.activeTool) {
      this.setCursor(nextProps.activeTool);
    }
  }

  componentWillUnmout() {
    window.removeEventListener('resize', this.onResize);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointerout', this.onPointerOut);
  }

  setDimension() {
    const { width, top } = this.wrapper.getBoundingClientRect();
    const winHeight = window.innerHeight;
    const height = winHeight - top - 16;
    const canvasBounding = this.canvas.getBoundingClientRect();
    this.setState({
      width: Math.floor(width),
      height: Math.floor(height),
      canvasPageX: Math.floor(canvasBounding.left),
      canvasPageY: Math.floor(canvasBounding.top),
    });
  }

  setCursor(activeTool, color = '#000') {
    const { size } = activeTool;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const crossLineLength = 3;
    const gap = 3;
    let canvasSize;

    if (size > 4) {
      canvasSize = Math.ceil(size / 2) * 2;
    } else if (size > 2) {
      canvasSize = crossLineLength * 2 + gap * 2 + 3;
    } else {
      canvasSize = crossLineLength * 2 + gap * 2 + 1;
    }

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const midPoint = Math.floor(canvasSize / 2);

    ctx.beginPath();

    if (size >= 5) {
      ctx.lineWidth = 1;
      ctx.arc(midPoint, midPoint, midPoint, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.stroke();
    } else {

      ctx.fillStyle = color;

      // top/right/bottom/left cross lines
      ctx.fillRect(midPoint, 0, 1, crossLineLength);
      ctx.fillRect(midPoint, 0, 1, crossLineLength);
      ctx.fillRect(canvasSize - crossLineLength, midPoint, crossLineLength, 1);
      ctx.fillRect(midPoint, canvasSize - crossLineLength, 1, crossLineLength);
      ctx.fillRect(0, midPoint, crossLineLength, 1);

      // center circle/dot
      if (size === 4) {
        ctx.fillRect(midPoint - 1, midPoint - 1, 3, 1);
        ctx.fillRect(midPoint + 1, midPoint - 1, 1, 3);
        ctx.fillRect(midPoint - 1, midPoint + 1, 3, 1);
        ctx.fillRect(midPoint - 1, midPoint - 1, 1, 3);
      } else if (size === 3) {
        ctx.fillRect(midPoint, midPoint - 1, 1, 1);
        ctx.fillRect(midPoint + 1, midPoint, 1, 1);
        ctx.fillRect(midPoint, midPoint + 1, 1, 1);
        ctx.fillRect(midPoint - 1, midPoint, 1, 1);
      } else {
        ctx.fillRect(midPoint, midPoint, 1, 1);
      }
    }

    ctx.closePath();

    const cursorUrl = canvas.toDataURL('image/png', 1);

    this.canvas.style.cursor = `url(${cursorUrl}) ${midPoint} ${midPoint}, auto`;
  }

  execCommand(command) {
    const ctx = this.canvas.getContext('2d');
    execCommand(ctx, command);
    this.props.onPushCommand(command);
  }

  onResize() {
    this.setDimension();
  }

  onPointerDown(e) {
    const { activeTool } = this.props;
    const { canvasPageX, canvasPageY } = this.state;

    this.canBegin = true;
    this.previousPoint = {
      x: e.pageX - canvasPageX,
      y: e.pageY - canvasPageY,
    };

    const command = {
      type: activeTool.type,
      size: activeTool.size,
      from: this.previousPoint,
      to: this.previousPoint,
    };

    this.execCommand(command);
  }

  onPointerMove(e) {
    const { activeTool } = this.props;

    if (this.canBegin) {
      const { canvasPageX, canvasPageY } = this.state;
      const command = {
        type: activeTool.type,
        size: activeTool.size,
        from: this.previousPoint,
        to: {
          x: e.pageX - canvasPageX,
          y: e.pageY - canvasPageY,
        },
      };

      this.execCommand(command);
      this.previousPoint = command.to;
    }
  }

  onPointerUp() {
    this.canBegin = false;
  }

  onPointerOut() {
    this.canBegin = false;
  }

  render() {
    const { width, height } = this.state;

    return (
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
    );
  }
}

export default DrawingCanvas;
