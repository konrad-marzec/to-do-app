import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContentLoader from './ContentLoader';
import animationData from '../../../static/assets/loaders/crying.json'

import styles from './ContentError.scss'
class ContentRenderer extends Component {
  render() {
    const { text } = this.props;

    return (
      <ContentLoader
        className={styles.container}
        animationData={animationData}
        text={text}
      />
    )
  }
}

ContentRenderer.propTypes = {
  text: PropTypes.string,
};

ContentRenderer.defaultProps = {
  text: "This list is empty",
};

export default ContentRenderer;
