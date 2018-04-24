import React, { Component, Fragment } from 'react';
import { parse } from 'query-string';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import Query from '../Query';
import ToDoHeader from './ToDoHeader';
import ContentLoader from '../utils/ContentLoader';
import animationData from '../../static/assets/loaders/empty_list.json';

import styles from './TodoList.scss';
import TaskTile from './TaskTile';
class ToDoList extends Component {
  componentDidMount = () => {
    this.updateRecentlyVisited();
  }

  updateRecentlyVisited = () => {
    const { match: { params } } = this.props;
    let oldList = [];
    try {
      oldList = JSON.parse(localStorage.getItem('recentLists') || '[]');
    } catch (error) {}

    localStorage.setItem(
      'recentLists',
      JSON.stringify([...new Set([params.id, ...oldList])].slice(0, 5))
    )
  }

  renderTasks = (tasks, list) => {
    if (!tasks.length) {
      return (
        <ContentLoader
          className={styles.placeholder}
          animationData={animationData}
          text="This list is empty"
        />
      )
    }

    return tasks.map(task => (
      <TaskTile key={task.id} task={task} list={list}/>)
    )
  }

  renderList = ({ data: { list } }) => (
    <Fragment>
      <ToDoHeader list={list} />
      {this.renderTasks(list.tasks, list)}
    </Fragment>
  )

  render() {
    const {
      match: { params },
      location: { search },
    } = this.props;

    const queryParams = {
      id: params.id,
      filter: parse(search).filter,
    }

    return (
      <div className={styles.container}>
        <Query
          query={TASKS_QUERY}
          component={this.renderList}
          variables={queryParams}
        />
      </div>
    );
  }
}

ToDoList.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

ToDoList.fragments = {
  tasks: gql`
    fragment TasksList on Task {
      id
      name
      is_complete
    }
  `,
}

export const TASKS_QUERY = gql`
  query Tasks($id: Int!, $filter: String) {
    list(id: $id) {
      id
      name
      todos_count
      completedTasksCount
      tasks(filter: $filter) {
        ...TasksList
      }
    }
  }
  ${ToDoList.fragments.tasks}
`

export default ToDoList;
