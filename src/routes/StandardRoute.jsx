import React, { Fragment, Component } from 'react';
import { graphql } from 'react-apollo';
import { Route } from 'react-router';
import gql from 'graphql-tag';

import Form from '../Form';
import AppBar from '../AppBar';
import CustomDrawer from '../CustomDrawer';

import styles from './StandardRoute.scss'
class StarndardRoute extends Component {
  state = { open: false }

  onRequestChange = open =>
    this.setState({ open });

  handleToggle = () =>
    this.setState({ open: !this.state.open });

  componentWrapper = props => {
    let contentStyle = { ...muiStyles.contentStyle };
    const { component: Component, match } = this.props;
    const { open } = this.state;

    if (open) {
      contentStyle.marginLeft = DRAWER_WIDTH;
    }

    return (
      <Fragment>
        <AppBar
          onLeftIconButtonClick={this.handleToggle}
        />
        <CustomDrawer open={open}/>
        <div style={contentStyle}>
          <Component {...props} drawerOpened={open} />
        </div>
        <Form />
      </Fragment>
    );
  }

  render() {
    const { component, ...props } = this.props;

    return (
      <Route
        {...props}
        component={this.componentWrapper}
      />
    )
  }
}

const DRAWER_WIDTH = 256;
const muiStyles = {
  contentStyle: {
    marginTop: 64,
    transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)',
  }
}

export default StarndardRoute;
