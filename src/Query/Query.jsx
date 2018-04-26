import React, { Component } from 'react';
import { Query } from "react-apollo";
import PropTypes from 'prop-types';

import ContentError from '../utils/ContentLoader/ContentError';
import ContentLoader from '../utils/ContentLoader';

class CustomQuery extends Component {
  renderQueryResult = ({ loading, error, data, refetch, networkStatus }) => {
    if (networkStatus === 4) {
      return "Refetching!";
    }

    if (loading) {
      return (<ContentLoader />);
    }

    if (error) {
      return (
        <ContentError
          text={error.message}
        />
      );
    }

    const { component: QueryComponent } = this.props

    return (
      <QueryComponent
        data={data}
        {...this.props}
      />
    );
  }

  render() {
    const {
      notifyOnNetworkStatusChange,
      fetchPolicy,
      variables,
      query,
      skip,
    } = this.props;

    const queryProps = {
      notifyOnNetworkStatusChange,
      fetchPolicy,
      variables,
      query,
      skip
    };

    return (
      <Query {...queryProps} fetchPolicy="network-only">
        {this.renderQueryResult}
      </Query>
    );
  }
}

CustomQuery.propTypes = {
  notifyOnNetworkStatusChange: PropTypes.bool,
  component: PropTypes.oneOfType([
    PropTypes.func,
    // PropTypes.object,
  ]).isRequired,
  query: PropTypes.object.isRequired,
  fetchPolicy: PropTypes.string,
  variables: PropTypes.object,
  skip: PropTypes.bool,
};

export default CustomQuery;
