import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Surface } from 'react-native-paper';

import StatsLabel from '../components/StatsLabel';
import StatsRow from '../components/StatsRow';
import colors from '../config/colors.json';

const ClientStatsContainer = ({ client }) => (
    <Surface style={styles.statsContainer}>
        <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{client.name}</Text>
            <View>
                <Text style={{ color: '#898989' }}>{client.id}</Text>
                <Badge
                    style={{
                        backgroundColor: colors.accent,
                        color: 'white'
                    }}
                >
                    {client.rating}
                </Badge>
            </View>
        </View>
        <StatsLabel text={client.type === 'PILOT' ? 'Pilot' : 'ATC'} />
        <StatsRow
            label="Location"
            text={client.latitude + ', ' + client.longitude}
        />
        <StatsRow label="Server" text={client.server} />
        <StatsRow label="Time Connected" text={client.elapsedTimeLogon} />
    </Surface>
);

const styles = StyleSheet.create({
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8
    },
    nameText: {
        flex: 1,
        fontFamily: 'Roboto_Condensed_Regular',
        fontSize: 26
    },
    statsContainer: {
        borderRadius: 10,
        padding: 10,
        elevation: 10,
        margin: 5
    }
});

export default ClientStatsContainer;
