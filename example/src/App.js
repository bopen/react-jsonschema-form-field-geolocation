import React, { Component } from "react";
import Form from "react-jsonschema-form";
import GeolocationField from "react-jsonschema-form-field-geolocation";
import cloneDeep from "lodash/cloneDeep";

import "ol/ol.css";
import "ol-geocoder/dist/ol-geocoder.min.css";

const schema1 = {
  title: "Simple geolocation example",
  type: "object",
  required: ["title", "position"],
  properties: {
    title: { type: "string", title: "Title", default: "Hello world" },
    done: { type: "boolean", title: "Done?", default: false },
    position: {
      type: "object",
      title: "Position",
      required: ["lat", "lng"],
      properties: {
        lat: { type: "number", title: "Atlantis latitude", default: 51.50854 },
        lng: { type: "number", title: "Atlantis longitude", default: -0.076133 }
        // lat: { type: 'number', title: 'Atlantis latitude' },
        // lng: { type: 'number', title: 'Atlantis longitude' }
      }
    }
  }
};

const schema2 = cloneDeep(schema1);
schema2.title = "With no default values default but defaultLocation";
schema2.properties.position.properties = {
  lat: { type: "number", title: "Atlantis latitude" },
  lng: { type: "number", title: "Atlantis longitude" }
};

const uiSchema1 = {
  position: {
    "ui:field": "geolocation",
    zoom: 7,
    defaultLocation: {
      lat: 51.50853,
      lng: -0.076132
    },
    height: "40vh"
  }
};

const uiSchema2 = cloneDeep(uiSchema1);

// const formData = {
//   title: 'Welcome!',
//   position: {
//     lat: 51.50853,
//     lng: -0.076132
//   }
// };

class App extends Component {
  state = {
    formData1: {},
    formData2: {},
    eventType: null,
    output: ""
  };

  log = (eventType, store) => ({ formData }) => {
    this.setState({
      [store]: formData,
      eventType
    });
  };

  render() {
    const { eventType } = this.state;
    return (
      <main>
        <div className="well">
          <Form
            fields={{ geolocation: GeolocationField }}
            schema={schema1}
            uiSchema={uiSchema1}
            formData={this.state.formData1}
            noHtml5Validate
            onChange={this.log("change", "formData1")}
            onSubmit={this.log("submit", "formData1")}
            onError={this.log("errors", "formData1")}
          />
          <strong>{eventType}</strong>
          <pre>{JSON.stringify(this.state.formData1, undefined, 2)}</pre>
        </div>
        <div className="well">
          <Form
            fields={{ geolocation: GeolocationField }}
            schema={schema2}
            uiSchema={uiSchema2}
            formData={this.state.formData2}
            noHtml5Validate
            onChange={this.log("change", "formData2")}
            onSubmit={this.log("submit", "formData2")}
            onError={this.log("errors", "formData2")}
          />
          <strong>{eventType}</strong>
          <pre>{JSON.stringify(this.state.formData2, undefined, 2)}</pre>
        </div>
      </main>
    );
  }
}

export default App;
