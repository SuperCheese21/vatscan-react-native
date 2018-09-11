import React, { Component, createRef } from 'react';
import { View } from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';

import BasicData from './BasicData';
import DetailData from './DetailData';

import constants from '../config/constants.json';

export default class InfoPanel extends Component {
    state = {
        panelPosition: constants.panelStates.COLLAPSED
    }

    infoPanel = createRef()

    getPanelPosition = () => {
        return this.state.panelPosition;
    }

    setPanelPosition = position => {
        this.setState({
            panelPosition: position
        });
        this.infoPanel.current.transitionTo({
            toValue: position,
            duration: 250
        });
    }

    adjustPanelPosition = position => {
        const prevState = this.state.panelPosition;
        const { COLLAPSED, EXPANDED, HALF_EXPANDED } = constants.panelStates;

        if (prevState === EXPANDED) {
            if (position > HALF_EXPANDED) {
                this.setPanelPosition(HALF_EXPANDED);
            } else {
                this.setPanelPosition(COLLAPSED);
            }
        } else if (prevState === HALF_EXPANDED) {
            if (position > HALF_EXPANDED) {
                this.setPanelPosition(EXPANDED);
            } else {
                this.setPanelPosition(COLLAPSED);
            }
        }
    }

    render() {
        const top = constants.panelStates.EXPANDED;
        const bottom = constants.panelStates.COLLAPSED;
        return (
            <SlidingUpPanel
                ref={this.infoPanel}
                visible={true}
                showBackdrop={false}
                startCollapsed={true}
                allowMomentum={false}
                draggableRange={{
                    top: top,
                    bottom: bottom
                }}
                onDragEnd={position => this.adjustPanelPosition(position)}
                onRequestClose={() => this.props.removeFocusedClient()}
                height={top - bottom}
            >

                <View style={{ flex: 1 }}>
                    <BasicData data={this.props.basicData} />
                    <DetailData data={this.props.detailData} />
                </View>

            </SlidingUpPanel>
        );
    }
}
