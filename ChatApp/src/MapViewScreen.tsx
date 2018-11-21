import * as React from 'react'
import { Component } from 'react'

// The type definitions for MapView have not been created.
declare const MapView: any

export class MapViewScreen extends Component {
  public static navigationOptions = {
    title: 'MapView'
  }

  public render() {
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 55.6838499,
          latitudeDelta: 0.1,
          longitude: 12.5630238,
          longitudeDelta: 0.1
        }}
      />
    )
  }
}