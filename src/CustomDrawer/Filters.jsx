import FloatingActionButton from 'material-ui/FloatingActionButton';
import CropSquare from 'material-ui/svg-icons/image/crop-square';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ActionDone from 'material-ui/svg-icons/action/done';
import React, { Component, Fragment } from 'react';
import { parse, stringify } from 'query-string';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import styles from './Filters.scss';
class Filters extends Component {
  isActive = key =>
    this.getQuery().filter === key;

  filterBy = key => {
    const { router: { history: { replace } } } = this.context;
    if (key) {
      replace({ search: stringify({ filter: key }) })
    } else {
      replace({ search: stringify({}) })
    }
  }

  getQuery = () => {
    const { location: { search } } = this.props;

    return parse(search);
  }

  render() {
    const { match: { params } } = this.props;

    if (!params.id) {
      return null;
    }

    return (
      <Fragment>
        <Divider />
        <Subheader>Filters</Subheader>
        <div className={styles.container}>
          <FloatingActionButton
            onClick={() => this.filterBy(FILTER_KEYS.TODO)}
            secondary={this.isActive(FILTER_KEYS.TODO)}
          >
            <span>To Do</span>
          </FloatingActionButton>
          <FloatingActionButton
            onClick={() => this.filterBy(FILTER_KEYS.DONE)}
            secondary={this.isActive(FILTER_KEYS.DONE)}
          >
            <span>Done</span>
          </FloatingActionButton>
          <FloatingActionButton
            onClick={() => this.filterBy(FILTER_KEYS.ALL)}
            secondary={this.isActive(FILTER_KEYS.ALL)}
          >
            <span>All</span>
          </FloatingActionButton>
        </div>
      </Fragment>
    )
  }
}

const FILTER_KEYS = {
  ALL: undefined,
  DONE: 'done',
  TODO: 'todo',
};

Filters.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

Filters.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(Filters);
