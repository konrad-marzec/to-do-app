import TextField from 'material-ui/TextField';
import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import PropTypes from 'prop-types';
import gql from "graphql-tag";

import { LISTS_QUERY } from '../Home';

import styles from './ListForm.scss'
class ListForm extends Component {
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

  updateListCache = () => {
    this.onSucces();
  }

  appendToCache = (cache, { data: { addList } }) => {
    this.props.onSuccess && this.props.onSuccess();
    const { lists } = cache.readQuery({ query: LISTS_QUERY });

    cache.writeQuery({
      query: LISTS_QUERY,
      data: {
        lists: [
          ...lists,
          addList,
        ]
      }
    });
  }

  renderForm = addList => {
    const { match: { params: { id } }, data } = this.props;
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
        ...(data ? data : {} ),
        name,
      }
    };

    return (
      <form onSubmit={e => this.onSubmit(e, addList(params))}>
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
      ? { mutation: UPDATE_LIST, update: this.updateListCache }
      : { mutation: CREATE_LIST, update: this.appendToCache }

    return (
      <Mutation {...mutationProps}>
        {this.renderForm}
      </Mutation>
    );
  }
}

const UPDATE_LIST = gql`
  mutation UpdateList($id: Int!, $name: String!) {
    updateList(id: $id, name: $name) {
      id
      name
    }
  }
`

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
