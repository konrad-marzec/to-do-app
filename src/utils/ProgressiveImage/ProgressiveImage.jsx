import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import styles from './ProgressiveImage.scss';
class ProgressiveImage extends React.Component {
  state = { loading: true };

  componentDidMount = () => {
    if (this.component) {
      this.observer = new IntersectionObserver(this.handleIntersection);
      this.observer.observe(this.component);
    }
  }

  componentWillReceiveProps = nextProps => {
    const { src, placeholder } = nextProps;

    if (src !== this.props.src) {
      this.setState({ image: placeholder, loading: true }, () => {
        this.loadImage(src);
      });
    }
  }

  componentWillUnmount = () => {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }
  }

  onLoad = () =>
    this.setState({
      image: this.image.src,
      loading: false
    });

  onError = errorEvent => {
    const { onError } = this.props;
    if (onError) {
      onError(errorEvent);
    }
  };

  setRef = ref => {
    this.component = ref;
  }

  handleIntersection = e => {
    if (e[0].isIntersecting) {
      this.loadImage(this.props.src);
      this.observer.unobserve(this.component);
    }
  }

  loadImage = src => {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }

    const image = new Image();

    this.image = image;
    image.onload = this.onLoad;
    image.onerror = this.onError;
    image.src = src;
  };

  placeholder = () => (
    <CSSTransition
      classNames={{
        exit: styles.exit,
        exitActive: styles.exitActive
      }}
      in={this.state.loading}
      timeout={1000}
      unmountOnExit
    >
      {this.renderTransition}
    </CSSTransition>
  )

  renderTransition = () =>
    <img
      className={styles.placeholder}
      src={this.props.placeholder}
      ref={this.setRef}
      alt=""
    />

  render() {
    const { image, loading } = this.state;
    const { content } = this.props;

    return content(image, this.placeholder, loading);
  }
}

ProgressiveImage.propTypes = {
  placeholder: PropTypes.string.isRequired,
  content: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
  onError: PropTypes.func,
};

export default ProgressiveImage;
