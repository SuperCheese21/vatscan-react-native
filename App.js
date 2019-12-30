import { AppLoading, Linking } from 'expo';
import * as Font from 'expo-font';
import React, { PureComponent } from 'react';
import { Alert, Animated, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-navigation';

import FetchManager from './src/api/FetchManager';
import StackNavigator from './src/components/navigation/StackNavigator';
import {
  panelStates,
  panelTransitionDuration,
  UPDATE_INTERVAL,
} from './src/config/constants.json';

export default class App extends PureComponent {
  // Initialize component state and fetch manager
  state = {
    fontLoaded: false,
    loading: false,
    clients: [],
    focusedClient: {},
    panelPosition: new Animated.Value(panelStates.COLLAPSED),
  };

  fetchManager = new FetchManager();

  async componentDidMount() {
    // Load fonts and update font loaded state
    /* eslint-disable global-require */
    await Font.loadAsync({
      Roboto_Regular: require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
      Roboto_Condensed_Regular: require('./assets/fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf'),
      Roboto_Mono: require('./assets/fonts/Roboto_Mono/RobotoMono-Regular.ttf'),
    });
    /* eslint-enable global-require */

    this.setState({ fontLoaded: true });

    // Fix status bar height
    if (Platform.OS === 'android') {
      SafeAreaView.setStatusBarHeight(0);
    }

    // Automatically pull data update when internet connection is changed
    NetInfo.addEventListener(() => {
      this.updateData(true);
    });
  }

  setFocusedClient = client => {
    if (client.type === 'PILOT') {
      this.setPanelPosition(panelStates.EXPANDED_PILOT);
    } else if (client.type === 'ATC') {
      this.setPanelPosition(panelStates.EXPANDED_ATC);
    }
    this.setState({ focusedClient: client });
  };

  setPanelPosition(position) {
    // Animate info panel position change
    const { panelPosition } = this.state;
    Animated.timing(panelPosition, {
      toValue: position,
      duration: panelTransitionDuration,
      useNativeDriver: true,
    }).start();
  }

  updateData = async isInitialFetch => {
    this.setState({ loading: true });

    // Check internet connection and alert if there is no connection
    const connectionInfo = await NetInfo.fetch();
    if (connectionInfo.type === 'none' || connectionInfo.type === 'unknown') {
      this.setState({ loading: false });
      Alert.alert(
        'No internet connection',
        'Connect to the internet to update data',
      );
      return;
    }

    // Fetch data
    const clients = await this.fetchManager.fetchData(isInitialFetch);

    // Update state with new client data
    this.handleUpdatedData(clients);

    // Clear existing timeout
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // Set timeout for next data update
    this.timer = setTimeout(this.updateData, UPDATE_INTERVAL);
  };

  collapsePanel = () => {
    // Collapse panel and remove focused client
    this.setPanelPosition(panelStates.COLLAPSED);
    this.setState({ focusedClient: {} });

    return true;
  };

  handleUpdatedData(clients) {
    const {
      focusedClient: { callsign: focusedCallsign },
    } = this.state;

    const focusedClient =
      clients.find(client => client.callsign === focusedCallsign) || {};

    // Update state with new data
    this.setState({
      loading: false,
      clients,
      focusedClient,
    });
  }

  render() {
    const {
      fontLoaded,
      loading,
      clients,
      focusedClient,
      panelPosition,
    } = this.state;

    // Show app loading screen if font is still being loaded
    if (!fontLoaded) {
      return <AppLoading />;
    }

    // Otherwise show top-level view
    return (
      <StackNavigator
        uriPrefix={Linking.makeUrl('/')}
        screenProps={{
          loading,
          clients,
          focusedClient,
          panelPosition,
          refresh: this.updateData,
          setFocusedClient: this.setFocusedClient,
          collapsePanel: this.collapsePanel,
        }}
      />
    );
  }
}
