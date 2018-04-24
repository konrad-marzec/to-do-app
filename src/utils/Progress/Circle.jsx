import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Circle.scss';
class Circle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circumference: props.radius * 2 * Math.PI,
    };
  }

  componentDidMount = () => {
    this.updateCircle(this.props, this.state);
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateCircle(this.props, this.state);
  }


  shouldComponentUpdate = nextProps =>
    this.props.percent !== nextProps.percent

  setRef = ref => {
    this.circle = ref;
  }

  updateCircle = (props, state) => {
    const { circumference } = state;
    const { percent } = props;

    const offset = circumference - percent / 100 * circumference

    this.circle.style.strokeDasharray = `${circumference} ${circumference}`;
    this.circle.style.strokeDashoffset = offset;
  }

  render() {
    const {
      width,
      height,
      radius,
      percent,
      dashoffset,
      strokeWidth,
    } = this.props;

    return (
      <svg className={styles.circle}>
        <circle
          className={styles.circleRing}
          strokeWidth={strokeWidth}
          fill="rgba(0, 0, 0, 0.1)"
          ref={this.setRef}
          stroke="white"
          cy={height}
          cx={width}
          r={radius}
        />
      </svg>
    );
  }
}

Circle.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  radius: PropTypes.number,
  dasoffset: PropTypes.number,
  strokeWidth: PropTypes.number,
  percent: PropTypes.number.isRequired,
};

Circle.defaultProps = {
  width: 30,
  height: 30,
  radius: 26,
  dasoffset: 0,
  strokeWidth: 6,
};

export default Circle;
