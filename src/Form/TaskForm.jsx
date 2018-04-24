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

  isFormValid = () =>
    !!this.state.name;

  updateCache = (cache, { data: { addTask } }) => {
    const { onSuccess, match: { params } } = this.props;
    onSuccess && onSuccess();

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

  renderForm = (addTask, { data }) => {
    const { match: { params: { id } } } = this.props;
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
        name,
      }
    };

    return (
      <form onSubmit={e => this.onSubmit(e, addTask(params))}>
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
    return (
      <Mutation
        mutation={CREATE_TASK}
        update={this.updateCache}
      >
        {this.renderForm}
      </Mutation>
    );
  }
}

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
