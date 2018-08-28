import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Map from 'ol/Map'
import Tile from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import View from 'ol/View'
import * as proj from 'ol/proj'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import ZoomSlider from 'ol/control/ZoomSlider'

import Geocoder from 'ol-geocoder'

import img from './location.svg'

const zoomslider = new ZoomSlider()

const icon = new Icon({
  src: img,
  // size: [30, 30],
  // imgSize: [30, 30],
  scale: 1.5,
  anchor: [0.5, 0.95],
})
const iconStyle = new Style({
  image: icon,
})

// const markers = new Markers('Markers')
// map.addLayer(markers);

const CLOSED_MAP_H = 60

const MapContainer = styled.div`
  margin-top: 1em;
  margin-bottom: 1em;
  height: ${props => (props.expanded ? 'auto' : `${CLOSED_MAP_H}px`)};
  overflow-y: hidden;
  // box-shadow: 0px 30px 40px rgba(0,0,0,.1);
`

const MapCover = styled.button`
  display: block;
  width: 100%;
  border: 0;
  margin: 0;
  padding: 0;
  height: ${props => (props.expanded ? 'auto' : `${CLOSED_MAP_H}px`)};
  background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 1));
  cursor: s-resize;
`

const MapClose = MapCover.extend`
  cursor: n-resize;
  bottom: 0;
  height: ${props => (props.expanded ? 'auto' : `${CLOSED_MAP_H / 2}px`)};
  position: absolute;
`

const MapArea = styled.div`
  height: ${props => props.height};
  cursor: pointer;
  position: relative
  top: ${props => (props.expanded ? '0' : `-${CLOSED_MAP_H}px`)};
  ${props => (props.expanded ? '' : 'z-index: -1;')}
`

const nop = () => {}

class MapSelection extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onUpdateCoords: PropTypes.func,
    lat: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    lng: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    centerLat: PropTypes.number,
    centerLng: PropTypes.number,
    zoom: PropTypes.number,
    height: PropTypes.string,
    geocoder: PropTypes.object,
  }

  static defaultProps = {
    onUpdateCoords: nop,
    zoom: 4,
    height: '60vh',
    geocoder: {
      provider: 'osm',
      placeholder: 'Search for ...',
      targetType: 'glass-button',
      limit: 5,
      keepOpen: false,
      autoComplete: true,
      autoCompleteMinLength: 4,
      preventDefault: true,
    },
  }

  state = {
    mapExpanded: false,
  }

  constructor(props) {
    super(props)
    this.geocoder = new Geocoder('nominatim', props.geocoder)
    this.vectorSource = new VectorSource({
      // create empty vector
    })
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: iconStyle,
    })

    this.map = null
    this.id = `map_${props.name}`
  }

  mapAction = (rawLng, rawLat) => {
    const [lng, lat] = proj.transform([rawLng, rawLat], 'EPSG:3857', 'EPSG:4326')
    this.props.onUpdateCoords({ lat, lng })
  }

  handleAdressSelection = evt => {
    const [lng, lat] = evt.coordinate
    this.mapAction(lng, lat)
    this.centerMap()
  }

  handleMap = ev => {
    this.setState(oldState => ({
      mapExpanded: !oldState.mapExpanded,
    }))
  }

  handleMapClick = evt => {
    const [lng, lat] = evt.coordinate
    this.mapAction(lng, lat)
  }

  drawPoint = () => {
    const { name, lat, lng } = this.props
    if (lat === '' && lng === '') {
      return
    }
    this.vectorSource.clear()
    const iconFeature = new Feature({
      geometry: new Point(proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857')),
      name,
      foo: 1,
    })
    this.vectorSource.addFeature(iconFeature)
  }

  centerMap = () => {
    const { centerLat, centerLng } = this.props
    this.map.getView().setCenter(proj.transform([centerLng, centerLat], 'EPSG:4326', 'EPSG:3857'))
  }

  render() {
    const { mapExpanded } = this.state
    const { height } = this.props
    return (
      <MapContainer expanded={mapExpanded}>
        {mapExpanded ? '' : <MapCover title='Expand map' onClick={this.handleMap} />}
        <MapArea id={this.id} height={height} expanded={mapExpanded} />
        {mapExpanded ? <MapClose title='Collpase map' onClick={this.handleMap} /> : ''}
      </MapContainer>
    )
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lat !== this.props.lat || prevProps.lng !== this.props.lng) {
      this.drawPoint()
    }
  }

  componentDidMount() {
    const { centerLat, centerLng, zoom } = this.props
    this.map = new Map({
      target: this.id,
      layers: [
        new Tile({
          source: new OSM(),
        }),
        this.vectorLayer,
      ],
      view: new View({
        center: proj.fromLonLat([centerLng, centerLat]),
        zoom: zoom,
      }),
    })
    this.map.addControl(zoomslider)
    this.geocoder.on('addresschosen', this.handleAdressSelection)
    this.map.addControl(this.geocoder)
    this.map.on('singleclick', this.handleMapClick)
    this.drawPoint()
  }
}

export default MapSelection
