import React from 'react'
import Form from 'react-jsonschema-form'
import fields from 'react-jsonschema-form-field-geolocation'
import { render, cleanup, fireEvent } from 'react-testing-library'
// this add custom jest matchers from jest-dom
import 'jest-dom/extend-expect'
import GeolocationField from './GeolocationField'
import { coordValidation, computeValue } from './utils'

const schema = {
  title: 'Geolocation example',
  type: 'object',
  required: ['title'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'A new task' },
    done: { type: 'boolean', title: 'Done?', default: false },
    position: {
      type: 'object',
      title: 'Position',
      required: ['lat', 'lng'],
      properties: {
        lat: { type: 'number', title: 'Latitude' },
        lng: { type: 'number', title: 'Longitude' },
      },
    },
  },
}

const uiSchema = {
  position: {
    'ui:field': 'geolocation',
  },
}

const formData = {
  title: 'Welcome!',
  position: {
    lat: 51.50853,
    lng: -0.076132,
  },
}

afterEach(cleanup)

describe('GeolocationField', () => {
  it('is truthy', () => {
    expect(GeolocationField).toBeTruthy()
  })
  it('is rendering the field property', () => {
    const { container } = render(
      <Form fields={fields} schema={schema} formData={formData} uiSchema={uiSchema} />
    )
    expect(container.querySelector('#position_lat_field')).toBeVisible()
    expect(container.querySelector('#position_lng_field')).toBeVisible()
  })
  it('can update the field value', done => {
    const spy = jest.fn(({ formData }) => {
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    })
    const { container } = render(
      <Form
        fields={fields}
        schema={schema}
        formData={formData}
        uiSchema={uiSchema}
        onChange={spy}
      />
    )
    expect(container.querySelector('#position_lat_field').getAttribute('value')).toBe('51.50853')
    const field = container.querySelector('#position_lat_field')
    field.value = '10.99998'
    fireEvent.change(field)
    expect(container.querySelector('#position_lat_field').getAttribute('value')).toBe('10.99998')
  })
  it('can not update the field value with improper input', done => {
    const spy = jest.fn()
    const { container } = render(
      <Form
        fields={fields}
        schema={schema}
        formData={formData}
        uiSchema={uiSchema}
        onChange={spy}
      />
    )
    expect(container.querySelector('#position_lat_field').getAttribute('value')).toBe('51.50853')
    const field = container.querySelector('#position_lat_field')
    field.value = '51.50853.'
    fireEvent.change(field)
    expect(container.querySelector('#position_lat_field').getAttribute('value')).toBe('51.50853')
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled()
      done()
    }, 500)
  })
})

describe('utils', () => {
  describe('coordValidation', () => {
    it('should properly validate a coord', () => {
      expect(coordValidation(10.0, 'lat')).toBe(true)
      expect(coordValidation(-30.0, 'lat')).toBe(true)
      expect(coordValidation(170.432, 'lng')).toBe(true)
      expect(coordValidation(-132.0, 'lng')).toBe(true)
    })
    it('should properly disallow wrong coords', () => {
      expect(coordValidation('rrr', 'lat')).toBe(false)
      expect(coordValidation('-90.999', 'lat')).toBe(false)
      expect(coordValidation('100', 'lat')).toBe(false)
      expect(coordValidation('-20000', 'lng')).toBe(false)
      expect(coordValidation('545.343', 'lng')).toBe(false)
    })
  })
  describe('computeValue', () => {
    it('should properly tranform good values', () => {
      expect(computeValue('10', '9', 'lat')).toEqual([10, false])
      expect(computeValue('-89.99999', '88.5656', 'lat')).toEqual([-89.99999, false])
    })
    it('should allow as invalid "in progress" values', () => {
      expect(computeValue('9.', '9', 'lat')).toEqual(['9.', true])
      expect(computeValue('-', '', 'lat')).toEqual(['-', true])
    })
    it('should disallow invalid data', () => {
      expect(computeValue('9.95a', '9.95', 'lat')).toEqual(['9.95', true])
      expect(computeValue('g', '', 'lat')).toEqual(['', true])
    })
  })
})
