import FloatingActionButton from 'material-ui/FloatingActionButton';
import React, { Component, Fragment } from 'react';
import { parse, stringify } from 'query-string';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { map, omit } from 'lodash';

import styles from './Filters.scss';
class Filters extends Component {
  isActive = key =>
    this.getQuery()[this.props.param] === key;

  filterBy = key => {
    const { router: { history: { replace } } } = this.context;
    const { param } = this.props;
    const query = this.getQuery();

    if (key) {
      replace({ search: stringify({ ...query, [param]: key }) })
    } else {
      replace({ search: stringify({ ...omit(query, param) }) })
    }
  }

  getQuery = () => {
    const { location: { search } } = this.props;

    return parse(search);
  }

  renderButtons = () => {
    const { filters, labels } = this.props;

    return map(filters, (key, idx) => (
      <FloatingActionButton
        onClick={() => this.filterBy(key)}
        secondary={this.isActive(key)}
        key={idx}
      >
        <span>{labels[key]}</span>
      </FloatingActionButton>
    ))
  }

  render() {
    const { title } = this.props;

    return (
      <Fragment>
        <Divider />
        <Subheader>{title}</Subheader>
        <div className={styles.container}>
          {this.renderButtons()}
        </div>
      </Fragment>
    )
  }
}

Filters.propTypes = {
  title: PropTypes.string.isRequired,
  param: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  labels: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

Filters.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(Filters);
