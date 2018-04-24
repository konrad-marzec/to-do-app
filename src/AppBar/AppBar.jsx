import MaterialAppBar from 'material-ui/AppBar';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchBar from './SearchBar';

class AppBar extends Component {
  render() {
    const { onLeftIconButtonClick } = this.props;
    return (
      <MaterialAppBar
        style={muiStyles.container}
        title="TO DO APP"
        iconElementRight={<SearchBar />}
        onLeftIconButtonClick={onLeftIconButtonClick}
      />
    );
  }
}

const muiStyles = {
  container: {
    position: 'fixed',
    top: 0,
  }
}

AppBar.propTypes = {
  onLeftIconButtonClick: PropTypes.func.isRequired,
};

export default AppBar;
