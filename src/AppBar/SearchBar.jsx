import { Switch, Route } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import { withRouter } from 'react-router';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

class SearchBar extends Component {
  state = {}

  onChange = e =>
    this.setState({ searchText: e.target.value })

  onSubmit = e => {
    e.preventDefault();

  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <TextField
            hintText="Search"
            onChange={this.onChange}
            underlineStyle={muiStyles.underlineStyle}
            underlineFocusStyle={muiStyles.underlineStyle}
          />
        </form>
      </div>
    );
  }
}

const muiStyles = {
  underlineStyle: {
    borderColor: 'grey',
  },
  floatingLabelFocusStyle: {
    color: 'black',
  },
};

SearchBar.propTypes = {
  title: PropTypes.string,
};

export default withRouter(SearchBar);
