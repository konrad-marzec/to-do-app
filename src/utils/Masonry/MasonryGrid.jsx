import Masonry from 'react-masonry-component';
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';


import './MasonryGrid.scss';
class MasonryGrid extends Component {
  setMasonry = c => {
    this.masonry = c;
  }

  render() {
    const { elements, options, className, renderGrid } = this.props;
    const masonryClasses = classNames('MasonryGrid', className);

    return (
      <Masonry
        ref={this.setMasonry}
        className={masonryClasses}
        options={{ ...masonryOptions, ...options }}
      >
        <div className="MasonryGrid-sizer" />
        {renderGrid(elements)}
      </Masonry>
    );
  }
}

const masonryOptions = {
  percentPosition: true,
  horizontalOrder: true,
  columnWidth: '.MasonryGrid-sizer',
  itemSelector: '.MasonryGrid-element',
};

MasonryGrid.propTypes = {
  elements: PropTypes.oneOfType([
    PropTypes.instanceOf(Set),
    PropTypes.instanceOf(Array),
  ]).isRequired,
  renderGrid: PropTypes.func.isRequired,
  className: PropTypes.string,
  options: PropTypes.object,
};

MasonryGrid.defaultProps = {
  options: masonryOptions,
};

export default MasonryGrid;
