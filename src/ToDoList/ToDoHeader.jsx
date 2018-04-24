import ContentRemove from 'material-ui/svg-icons/action/delete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import React, { Component, Fragment } from 'react';
import IconButton from 'material-ui/IconButton';
import { Mutation } from "react-apollo";
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import gql from "graphql-tag";

import Circle from '../utils/Progress/Circle';

import styles from './ToDoHeader.scss';
class ToDoHeader extends Component {
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
                <IconButton
                  iconStyle={muiStyles.mediumIcon}
                  style={muiStyles.removeButton}
                >
                  <ModeEdit />
                </IconButton>
                <IconButton
                  iconStyle={muiStyles.mediumIcon}
                  style={muiStyles.removeButton}
                >
                  <ContentRemove />
                </IconButton>
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

ToDoHeader.propTypes = {
  list: PropTypes.object.isRequired,
};

export default ToDoHeader;
