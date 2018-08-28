import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import GeolocationField from 'react-jsonschema-form-field-geolocation';

import 'ol/ol.css'
import 'ol-geocoder/dist/ol-geocoder.min.css'

const schema = {
  title: 'Geolocation example',
  type: 'object',
  required: ['title', 'position'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'A new task' },
    done: { type: 'boolean', title: 'Done?', default: false },
    position: {
      type: 'object',
      title: 'Position',
      required: ['lat', 'lng'],
      properties: {
        lat: { type: 'number', title: 'Atlantis latitude', default: 51.50854 },
        lng: { type: 'number', title: 'Atlantis longitude', default: -0.076133 }
      }
    }
  }
};

const uiSchema = {
  position: {
    'ui:field': 'geolocation',
    zoom: 7,
    defaultLocation: {
      lat: 51.50853,
      lng: -0.076132
    },
    height: '40vh',
  }
};

const formData = {
  title: 'Welcome!',
  // position: {
  //   lat: 51.50853,
  //   lng: -0.076132
  // }
};

class App extends Component {
  state = {
    formData,
    eventType: null,
    output: ''
  };

  log = eventType => ({ formData }) => {
    this.setState({
      formData,
      eventType
    });
  };

  onChange = ({ formData }) => {
    this.setState({
      formData,
      eventType: 'change'
    });
  };

  render() {
    const { eventType } = this.state;
    return (
      <main>
        <Form
          fields={{geolocation: GeolocationField}}
          schema={schema}
          formData={this.state.formData}
          uiSchema={uiSchema}
          noHtml5Validate
          onChange={this.log('change')}
          onSubmit={this.log('submit')}
          onError={this.log('errors')}
        />
        <strong>{eventType}</strong>
        <pre>{JSON.stringify(this.state.formData, undefined, 2)}</pre>
      </main>
    );
  }
}

export default App;
