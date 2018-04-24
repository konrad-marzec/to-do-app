import React, { Component, Fragment } from 'react';
import Subheader from 'material-ui/Subheader';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import { Query } from "react-apollo";
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import Filters from './Filters';

import styles from './CustomDrawer.scss';
class CustomDrawer extends Component {
  shouldComponentUpdate = nextProps =>
    this.props.location.pathname !== nextProps.location.pathname
      || this.props.open !== nextProps.open;

  renderRecentVisitedLists = ({ loading, error, data }) => {
    if (loading || error) {
      return null;
    }

    const listName = data.listsByIds
      .reduce((res, list) => ({ ...res, [list.id]: list }), {})

    return this.getRecentLists().map(listId => listName[listId] && (
      <MenuItem key={listId} style={muiStyles.menuItem}>
        <Link className={styles.link} to={`/list/${listId}`}>
          {listName[listId].name}
        </Link>
      </MenuItem>
    ));
  }

  getRecentLists = () => {
    let recentLists = [];

    try {
      recentLists = JSON.parse(localStorage.getItem('recentLists'))
    } catch (error) {}

    return recentLists;
  }

  render() {
    const { match: { params }, location } = this.props;

    return (
      <Drawer
        containerStyle={{
          ...muiStyles.containerStyle,
          top: params.id ? muiStyles.containerStyle.top + 122 : muiStyles.containerStyle.top,
        }}
        onRequestChange={this.onRequestChange}
        overlayStyle={muiStyles.overlayStyle}
        open={this.props.open}
      >
        <Subheader>Menu</Subheader>
        <MenuItem style={muiStyles.menuItem}>
          <Link className={styles.link} to="/">
            HOME
          </Link>
        </MenuItem>
        <Subheader>Recently Visited</Subheader>
        <Query
          query={LISTS_QUERY}
          variables={{ ids: this.getRecentLists() }}
        >
          {this.renderRecentVisitedLists}
        </Query>
        {params.id && (
          <Filters
            filters={FILTER_KEYS}
            labels={filterLabels}
            title="Filters"
            param="filter"
          />
        )}
        <Filters
          title="Order Options"
          filters={SORT_KEYS}
          labels={sortLabels}
          param="order"
        />
      </Drawer>
    );
  }
}

const FILTER_KEYS = {
  ALL: undefined,
  DONE: 'done',
  TODO: 'todo',
};

const filterLabels = {
  done: 'Done',
  todo: 'To Do',
  undefined: 'All'
}

const SORT_KEYS = {
  NONE: undefined,
  DESC: 'desc',
  ASC: 'asc',
};

const sortLabels = {
  undefined: 'None',
  desc: 'Desc',
  asc: 'Asc',
}

const muiStyles = {
  containerStyle: {
    position: 'fixed',
    boxShadow: 'none',
    top: 64,
  },
  menuItem: {
    padding: 0,
  },
  overlayStyle: {
    backgroundColor: 'transparent',
  },
}

const LISTS_QUERY = gql`
  query ListsQuery($ids: [Int]) {
    listsByIds(ids: $ids) {
      name
      id
    }
  }
`

CustomDrawer.propTypes = {
  open: PropTypes.bool,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(CustomDrawer);
