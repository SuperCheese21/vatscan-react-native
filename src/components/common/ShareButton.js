import * as Linking from 'expo-linking';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Share } from 'react-native';
import { IconButton } from 'react-native-paper';

import { accent as accentColor } from '../../config/colors.json';

export default class ShareButton extends PureComponent {
  onPress = () => {
    const { callsign } = this.props;
    const url = Linking.makeUrl(`clients/${callsign}`);
    const message = `Check out ${callsign} on VATSCAN!\n\n${url}`;
    Share.share({
      message,
      url,
    });
  };

  render() {
    return (
      <IconButton icon="share" color={accentColor} onPress={this.onPress} />
    );
  }
}

ShareButton.propTypes = {
  callsign: PropTypes.string.isRequired,
};
