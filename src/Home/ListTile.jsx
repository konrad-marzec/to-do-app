import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './ListTile.scss';
class ListTile extends Component {
  randomColor = () =>
    colors[this.props.list.name.charCodeAt(0) % colors.length]

  render() {
    const { className, list } = this.props;
    return (
      <div
        className={classNames(styles.container)}
        style={{ backgroundColor: this.randomColor() }}
      >
        <div className={styles.title}>
          {list.name}
        </div>
        <div className={styles.circle}>
          <Link
            to={`/list/${list.id}`}
            className={styles.button}
          >
            <span className={styles.count}>
              {list.todos_count - list.completedTasksCount}
            </span>
            <span className={styles.circle}>To Go</span>
          </Link>
        </div>
        <div />
      </div>
    );
  }
}

const colors = [
  '#15b9d4', '#f05352', '#fcae29', '#17bba3', '#5d4b97', '#d99579', '#e15f3f'
];

ListTile.propTypes = {
  className: PropTypes.string,
  list: PropTypes.object,
};

export default ListTile;
