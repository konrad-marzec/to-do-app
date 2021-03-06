import TextField from 'material-ui/TextField';
import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import PropTypes from 'prop-types';
import gql from "graphql-tag";

import { TASKS_QUERY } from '../ToDoList'
import { FILTER_KEYS } from '../utils/Enums';

import styles from './TaskForm.scss'
class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      dirty: false,
      ...(props.data ? props.data : {}),
    }
  }

  onNameChange = e =>
    this.setState({ name: e.target.value, dirty: true })

  onSubmit = e => {
    e.preventDefault();
  }

  onSucces = () => {
    this.props.onSuccess && this.props.onSuccess();
  }

  isFormValid = () =>
    !!this.state.name;

  updateTaskCache = () => {
    this.onSucces();
  }

  appendToCache = (cache, { data: { addTask } }) => {
    const { query: { filter, order } } = this.props;
    this.onSucces();

    try {
      const { list } = cache.readQuery({
        query: TASKS_QUERY,
        variables: { id: `${addTask.list.id}`, filter, order }
      });

      const tasks = list.tasks;

      if (FILTER_KEYS.DONE !== filter) {
        tasks.unshift(addTask);
      }

      cache.writeQuery({
        query: TASKS_QUERY,
        variables: { id: `${addTask.list.id}`, filter, order },
        data: {
          list: {
            ...list,
            tasks,
            todos_count: list.todos_count + 1,
          }
        }
      });
    } catch (error) {}
  }

  renderForm = action => {
    const { match: { params: { id } }, data } = this.props;
    const { name, dirty } = this.state;
    const isFormValid = this.isFormValid();

    const hintText = (
      <span className={styles.hintText}>Task</span>
    );
    const floatingLabelText = (
      <span className={styles.label}>Task name</span>
    );

    const errorText = isFormValid || !dirty
      ? null
      : (<span>Task name is required</span>);

    const params = {
      variables: {
        list: id,
        ...(!!data ? data : {}),
        name,
      }
    };

    return (
      <form onSubmit={e => this.onSubmit(e, action(params))}>
        <TextField
          value={name}
          hintText={hintText}
          errorText={errorText}
          onChange={this.onNameChange}
          floatingLabelText={floatingLabelText}
        />
        <input type="submit" value="Submit" className={styles.submitButton}/>
      </form>
    );
  }

  render() {
    const { data } = this.props;

    const mutationProps = !!data
      ? { mutation: UPDATE_TASK, update: this.updateTaskCache }
      : { mutation: CREATE_TASK, update: this.appendToCache }

    return (
      <Mutation {...mutationProps} >
        {this.renderForm}
      </Mutation>
    );
  }
}

const UPDATE_TASK = gql`
  mutation UpdateTask($list: Int!, $name: String!, $id: Int!) {
    updateTask(list: $list, name: $name, id: $id) {
      id
      name
      list {
        id
      }
    }
  }
`

const CREATE_TASK = gql`
  mutation AddTask($list: Int!, $name: String!) {
    addTask(list: $list, name: $name) {
      id
      name
      is_complete
      list {
        id
      }
    }
  }
`

TaskForm.propTypes = {
  match: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  query: PropTypes.object,
};

export default TaskForm;
