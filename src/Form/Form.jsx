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
      ...(props.data ? props.data : {}),
      open: false,
    };
  }

  componentWillReceiveProps = nextProps =>
    this.setState({
      ...this.setContext(nextProps.match),
      ...nextProps.data,
    })

  setContext = ({ params }) => ({
    formContext: params.id ? 'task' : 'list',
  })

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, dirty: false });
  };

  renderForm = () => {
    const { match, data } = this.props;

    return match.params.id
      ? <TaskFrom match={match} onSuccess={this.handleClose} data={data} />
      : <ListFrom match={match} onSuccess={this.handleClose} data={data} />
  }

  render() {
    const { formContext } = this.state;
    const { launchButton, data } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
    ];

    const title = data ? `Edit ${formContext}` : `Create ${formContext}`

    return (
      <Fragment>
        {launchButton(this.handleOpen)}
        <Dialog
          open={this.state.open}
          actions={actions}
          title={title}
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
  data: PropTypes.object,
  match: PropTypes.object.isRequired,
};

Form.defaultProps = {
  launchButton: onClick => (
    <FloatingActionButton
      style={muiStyles.button}
      onClick={onClick}
      secondary={true}
    >
      <ContentAdd />
    </FloatingActionButton>
  )
};

export default withRouter(Form);
