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

export default class GeolocationField extends PureComponent {
  static propTypes = {
    formData: PropTypes.object,
    schema: PropTypes.object,
    uiSchema: PropTypes.object,
    onChange: PropTypes.func,
    name: PropTypes.string.isRequired,
  }

  static defaultProps = {
    onChange: () => {},
  }

  constructor(props) {
    super(props)
    this.state = { ...props.formData }
  }

  handleUpdateCoords = ({ lat, lng }) => {
    this.setState({
      lat,
      lng,
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
        const [nextVal, invalid] = [...computeValue(rawValue, oldState[name], name)]
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

  render() {
    const { schema, uiSchema, name } = this.props
    const { zoom } = uiSchema
    const { title } = schema
    const { lat = '', lng = '' } = this.state
    const latId = `${name}_lat`
    const lngId = `${name}_lng`
    return (
      <Row className='row'>
        <div className='col-xs-12'>
          <label htmlFor={latId}>{title || name}</label>
        </div>
        <div className='col-xs-12 col-sm-6'>
          <div className='input-group'>
            <span className='input-group-addon' id={latId}>
              Latitude
            </span>
            <input
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
              Longitude
            </span>
            <input
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
            lat={lat}
            lng={lng}
            zoom={zoom}
            onUpdateCoords={this.handleUpdateCoords}
          />
        </div>
      </Row>
    )
  }
}
