import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { size } from 'lodash';

import ContentLoader from './ContentLoader';
import animationData from '../../../static/assets/loaders/empty_list.json';

import styles from './ContentRenderer.scss'
class ContentRenderer extends Component {
  render() {
    const { elements, render: renderContent, text } = this.props;

    if (!size(elements)) {
      return (
        <ContentLoader
          className={styles.container}
          animationData={animationData}
          text={text}
        />
      )
    }

    return renderContent;
  }
}

ContentRenderer.propTypes = {
  text: PropTypes.string,
  render: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  elements: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
};

ContentRenderer.defaultProps = {
  text: "This list is empty",
};

export default ContentRenderer;
