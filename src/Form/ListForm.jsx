import TextField from 'material-ui/TextField';
import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import PropTypes from 'prop-types';
import gql from "graphql-tag";

import { LISTS_QUERY } from '../Home';

import styles from './ListForm.scss'
class ListForm extends Component {
  state = { dirty: false, name: '' }

  onNameChange = e =>
    this.setState({ name: e.target.value, dirty: true })

  onSubmit = e => {
    e.preventDefault();
  }

  isFormValid = () =>
    !!this.state.name;

  updateCache = (cache, { data: { addList } }) => {
    this.props.onSuccess && this.props.onSuccess();
    const { lists } = cache.readQuery({ query: LISTS_QUERY });

    cache.writeQuery({
      query: LISTS_QUERY,
      data: {
        lists: [
          addList,
          ...lists,
        ]
      }
    });
  }

  renderForm = addList => {
    const { match: { params: { id } } } = this.props;
    const { name, dirty } = this.state;
    const isFormValid = this.isFormValid();

    const hintText = (
      <span className={styles.hintText}>List</span>
    );
    const floatingLabelText = (
      <span className={styles.label}>List name</span>
    );

    const errorText = isFormValid || !dirty
      ? null
      : (<span>List name is required</span>);

    const params = {
      variables: {
        list: id,
        name,
      }
    };

    return (
      <form onSubmit={e => this.onSubmit(e, addList(params))}>
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
        mutation={CREATE_LIST}
        update={this.updateCache}
      >
        {this.renderForm}
      </Mutation>
    );
  }
}

const CREATE_LIST = gql`
  mutation AddList($name: String!) {
    addList(name: $name) {
      id
      name
      todos_count
      completedTasksCount
    }
  }
`

ListForm.propTypes = {
  match: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
};

export default ListForm;
