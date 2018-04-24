import ContentRemove from 'material-ui/svg-icons/action/delete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import React, { Component, Fragment } from 'react';
import IconButton from 'material-ui/IconButton';
import { Mutation } from "react-apollo";
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import gql from "graphql-tag";
import Form from '../Form';

import { LISTS_QUERY } from '../Home';
import Circle from '../utils/Progress/Circle';

import styles from './ToDoHeader.scss';
class ToDoHeader extends Component {
  updateRecentlyVisited = id => {
    let oldList = [];
    try {
      oldList = JSON.parse(localStorage.getItem('recentLists') || '[]');
    } catch (error) {}

    localStorage.setItem(
      'recentLists',
      JSON.stringify(oldList.filter(t => t !== `${id}`))
    )
  }

  updateCacheRemove = (cache, { data: { removeList } }) => {
    const { router: { history: { replace } } } = this.context;
    try {
      const { lists } = cache.readQuery({ query: LISTS_QUERY });

      cache.writeQuery({
        query: LISTS_QUERY,
        data: {
          lists: lists.filter(l => l.id !== removeList.id)
        }
      });

      this.updateRecentlyVisited(removeList.id);
    } catch (error) {}

    replace({ pathname: '/' });
  }

  editListButton = onClick => (
    <IconButton
      iconStyle={muiStyles.mediumIcon}
      style={muiStyles.removeButton}
      onClick={onClick}
    >
      <ModeEdit />
    </IconButton>
  )

  removeListButton = (removeList, { data }) => {
    const params = {
      variables: { id: this.props.list.id }
    };

    return (
      <IconButton
        onClick={() => removeList(params)}
        iconStyle={muiStyles.mediumIcon}
        style={muiStyles.removeButton}
      >
        <ContentRemove />
      </IconButton>
    )
  }

  render() {
    const { list } = this.props;
    const {
      completedTasksCount,
      todos_count: taskCount,
    } = list;

    return (
      <Paper
        style={muiStyles.container}
        rounded={false}
        zDepth={1}
      >
        <div className={styles.listInfo}>
          <div className={styles.listDescription}>
            <div className={styles.listName}>
              <div>{list.name}</div>
              <div className={styles.buttons}>
                <Form
                  data={{ name: list.name, id: list.id }}
                  launchButton={this.editListButton}
                  listForm
                />
                <Mutation
                  mutation={REMOVE_LIST}
                  update={this.updateCacheRemove}
                >
                  {this.removeListButton}
                </Mutation>
              </div>
            </div>
            {!!taskCount && (
              <div className={styles.taskCompleted}>
                <strong>{completedTasksCount}</strong>
                task completed
              </div>
            )}
          </div>
          {!!taskCount && (
            <div className={styles.chart}>
              <Circle percent={completedTasksCount / taskCount * 100}/>
              <div className={styles.taskCompleted}>
                <strong>{taskCount - completedTasksCount}</strong>
                task to go
              </div>
            </div>
          )}
        </div>
      </Paper>
    );
  }
}

const muiStyles = {
  removeButton: {
    padding: 12,
  },
  mediumIcon: {
    width: 26,
    height: 26,
    color: 'white',
  },
  container: {
    backgroundColor: 'rgb(0, 188, 212)',
    position: 'fixed',
    width: '100%',
    zIndex: 10,
    left: 0,
    top: 64,
  }
};

const REMOVE_LIST = gql`
  mutation RemoveList($id: Int!) {
    removeList(id: $id) {
      id
    }
  }
`

const EDIT_LIST = gql`
  mutation EditList($id: Int!, $name: String!) {
    editList(id: $id, name: $name) {
      id
      name
    }
  }
`

ToDoHeader.propTypes = {
  list: PropTypes.object.isRequired,
};

ToDoHeader.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default ToDoHeader;
