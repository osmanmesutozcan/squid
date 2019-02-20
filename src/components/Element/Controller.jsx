import React from "react";
import PropTypes from "prop-types";

import "./Controller.css";

/**
 * Draggable control area
 */
class Draggable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moving: false
    };
  }

  componentDidMount() {
    document.addEventListener("mouseup", this._onMouseUp.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this._onMouseUp.bind(this));
  }

  // helper to check if module was disposed.
  _wasDisposed = () => {
    if (
      !this.props.unit[this.props.params.x.param] ||
      !this.props.unit[this.props.params.y.param]
    ) {
      return true;
    }

    return false;
  };

  _onMouseUp = e => {
    if (this.props.end && !this._wasDisposed()) {
      this.props.end();
    }

    if (this.props.onMouseUp) {
      this.props.onMouseUp(e);
    }

    this.setState({ moving: false });
  };

  _onMouseDown = e => {
    if (this.props.start && !this._wasDisposed()) {
      this.props.start();
    }

    this.setState({ moving: true });
  };

  _onMouseMove = e => {
    this._setValue(this.props.params.x.param, this._setX(e));
    this._setValue(this.props.params.y.param, this._setY(e));
  };

  /**
   * Set a value on a specified param of unit.
   * @param {String} param name of the parameter to set.
   * @param {String | Number} value new value of the param.
   */
  _setValue = (param, value) => {
    this.props.unit[param].value = value;
  };

  /**
   * Calculate X value according to params.
   */
  _setX = e => {
    let params = this.props.params.x;

    let width = e.target.offsetWidth;
    let posX = e.nativeEvent.offsetX;

    return ((params.max - params.min) / 100) * (posX / (width / 100));
  };

  /**
   * Calculate Y value according to params.
   */
  _setY = e => {
    let params = this.props.params.y;

    let height = e.target.offsetHeight;
    let posY = e.nativeEvent.offsetY;

    return ((params.max - params.min) / 100) * (posY / (height / 100));
  };

  render() {
    return (
      <div
        className="squid-draggable-area"
        onMouseMove={e => this.state.moving && this._onMouseMove(e)}
        onMouseDown={this._onMouseDown.bind(this)}
      />
    );
  }
}

Draggable.propTypes = {
  params: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
  onMouseUp: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseMove: PropTypes.func,
  start: PropTypes.func,
  end: PropTypes.func
};

export default {
  Draggable
};
