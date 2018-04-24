import gql from 'graphql-tag';
import { parse } from 'query-string';
import { graphql } from 'react-apollo';
import React, { Component } from 'react';

import Query from '../Query';
import ListTile from './ListTile';
import MasonryGrid from '../utils/Masonry';

import styles from './Home.scss';
class Home extends Component {
  getQuery = () => {
    const { location: { search } } = this.props;

    return parse(search);
  }

  renderLists = elements => {
    return elements.map(element => (
      <div className="MasonryGrid-element" key={element.id}>
        <ListTile list={element} />
      </div>
    ))
  }

  renderGrid = ({ data: { lists } }) => (
    <MasonryGrid
      elements={lists}
      className={styles.tiles}
      renderGrid={this.renderLists}
    />
  )
  render() {
    return (
      <div className={styles.container}>
        <Query
          query={LISTS_QUERY}
          component={this.renderGrid}
          variables={{ order: this.getQuery().order }}
        />
      </div>
    );
  }
}

export const LISTS_QUERY = gql`
  query ListsQuery($order: String) {
    lists(order: $order) {
      id
      name
      todos_count,
      completedTasksCount
    }
  }
`

export default Home;
