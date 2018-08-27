# react-jsonschema-form-field-geolocation

> Geolocation field for react-jsonschema-form

[![NPM](https://img.shields.io/npm/v/react-jsonschema-form-field-geolocation.svg)](https://www.npmjs.com/package/react-jsonschema-form-field-geolocation) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![react-jsonschema-form-field-geolocation Demo](https://raw.githubusercontent.com/bopen/react-jsonschema-form-field-geolocation/master/react-jsonschema-form-field-geolocation.gif)

## Install

```bash
npm install --save react-jsonschema-form-field-geolocation
```

You also need to install a bunch on peer dependencies:

* [ol](https://www.npmjs.com/package/ol) (OpenLayers)
* [ol-geocoder](https://www.npmjs.com/package/ol-geocoder)
* [styled-components](https://www.npmjs.com/package/styled-components)

Plus: you must include required CSS from both *ol* and *ol-geocoder* packages:

```javascript
import 'ol/ol.css'
import 'ol-geocoder/dist/ol-geocoder.min.css'
```

## Usage

### Integrating in the `Form`

Adding new fields to the default JSON schema set requires to use the `fields` prop:

```jsx
import React, { Component } from 'react'
import Form from 'react-jsonschema-form';
import GeolocationField from 'react-jsonschema-form-field-geolocation';

const schema = {
  title: 'Geolocation example',
  type: 'object',
  properties: {
    position: {
      type: 'object',
      title: 'Position',
      required: ['lat', 'lng'],
      properties: {
        lat: { type: 'number', title: 'Latitude' },
        lng: { type: 'number', title: 'Longitude' }
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
    }
  }
};

class App extends Component {
  render () {
    return (
      <Form
        fields={{geolocation: GeolocationField}}
        schema={schema}
        uiSchema={uiSchema}
      />
    )
  }
}
```

If you are already importing 3rd party fields, remember to merge them in a single prop:

```jsx

import otherFields from "other-fields";
import geofields from 'react-jsonschema-form-field-geolocation';

let fields = Object.assign({}, geofields, otherFields);
```

See ["Custom field components" documentation](https://github.com/mozilla-services/react-jsonschema-form#custom-field-components) for more.

### Customization

By providing the (optional) `uiSchema` prop you can customize the widget:

* `zoom` - the default zoom to start from (default is 4)
* `defaultLocation` - a *lat*/*lng* object used for the default map location.
  This is not required if you provide a form value using the standard `formData` object, but you should provide a default map location to display.
* `height` - the map height. Setting an height is required by OpenLayers (with this props, or by CSS)
* `geocoder` settings passed to the `ol-geocoder` instance.
  Default value (see [documentation](https://github.com/jonataswalker/ol-geocoder#new-geocodertype-options) for options defails):
* `showTitle` - default to `true`. Display the field title; default value is commonly OK, but you could like to disable it when using [custom field template](https://github.com/mozilla-services/react-jsonschema-form/#field-template)

  ```javascript
    {
      provider: 'osm',
      placeholder: 'Search for ...',
      targetType: 'glass-button',
      limit: 5,
      keepOpen: false,
      autoComplete: true,
      autoCompleteMinLength: 4,
      preventDefault: true,
    }
  ```

## License

MIT © [bopen](https://github.com/bopen)
