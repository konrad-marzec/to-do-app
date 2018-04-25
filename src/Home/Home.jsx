import gql from 'graphql-tag';
import { parse } from 'query-string';
import { graphql } from 'react-apollo';
import React, { Component } from 'react';

import Query from '../Query';
import ListTile from './ListTile';
import MasonryGrid from '../utils/Masonry';
import ContentRenderer from '../utils/ContentLoader/ContentRenderer';

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
    <ContentRenderer
      text="Add to do lists."
      elements={lists}
      render={
        <MasonryGrid
          elements={lists}
          className={styles.tiles}
          renderGrid={this.renderLists}
        />
      }
    />
  )

  render() {
    const { order, search } = this.getQuery();

    return (
      <div className={styles.container}>
        <Query
          query={LISTS_QUERY}
          component={this.renderGrid}
          variables={{ order, search }}
        />
      </div>
    );
  }
}

Home.fragments = {
  list: gql`
    fragment listFields on List {
      id
      name
      todos_count,
      completedTasksCount
    }
  `
}

export const LISTS_QUERY = gql`
  query ListsQuery($order: String, $search: String) {
    lists(order: $order, search: $search) {
      ...listFields
    }
  }
  ${Home.fragments.list}
`

export default Home;
