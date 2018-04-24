import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import React, { Component, Fragment } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router';
import Dialog from 'material-ui/Dialog';
import { parse } from 'query-string';
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
    formContext: params.id ? 'task' : 'list',
  })

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, dirty: false });
  };

  renderForm = () => {
    const {
      data,
      match,
      listForm,
      location: { search },
    } = this.props;
    const query = parse(search);

    const formProps = {
      data,
      match,
      query,
      onSuccess: this.handleClose,
    }

    return match.params.id && !listForm
      ? <TaskFrom {...formProps} />
      : <ListFrom {...formProps} />
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
  listForm: PropTypes.bool,
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
