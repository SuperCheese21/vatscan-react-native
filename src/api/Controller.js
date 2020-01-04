import Client from './Client';
import { getProjectedCoords } from './util';

import { mapOverlays as colors } from '../config/colors.json';
import {
  mapOverlays as constants,
  NUM_SIDES_CIRCLE,
} from '../config/constants.json';

export default class Controller extends Client {
  constructor(data, controllerType, center) {
    super(data);

    this.controllerType = controllerType;
    this.frequency = data[4];
    this.facilityType = data[18];
    this.atisMessage = data[35];

    if (center) {
      this.polygon = center.geometry.coordinates[0].map(coords => ({
        latitude: parseFloat(coords[1]),
        longitude: parseFloat(coords[0]),
      }));
    } else {
      this.polygon = [];
      for (let i = 0; i < NUM_SIDES_CIRCLE; i += 1) {
        const bearing = (360 / NUM_SIDES_CIRCLE) * i;
        this.polygon.push(
          getProjectedCoords(this.location, this.radiusM, bearing),
        );
      }
    }
  }

  get typeString() {
    switch (this.controllerType) {
      case 'ATIS':
        return 'ATIS';
      case 'DEL':
        return 'Delivery';
      case 'GND':
        return 'Ground';
      case 'TWR':
        return 'Tower';
      case 'DEP':
        return 'Departure';
      case 'CTR':
      case 'FSS':
        return 'Center';
      case 'APP':
        return 'Approach';
      case 'OBS':
        return 'Observer';
      case 'SUP':
        return 'Supervisor';
      default:
        return 'N/A';
    }
  }

  get radiusM() {
    return constants[this.controllerType].radiusM;
  }

  get strokeColor() {
    return colors[this.controllerType].stroke;
  }

  get fillColor() {
    return colors[this.controllerType].fill;
  }

  get fillColorSelected() {
    return colors[this.controllerType].fillSelected;
  }

  get zIndex() {
    return constants[this.controllerType].zIndex;
  }
}
