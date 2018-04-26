import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import MaterialAppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import SearchBar from './SearchBar';

import styles from './AppBar.scss';
class AppBar extends Component {
  renderRightMenu = () => (
    <div className={styles.rightMenu}>
      <FlatButton
        onClick={this.props.onLeftIconButtonClick}
        style={muiStyles.menuButton}
      >
        <MenuIcon />
      </FlatButton>
      <Link to="/" className={styles.logo}>
        TO DO App
      </Link>
    </div>
  )

  render() {
    return (
      <MaterialAppBar
        showMenuIconButton={false}
        style={muiStyles.container}
        className={styles.container}
        title={this.renderRightMenu()}
        iconElementRight={<SearchBar />}
        iconStyleLeft={muiStyles.iconStyleLeft}
        iconStyleRight={muiStyles.iconStyleLeft}
      />
    );
  }
}

const muiStyles = {
  menuButton: {
    paddingTop: 4,
  },
  iconStyleLeft: {
    marginTop: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    position: 'fixed',
    display: 'flex',
    top: 0,
  }
}

AppBar.propTypes = {
  onLeftIconButtonClick: PropTypes.func.isRequired,
};

export default AppBar;
