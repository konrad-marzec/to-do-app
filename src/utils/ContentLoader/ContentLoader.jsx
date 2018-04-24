import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { Component } from 'react';

import animation from '../../../static/assets/loaders/worm.json';

import styles from './ContentLoader.scss';
class ContentLoader extends Component {
  componentDidMount = () => {
    const lottie = require('lottie-web');
    const options = {
      animationData: this.props.animationData,
      container: this.wrapper,
      prerender: true,
      renderer: 'svg',
      autoplay: true,
      loop: true,
      ...this.props.options,
    }

    this.animation = lottie.loadAnimation(options);
  }

  componentWillUnmount = () => {
    this.animation.destroy();
  }

  setRef = ref => {
    this.wrapper = ref;
  }

  render() {
    const { className, text } = this.props;
    return (
      <div className={classNames(styles.container, className)}>
        <div
          className={styles.animation}
          ref={this.setRef}
        />
        <div className={styles.text}>
          {text}
        </div>
      </div>
    );
  }
}

ContentLoader.propTypes = {
  className: PropTypes.string,
  animationData: PropTypes.object,
};

ContentLoader.defaultProps = {
  animationData: animation,
  text: 'Loading...'
}

export default ContentLoader;
