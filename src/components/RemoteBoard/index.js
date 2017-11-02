import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';

class RemoteBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: undefined,
      height: undefined,
    };
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerOut = this.onPointerOut.bind(this);
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
    this.ctx = this.canvas.getContext('2d');
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointerout', this.onPointerOut);
  }

  componentWillUnmout() {
    this.canvas.removeEventListener('pointerdown');
    this.canvas.removeEventListener('pointermove');
    this.canvas.removeEventListener('pointerup');
    this.canvas.removeEventListener('pointerout');
  }

  onPointerDown(e) {
    this.canBegin = true;
    this.previousPoint = { x: e.offsetX, y: e.offsetY };
  }

  onPointerMove(e) {
    if (this.canBegin) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.previousPoint.x, this.previousPoint.y);
      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();
      this.ctx.closePath();
      this.previousPoint.x = e.offsetX;
      this.previousPoint.y = e.offsetY;
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
        className="canvas-wrapper"
        ref={el => (this.wrapper = el)}
      >
        <canvas
          className="canvas"
          ref={el => (this.canvas = el)}
          width={width}
          height={height}
        />
      </div>
    );
  }
}

export default RemoteBoard;
