import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './icon.css';
class Icon extends React.PureComponent {
  render() {
    const glyph = this.props.icon;

    if (glyph in glyphsmap) {
      const props = {
        ...this.props,
        className: classNames(`icon-${glyphsmap[glyph]}`, this.props.className),
      };

      return (
        <span {...props} />
      );
    }

    /* eslint no-console: ["error", { allow: ["warn"] }] */
    console.warn('Glyph not found', glyph);
    return (
      <span
        className="icon-info"
      />
    );
  }
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Icon.defaultProps = {
  className: '',
  style: {},
};

export const glyphsmap = {
  mail: 'mail',
  arrow: 'arrow',
  skype: 'skype',
  envelope: 'envelope',
  facebook: 'facebook',
  linkedin: 'linkedin',
};

export default Icon;
