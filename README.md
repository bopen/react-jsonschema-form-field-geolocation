# react-jsonschema-form-field-geolocation

> Geolocation field for react-jsonschema-form

[![NPM](https://img.shields.io/npm/v/react-jsonschema-form-field-geolocation.svg)](https://www.npmjs.com/package/react-jsonschema-form-field-geolocation) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-jsonschema-form-field-geolocation
```

You also need to install a bunch on peer dependencies:

* [ol](https://www.npmjs.com/package/ol) (OpenLayers)
* [ol-geocoder](https://www.npmjs.com/package/ol-geocoder)
* [styled-components](https://www.npmjs.com/package/styled-components)

## Usage

### Integrating in the `Form`

Adding new fields to the default JSON schema set requires to use the `fields` prop:

```jsx
import React, { Component } from 'react'
import Form from 'react-jsonschema-form';
import fields from 'react-jsonschema-form-field-geolocation';

class App extends Component {
  render () {
    return (
      <Form
        fields={fields}
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

## License

MIT © [bopen](https://github.com/bopen)
