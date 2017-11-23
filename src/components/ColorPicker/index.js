import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popover } from 'antd';
import classNames from 'classnames';
import { SketchPicker } from 'react-color';
import tinyColor from 'tinycolor2';
import './index.css';

class ColorPicker extends Component {
  static propTypes = {
    initialValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    initialValue: '#000000',
    value: '#000000',
    onChange: _.noop,
  };

  constructor(props) {
    super(props);
    const { value, initialValue, visible } = props;
    let internalValue = initialValue;

    if (value) {
      internalValue = value;
    }

    this.state = {
      internalValue,
    };
    this.onColorChangeComplete = this.onColorChangeComplete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.value, nextProps.value)) {
      this.setState({ internalValue: nextProps.value });
    }
  }

  onColorChangeComplete(color) {
    this.setState({ internalValue: color.rgb }, () => {
      const { r, g, b, a } = color.rgb;
      this.props.onChange(`rgba(${r},${g},${b},${a})`);
    });
  }

  render() {
    const { className } = this.props;
    const { internalValue } = this.state;
    const color = tinyColor(internalValue);
    const sketchPicker = (
      <SketchPicker
        color={internalValue}
        onChangeComplete={this.onColorChangeComplete}
      />
    );
    const cls = classNames('color-picker-container', className);
    const ownProps = _.omit(this.props, [
      'initialValue',
      'value',
      'onChange',
    ]);
    return (
      <span
        className={cls}
        ref={el => (this.container = el)}
        {...ownProps}
      >
        <Popover
          arrowPointAtCenter
          trigger="click"
          placement="rightTop"
          content={sketchPicker}
          overlayClassName="color-picker-overlay"
        >
          <span
            className="color-picker"
            style={{ background: color.toRgbString() }}
          />
        </Popover>
      </span>
    );
  }
}

export default ColorPicker;
