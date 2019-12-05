import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { computeValue } from './utils';
import Map from './Map';

const Row = styled.div`
  .input-group-addon {
    min-width: 8em;
  }
`;

const getDefaults = schema => {
  const defaults = {};
  const values = ['lat', 'lng'];
  values.forEach(v => {
    if (
      schema.properties &&
      schema.properties[v] !== undefined &&
      schema.properties[v].default
    ) {
      defaults[v] = schema.properties[v].default;
    } else {
      defaults[v] = undefined;
    }
  });
  return defaults;
};

export default class GeolocationField extends PureComponent {
  static propTypes = {
    // formData: PropTypes.object,
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    onChange: PropTypes.func,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    errorSchema: PropTypes.object,
  };

  static defaultProps = {
    onChange: () => {},
    required: false,
  };

  constructor(props) {
    super(props);
    this.state = getDefaults(props.schema);
  }

  handleUpdateCoords = ({ lat, lng }) => {
    this.setState(oldState => {
      this.props.onChange({ ...oldState, ...{ lat, lng } });
      return {
        lat,
        lng,
      };
    });
  };

  handleKeyPress = evt => {
    if (evt.key === 'Enter') {
      this.map.centerMap();
      evt.preventDefault();
      evt.stopPropagation();
    }
  };

  onChange(name) {
    return event => {
      const rawValue = event.target.value;
      this.setState(oldState => {
        // eslint-disable-next-line no-unused-vars
        const [nextVal, invalid] = [
          ...computeValue(rawValue, oldState[name], name),
        ];
        if (nextVal === oldState[name]) {
          return null;
        }
        // if (!invalid) {
        //   this.props.onChange({ ...oldState, ...{ [name]: nextVal } })
        // }
        this.props.onChange({ ...oldState, ...{ [name]: nextVal } });
        return {
          [name]: nextVal,
        };
      });
    };
  }

  getErrors = () => {
    const { errorSchema } = this.props;
    const errors = {};
    Object.entries(errorSchema).forEach(([k, v]) => {
      errors[k] = v.__errors;
    });
    return errors;
  };

  showErrors(errors) {
    if (!errors || errors.length === 0) {
      return null;
    }
    return (
      <div>
        <p />
        <ul className='error-detail bs-callout bs-callout-info'>
          {errors.map((err, index) => (
            <li key={index} className='text-danger'>
              {err}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    const { schema, uiSchema, name, required } = this.props;
    const { zoom, defaultLocation, height, showTitle = true } = uiSchema;
    const { title, properties = {} } = schema;
    const latInfo = properties.lat || {};
    const lngInfo = properties.lng || {};
    const { lat, lng } = this.state;
    const latId = `${name}_lat`;
    const lngId = `${name}_lng`;

    const errors = this.getErrors();
    const latClassError = errors.lat ? 'has-error' : '';
    const lngClassError = errors.lng ? 'has-error' : '';

    return (
      <Row className='row'>
        {showTitle ? (
          <div className='col-xs-12'>
            <label htmlFor={latId}>
              {title || name}
              {required ? <span className='required'>*</span> : ''}
            </label>
          </div>
        ) : (
          ''
        )}
        <div className='col-xs-12 col-sm-6'>
          <div className={`input-group ${latClassError}`}>
            <span className='input-group-addon' id={latId}>
              {latInfo.title || 'Latitude'}
            </span>
            <input
              autoComplete='off'
              className='form-control'
              aria-describedby={latId}
              type='text'
              id={`${latId}_field`}
              value={lat || ''}
              onKeyPress={this.handleKeyPress}
              onChange={this.onChange('lat')}
            />
          </div>
          {this.showErrors(errors.lat)}
        </div>
        <div className='col-xs-12 col-sm-6'>
          <div className={`input-group ${lngClassError}`}>
            <span className='input-group-addon' id={lngId}>
              {lngInfo.title || 'Longitude'}
            </span>
            <input
              autoComplete='off'
              className='form-control'
              aria-describedby={lngId}
              type='text'
              id={`${lngId}_field`}
              value={lng || ''}
              onKeyPress={this.handleKeyPress}
              onChange={this.onChange('lng')}
            />
          </div>
          {this.showErrors(errors.lng)}
        </div>
        <div className='col-xs-12'>
          <Map
            ref={map => (this.map = map)}
            name={name}
            centerLat={
              lat && typeof lat === 'number' ? lat : defaultLocation.lat
            }
            centerLng={
              lng && typeof lng === 'number' ? lng : defaultLocation.lng
            }
            lat={lat}
            lng={lng}
            height={height}
            zoom={zoom}
            onUpdateCoords={this.handleUpdateCoords}
          />
        </div>
      </Row>
    );
  }
}
