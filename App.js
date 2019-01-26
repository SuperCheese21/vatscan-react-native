import React from 'react';
import { View } from 'react-native';
import { AppLoading, Font } from 'expo';

import StackNavigator from './src/components/navigation/StackNavigator';
import { UPDATE_INTERVAL } from './src/config/constants.json';
import { fetchData, parseClientData } from './src/lib/util/fetch';

export default class App extends React.PureComponent {
    // Initialize component state
    state = {
        fontLoaded: false,
        loading: false,
        clientData: []
    };

    async componentDidMount() {
        // Load fonts and update font loaded state
        await Font.loadAsync({
            'Roboto_Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
            'Roboto_Condensed_Regular': require('./assets/fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf')
        });
        await this.setState({
            fontLoaded: true
        });

        // Pull first data update
        this.updateData();
    }

    updateData = () => {
        // Set loading state and call function to fetch data
        this.setState({ loading: true });
        fetchData()
            .then(data => {
                // Update state with new data
                this.setState({
                    clientData: parseClientData(data),
                    loading: false
                });
                // Set timeout for next data update
                setTimeout(() => {
                    this.updateData();
                }, UPDATE_INTERVAL);
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        // Show app loading screen if font is still being loaded
        if (!this.state.fontLoaded) {
            return ( <AppLoading /> );
        }

        // Otherwise show top-level view
        return (
            <View style={{ flex: 1 }}>
                <StackNavigator
                    screenProps={{
                        clientData: this.state.clientData
                    }}
                />
            </View>
        );
    }
}
