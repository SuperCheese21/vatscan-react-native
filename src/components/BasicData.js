import React from 'react';
import { Image, Text, View } from 'react-native';

import styles from '../config/styles';

const BasicData = props => (
    <View style={styles.infoContainerBasic}>
        <View style={styles.infoRow}>
            <Text style={[
                styles.icaoText,
                { marginRight: 6, textAlign: 'right' }
            ]}>
                {props.data.depAirport}
            </Text>
            <Image
                style={styles.fromToIcon}
                source={require('../assets/icons/narrowbody.png')}
            />
            <Text style={[
                styles.icaoText,
                { marginLeft: 6 }
            ]}>
                {props.data.arrAirport}
            </Text>
        </View>

        <View style={{ flexDirection: 'row', height: 20 }}>
            <View style={{ flex: 1 }}>
                <Text style={styles.nameText}>{props.data.name}</Text>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.cidText}>{props.data.id}</Text>
            </View>
        </View>
    </View>
);

export default BasicData;
