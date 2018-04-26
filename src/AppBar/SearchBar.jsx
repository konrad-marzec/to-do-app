import CloseIcon from 'material-ui/svg-icons/navigation/close';
import SearchIcon from 'material-ui/svg-icons/action/search';
import { Switch, Route } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import { parse, stringify } from 'query-string';
import TextField from 'material-ui/TextField';
import { withRouter } from 'react-router';
import React, { Component } from 'react';
import { throttle, omit } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import styles from './SearchBar.scss';
class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: parse(props.location.search).search || '',
    };

    this.onSubmitThrottle = throttle(this.onSubmit, 2000);
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.match.path !== nextProps.match.path) {
      this.setState({ searchText: '' });
    }
  }

  onChange = e => {
    this.setState({ searchText: e.target.value })
    this.onSubmitThrottle();
  }

  onSubmit = e => {
    e && e.preventDefault();

    const { searchText } = this.state;

    const {
      location: { search },
      history: { replace },
    } = this.props;

    replace({
      search: stringify({
        ...parse(search),
        search: searchText,
      }),
    });
  }

  onFocus = e =>
    this.setState({ focused: true })

  onBlur = e =>
    this.setState({ focused: false })

  clearForm = e => {
    e.preventDefault();

    this.setState({ searchText: '' })
    const {
      location: { search },
      history: { replace },
    } = this.props;

    replace({ search: stringify(omit(parse(search), 'search')) });
  }

  render() {
    const { focused, searchText } = this.state;
    const searchBarClasses = classNames(
      styles.container, {
        [styles.containerFocus]: focused || !!searchText,
      }
    );

    return (
      <div className={searchBarClasses}>
        <form onSubmit={this.onSubmit} className={styles.form}>
          <FlatButton
            onClick={this.onSubmit}
            style={muiStyles.button}
          >
            <SearchIcon />
          </FlatButton>
          <TextField
            hintText="Search"
            value={searchText}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onChange={this.onChange}
            style={muiStyles.container}
            underlineStyle={muiStyles.underlineStyle}
            underlineFocusStyle={muiStyles.underlineStyle}
          />
          <input type="submit" className={styles.submit} />
        </form>
        <FlatButton
          style={muiStyles.button}
          onClick={this.clearForm}
        >
          <CloseIcon />
        </FlatButton>
      </div>
    );
  }
}

const muiStyles = {
  container: {
    width: 210,
  },
  button: {
    height: 48,
    minWidth: 48,
    lineHeight: 1,
  },
  underlineStyle: {
    border: 'none',
  },
  floatingLabelFocusStyle: {
    border: 'none',
  },
};

SearchBar.propTypes = {
  title: PropTypes.string,
};

export default withRouter(SearchBar);
