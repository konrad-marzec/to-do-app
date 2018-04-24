import TextField from 'material-ui/TextField';
import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import PropTypes from 'prop-types';
import gql from "graphql-tag";

import { TASKS_QUERY } from '../ToDoList'

import styles from './TaskForm.scss'
class TaskForm extends Component {
  state = { dirty: false, name: '' }

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
    const { onSuccess, match: { params } } = this.props;
    this.onSucces();

    try {
      const { list } = cache.readQuery({
        query: TASKS_QUERY,
        variables: { id: `${params.id}` }
      });

      cache.writeQuery({
        query: TASKS_QUERY,
        variables: { id: `${params.id}` },
        data: {
          list: {
            ...list,
            tasks: [addTask, ...list.tasks],
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
debugger;
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
          hintText={hintText}
          errorText={errorText}
          onChange={this.onNameChange}
          floatingLabelText={floatingLabelText}
        /><br />
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
    }
  }
`

const CREATE_TASK = gql`
  mutation AddTask($list: Int!, $name: String!) {
    addTask(list: $list, name: $name) {
      id
      name
      is_complete
    }
  }
`

TaskForm.propTypes = {
  match: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
};

export default TaskForm;
