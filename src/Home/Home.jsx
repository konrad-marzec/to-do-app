import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import React, { Component } from 'react';

import Query from '../Query';
import ListTile from './ListTile';
import MasonryGrid from '../utils/Masonry';

import styles from './Home.scss';
class Home extends Component {
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
    console.log('asjdhkjahskdjhkajshdkjh');

    return (
      <div className={styles.container}>
        <Query
          query={LISTS_QUERY}
          component={this.renderGrid}
        />
      </div>
    );
  }
}

export const LISTS_QUERY = gql`
  query ListsQuery {
    lists {
      id
      name
      todos_count,
      completedTasksCount
    }
  }
`

export default Home;
