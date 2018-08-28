import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { computeValue } from './utils'
import Map from './Map'

const Row = styled.div`
  .input-group-addon {
    min-width: 8em;
  }
`

const getDefaults = schema => {
  const defaults = {}
  const values = ['lat', 'lng']
  values.forEach(v => {
    if (
      schema.properties &&
      schema.properties[v] !== undefined &&
      schema.properties[v].default
    ) {
      defaults[v] = schema.properties[v].default
    }
  })
  return defaults
}

export default class GeolocationField extends PureComponent {
  static propTypes = {
    formData: PropTypes.object,
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    onChange: PropTypes.func,
    name: PropTypes.string.isRequired,
  }

  static defaultProps = {
    onChange: () => {},
  }

  state = {
    lat: null,
    lng: null,
  };

  handleUpdateCoords = ({ lat, lng }) => {
    this.setState(oldState => {
      this.props.onChange({ ...oldState, ...{ lat, lng } })
      return {
        lat,
        lng,
      }
    })
  }

  handleKeyPress = evt => {
    if (evt.key === 'Enter') {
      this.map.centerMap()
      evt.preventDefault()
      evt.stopPropagation()
    }
  }

  onChange(name) {
    return event => {
      const rawValue = event.target.value
      this.setState(oldState => {
        const [nextVal, invalid] = [
          ...computeValue(rawValue, oldState[name], name),
        ]
        if (nextVal === oldState[name]) {
          return null
        }
        if (!invalid) {
          this.props.onChange({ ...oldState, ...{ [name]: nextVal } })
        }
        return {
          [name]: nextVal,
        }
      })
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { schema } = props
    let { lat = '', lng = '' } = props.formData
    const defaults = getDefaults(schema)
    if (lat === '' && defaults.lat !== undefined) {
      lat = defaults.lat
    }
    if (lng === '' && defaults.lng !== undefined) {
      lng = defaults.lng
    }
    return { lat, lng }
  }

  render() {
    const { schema, uiSchema, name } = this.props
    const { zoom, defaultLocation, height, showTitle = true } = uiSchema
    const { title, properties = {} } = schema
    const latInfo = properties.lat || {}
    const lngInfo = properties.lng || {}
    const { lat, lng } = this.state
    const latId = `${name}_lat`
    const lngId = `${name}_lng`
    return (
      <Row className='row'>
        {showTitle ? (
          <div className='col-xs-12'>
            <label htmlFor={latId}>{title || name}</label>
          </div>
        ) : (
          ''
        )}
        <div className='col-xs-12 col-sm-6'>
          <div className='input-group'>
            <span className='input-group-addon' id={latId}>
              {latInfo.title || 'Latitude'}
            </span>
            <input
              autoComplete='off'
              className='form-control'
              aria-describedby={latId}
              type='text'
              id={`${latId}_field`}
              value={lat}
              onKeyPress={this.handleKeyPress}
              onChange={this.onChange('lat')}
            />
          </div>
        </div>
        <div className='col-xs-12 col-sm-6'>
          <div className='input-group'>
            <span className='input-group-addon' id={lngId}>
              {lngInfo.title || 'Longitude'}
            </span>
            <input
              autoComplete='off'
              className='form-control'
              aria-describedby={lngId}
              type='text'
              id={`${lngId}_field`}
              value={lng}
              onKeyPress={this.handleKeyPress}
              onChange={this.onChange('lng')}
            />
          </div>
        </div>
        <div className='col-xs-12'>
          <Map
            ref={map => (this.map = map)}
            name={name}
            centerLat={lat || defaultLocation.lat}
            centerLng={lng || defaultLocation.lng}
            lat={lat}
            lng={lng}
            height={height}
            zoom={zoom}
            onUpdateCoords={this.handleUpdateCoords}
          />
        </div>
      </Row>
    )
  }
}
