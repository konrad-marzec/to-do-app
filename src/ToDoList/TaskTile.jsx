import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import CropSquare from 'material-ui/svg-icons/image/crop-square';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ActionDone from 'material-ui/svg-icons/action/done';
import React, { Component, Fragment } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Mutation } from "react-apollo";
import PropTypes from 'prop-types';
import gql from "graphql-tag";

import { TASKS_QUERY } from './ToDoList';
import ProgressiveImage from '../utils/ProgressiveImage';

import styles from './TaskTile.scss';
class TaskTile extends Component {
  completeTaskButton = (completeTask, { data }) => {
    const { task, list } = this.props;
    const params = {
      variables: {
        id: task.id,
        list: list.id,
        name: task.name,
        is_complete: !task.is_complete,
      },
    };

    return (
      <FloatingActionButton onClick={() => completeTask(params)}>
        {task.is_complete ? <ActionDone /> : <CropSquare />}
      </FloatingActionButton>
    )
  }

  removeTaskButton = (removeTask, { data }) => {
    const params = {
      variables: { id: this.props.task.id }
    };

    return (
      <FloatingActionButton
        secondary={true}
        onClick={() => removeTask(params)}
      >
        <ContentRemove />
      </FloatingActionButton>
    )
  }

  readCache = (cache, id) => {
    const { listToDos, list } = cache.readQuery({
      variables: { id: `${this.props.list.id}` },
      query: TASKS_QUERY,
    });

    const task = listToDos.find(t => t.id === id);

    return {
      list,
      task,
      listToDos,
    }
  }

  updateCache = (cache, { data: { updateTask } }) => {
    const { listToDos, list, task } = this.readCache(cache, updateTask.id);

    task.is_complete = updateTask.is_complete;

    cache.writeQuery({
      query: TASKS_QUERY,
      variables: { id: `${this.props.list.id}` },
      data: {
        listToDos,
        list: {
          ...list,
          completedTasksCount: updateTask.is_complete
            ? list.completedTasksCount + 1
            : list.completedTasksCount - 1
        }
      }
    });
  }

  removeFromCache = (cache, { data: { removeTask } }) => {
    const { listToDos, list, task } = this.readCache(cache, removeTask.id);

    cache.writeQuery({
      query: TASKS_QUERY,
      variables: { id: `${this.props.list.id}` },
      data: {
        listToDos: listToDos.filter(t => t.id !== removeTask.id),
        list: {
          ...list,
          todos_count: list.todos_count - 1,
          completedTasksCount: task.is_complete
            ? list.completedTasksCount - 1
            : list.completedTasksCount,
        }
      }
    })
  }

  renderImage = (src, Placeholder, loading) => (
    <Fragment>
      <img className={styles.image} src={src} alt="" />
      <Placeholder />
    </Fragment>
  )

  render() {
    const { task } = this.props;
    return (
      <div className={styles.container} ref={this.setRef}>
        <Card>
          <CardMedia
            style={{ position: 'relative' }}
            overlay={<CardTitle title={this.props.task.name} />}
          >
            <ProgressiveImage
              content={this.renderImage}
              src={`https://source.unsplash.com/random/1000x400`}
              placeholder="https://source.unsplash.com/random/500x200"
            />
          </CardMedia>
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </CardText>
          <CardActions>
            <Mutation
              mutation={COMPLETE_TASK}
              update={this.updateCache}
            >
              {this.completeTaskButton}
            </Mutation>
            <FloatingActionButton>
              <ModeEdit />
            </FloatingActionButton>
            <Mutation
              mutation={REMOVE_TASK}
              update={this.removeFromCache}
            >
              {this.removeTaskButton}
            </Mutation>
          </CardActions>
        </Card>
      </div>
    );
  }
}

const COMPLETE_TASK = gql`
  mutation UpdateTask($is_complete: Boolean, $id: Int!, $name: String!, $list: Int!) {
    updateTask(id: $id, is_complete: $is_complete, name: $name, list: $list) {
      is_complete
      id
    }
  }
`;

const REMOVE_TASK = gql`
  mutation RemoveTask($id: Int!) {
    removeTask(id: $id) {
      id
    }
  }
`;

TaskTile.propTypes = {
  task: PropTypes.object.isRequired,
};

export default TaskTile;
