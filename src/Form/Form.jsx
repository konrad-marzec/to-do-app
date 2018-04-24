import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import React, { Component, Fragment } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';

import TaskFrom from './TaskForm';
import ListFrom from './ListForm';

import styles from './Form.scss';
class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.setContext(props.match),
      open: false,
    };
  }

  componentWillReceiveProps = nextProps =>
    this.setState(this.setContext(nextProps.match))

  setContext = ({ params }) => ({
    formContext: params.id? 'task' : 'list',
  })

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, dirty: false });
  };

  renderForm = () => {
    const { match } = this.props;

    return match.params.id
      ? <TaskFrom match={match} onSuccess={this.handleClose} />
      : <ListFrom match={match} onSuccess={this.handleClose} />
  }

  render() {
    const { formContext } = this.state;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
    ];

    return (
      <Fragment>
        <FloatingActionButton
          onClick={this.handleOpen}
          style={muiStyles.button}
          secondary={true}
        >
          <ContentAdd />
        </FloatingActionButton>
        <Dialog
          title={`Create new ${formContext}`}
          open={this.state.open}
          actions={actions}
          modal={true}
        >
          {this.renderForm()}
        </Dialog>
      </Fragment>
    );
  }
}

const muiStyles = {
  button: {
    position: 'fixed',
    bottom: '5rem',
    right: '6rem',
  }
}

Form.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(Form);
