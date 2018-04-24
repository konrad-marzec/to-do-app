import React, { Fragment, Component } from 'react';
import { graphql } from 'react-apollo';
import { Route } from 'react-router';
import { debounce } from 'lodash';
import gql from 'graphql-tag';

import Form from '../Form';
import AppBar from '../AppBar';
import CustomDrawer from '../CustomDrawer';

import styles from './StandardRoute.scss'
class StarndardRoute extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      docked: typeof window !== 'undefined' && window.innerWidth > BREAK_POINT,
    };

    this.onResizeDeb = debounce(this.onResize, 16);
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.onResizeDeb)
  }

  componentWillUnmount = () =>
    window.removeEventListener('resize', this.onResizeDeb)

  onRequestChange = open =>
    this.setState({ open });

  onResize = e => {
    const { docked } = this.state;

    if (window.innerWidth < BREAK_POINT && docked) {
      this.setState({ docked: false });
    }

    if (window.innerWidth >= BREAK_POINT && !docked) {
      this.setState({ docked: true });
    }
  }

  handleToggle = () =>
    this.setState({ open: !this.state.open });

  componentWrapper = props => {
    let contentStyle = { ...muiStyles.contentStyle };
    const { component: Component, match } = this.props;
    const { open, docked } = this.state;

    if (open && docked) {
      contentStyle.marginLeft = DRAWER_WIDTH;
    }

    return (
      <Fragment>
        <AppBar
          onLeftIconButtonClick={this.handleToggle}
        />
        <CustomDrawer
          open={open}
          docked={docked}
          onRequestChange={!docked && this.onRequestChange}
        />
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

const BREAK_POINT = 670;
const DRAWER_WIDTH = 256;
const muiStyles = {
  contentStyle: {
    marginTop: 64,
    transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)',
  }
}

export default StarndardRoute;
