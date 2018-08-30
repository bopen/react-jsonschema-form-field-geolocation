'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var styled = _interopDefault(require('styled-components'));
var Map = _interopDefault(require('ol/Map'));
var Tile = _interopDefault(require('ol/layer/Tile'));
var VectorLayer = _interopDefault(require('ol/layer/Vector'));
var VectorSource = _interopDefault(require('ol/source/Vector'));
var OSM = _interopDefault(require('ol/source/OSM'));
var View = _interopDefault(require('ol/View'));
var proj = require('ol/proj');
var Style = _interopDefault(require('ol/style/Style'));
var Icon = _interopDefault(require('ol/style/Icon'));
var Feature = _interopDefault(require('ol/Feature'));
var Point = _interopDefault(require('ol/geom/Point'));
var ZoomSlider = _interopDefault(require('ol/control/ZoomSlider'));
var Geocoder = _interopDefault(require('ol-geocoder'));

var coordValidation = function coordValidation(val, coord) {
  switch (coord) {
    case 'lat':
      return val > -90.0 && val < 90.0;
    case 'lng':
      return val > -180.0 && val < 180.0;
    default:
      return false;
  }
};

var computeValue = function computeValue(rawValue, oldValue, coord) {
  if (!rawValue.match(/^-?\d*\.?\d*$/)) {
    return [oldValue, true];
  }
  if (!rawValue) {
    return [undefined, false];
  }
  if (rawValue.endsWith('.')) {
    // Special case for final "."
    return [rawValue, true];
  }
  var nextValue = parseFloat(rawValue);
  if (isNaN(nextValue)) {
    return [rawValue, true];
  }
  if (!coordValidation(nextValue, coord)) {
    return [oldValue, true];
  }
  return [nextValue, false];
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString_1(prefix) + id;
}

var uniqueid = uniqueId;

var img = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%20%20%20%20%3Cpath%20fill%3D%22none%22%20d%3D%22M0%200h24v24H0V0z%22%2F%3E%20%20%20%20%3Cpath%20d%3D%22M12%202C8.14%202%205%205.14%205%209c0%205.25%207%2013%207%2013s7-7.75%207-13c0-3.86-3.14-7-7-7zm4%208h-3v3h-2v-3H8V8h3V5h2v3h3v2z%22%2F%3E%3C%2Fsvg%3E";

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var _templateObject = taggedTemplateLiteral(['\n  margin-top: 1em;\n  margin-bottom: 1em;\n  height: ', ';\n  overflow-y: hidden;\n  // box-shadow: 0px 30px 40px rgba(0,0,0,.1);\n'], ['\n  margin-top: 1em;\n  margin-bottom: 1em;\n  height: ', ';\n  overflow-y: hidden;\n  // box-shadow: 0px 30px 40px rgba(0,0,0,.1);\n']),
    _templateObject2 = taggedTemplateLiteral(['\n  display: block;\n  width: 100%;\n  border: 0;\n  margin: 0;\n  padding: 0;\n  height: ', ';\n  background: linear-gradient(rgba(171, 211, 222, 0.1), rgba(171, 211, 222, 0.9));\n  cursor: s-resize;\n'], ['\n  display: block;\n  width: 100%;\n  border: 0;\n  margin: 0;\n  padding: 0;\n  height: ', ';\n  background: linear-gradient(rgba(171, 211, 222, 0.1), rgba(171, 211, 222, 0.9));\n  cursor: s-resize;\n']),
    _templateObject3 = taggedTemplateLiteral(['\n  cursor: n-resize;\n  bottom: 0;\n  height: ', ';\n  background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.9));\n  position: absolute;\n'], ['\n  cursor: n-resize;\n  bottom: 0;\n  height: ', ';\n  background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.9));\n  position: absolute;\n']),
    _templateObject4 = taggedTemplateLiteral(['\n  height: ', ';\n  cursor: pointer;\n  position: relative\n  top: ', ';\n  ', '\n'], ['\n  height: ', ';\n  cursor: pointer;\n  position: relative\n  top: ', ';\n  ', '\n']);

var zoomslider = new ZoomSlider();

var icon = new Icon({
  src: img,
  // size: [30, 30],
  // imgSize: [30, 30],
  scale: 1.5,
  anchor: [0.5, 0.95]
});
var iconStyle = new Style({
  image: icon
});

// const markers = new Markers('Markers')
// map.addLayer(markers);

var CLOSED_MAP_H = 60;

var MapContainer = styled.div(_templateObject, function (props) {
  return props.expanded ? 'auto' : CLOSED_MAP_H + 'px';
});

var MapCover = styled.button(_templateObject2, function (props) {
  return props.expanded ? 'auto' : CLOSED_MAP_H + 'px';
});

var MapClose = MapCover.extend(_templateObject3, function (props) {
  return props.expanded ? 'auto' : CLOSED_MAP_H / 2 + 'px';
});

var MapArea = styled.div(_templateObject4, function (props) {
  return props.height;
}, function (props) {
  return props.expanded ? '0' : '-' + CLOSED_MAP_H + 'px';
}, function (props) {
  return props.expanded ? '' : 'z-index: -1;';
});

var nop = function nop() {};

var MapSelection = function (_PureComponent) {
  inherits(MapSelection, _PureComponent);

  function MapSelection(props) {
    classCallCheck(this, MapSelection);

    var _this = possibleConstructorReturn(this, (MapSelection.__proto__ || Object.getPrototypeOf(MapSelection)).call(this, props));

    _this.state = {
      mapExpanded: false
    };

    _this.mapAction = function (rawLng, rawLat) {
      var _proj$transform = proj.transform([rawLng, rawLat], 'EPSG:3857', 'EPSG:4326'),
          _proj$transform2 = slicedToArray(_proj$transform, 2),
          lng = _proj$transform2[0],
          lat = _proj$transform2[1];

      _this.props.onUpdateCoords({ lat: lat, lng: lng });
    };

    _this.handleAdressSelection = function (evt) {
      var _evt$coordinate = slicedToArray(evt.coordinate, 2),
          lng = _evt$coordinate[0],
          lat = _evt$coordinate[1];

      _this.mapAction(lng, lat);
      _this.centerMap();
    };

    _this.handleMap = function (ev) {
      _this.setState(function (oldState) {
        return {
          mapExpanded: !oldState.mapExpanded
        };
      });
    };

    _this.handleMapClick = function (evt) {
      var _evt$coordinate2 = slicedToArray(evt.coordinate, 2),
          lng = _evt$coordinate2[0],
          lat = _evt$coordinate2[1];

      _this.mapAction(lng, lat);
    };

    _this.drawPoint = function () {
      var _this$props = _this.props,
          name = _this$props.name,
          lat = _this$props.lat,
          lng = _this$props.lng;

      if (lat === '' && lng === '') {
        return;
      }
      _this.vectorSource.clear();
      var iconFeature = new Feature({
        geometry: new Point(proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857')),
        name: name,
        foo: 1
      });
      _this.vectorSource.addFeature(iconFeature);
    };

    _this.centerMap = function () {
      var _this$props2 = _this.props,
          centerLat = _this$props2.centerLat,
          centerLng = _this$props2.centerLng;

      _this.map.getView().setCenter(proj.transform([centerLng, centerLat], 'EPSG:4326', 'EPSG:3857'));
    };

    _this.geocoder = new Geocoder('nominatim', props.geocoder);
    _this.vectorSource = new VectorSource({
      // create empty vector
    });
    _this.vectorLayer = new VectorLayer({
      source: _this.vectorSource,
      style: iconStyle
    });

    _this.map = null;
    _this.id = 'map-' + props.name + '-' + uniqueid();
    return _this;
  }

  createClass(MapSelection, [{
    key: 'render',
    value: function render() {
      var mapExpanded = this.state.mapExpanded;
      var height = this.props.height;

      return React__default.createElement(
        MapContainer,
        { expanded: mapExpanded },
        mapExpanded ? '' : React__default.createElement(MapCover, { title: 'Expand map', onClick: this.handleMap }),
        React__default.createElement(MapArea, { id: this.id, height: height, expanded: mapExpanded }),
        mapExpanded ? React__default.createElement(MapClose, { title: 'Collpase map', onClick: this.handleMap }) : ''
      );
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.lat !== this.props.lat || prevProps.lng !== this.props.lng) {
        this.drawPoint();
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          centerLat = _props.centerLat,
          centerLng = _props.centerLng,
          zoom = _props.zoom;

      this.map = new Map({
        target: this.id,
        layers: [new Tile({
          source: new OSM()
        }), this.vectorLayer],
        view: new View({
          center: proj.fromLonLat([centerLng, centerLat]),
          zoom: zoom
        })
      });
      this.map.addControl(zoomslider);
      this.geocoder.on('addresschosen', this.handleAdressSelection);
      this.map.addControl(this.geocoder);
      this.map.on('singleclick', this.handleMapClick);
      this.drawPoint();
    }
  }]);
  return MapSelection;
}(React.PureComponent);

MapSelection.propTypes = {
  name: PropTypes.string.isRequired,
  onUpdateCoords: PropTypes.func,
  lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  centerLat: PropTypes.number,
  centerLng: PropTypes.number,
  zoom: PropTypes.number,
  height: PropTypes.string,
  geocoder: PropTypes.object
};
MapSelection.defaultProps = {
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
    preventDefault: true
  }
};

var _templateObject$1 = taggedTemplateLiteral(['\n  .input-group-addon {\n    min-width: 8em;\n  }\n'], ['\n  .input-group-addon {\n    min-width: 8em;\n  }\n']);

var Row = styled.div(_templateObject$1);

// const getDefaults = schema => {
//   const defaults = {}
//   const values = ['lat', 'lng']
//   values.forEach(v => {
//     if (
//       schema.properties &&
//       schema.properties[v] !== undefined &&
//       schema.properties[v].default
//     ) {
//       defaults[v] = schema.properties[v].default
//     }
//   })
//   return defaults
// }

var GeolocationField = function (_PureComponent) {
  inherits(GeolocationField, _PureComponent);

  function GeolocationField() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, GeolocationField);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = GeolocationField.__proto__ || Object.getPrototypeOf(GeolocationField)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      lat: null,
      lng: null
    }, _this.handleUpdateCoords = function (_ref2) {
      var lat = _ref2.lat,
          lng = _ref2.lng;

      _this.setState(function (oldState) {
        _this.props.onChange(_extends({}, oldState, { lat: lat, lng: lng }));
        return {
          lat: lat,
          lng: lng
        };
      });
    }, _this.handleKeyPress = function (evt) {
      if (evt.key === 'Enter') {
        _this.map.centerMap();
        evt.preventDefault();
        evt.stopPropagation();
      }
    }, _this.getErrors = function () {
      var errorSchema = _this.props.errorSchema;

      var errors = {};
      Object.entries(errorSchema).forEach(function (_ref3) {
        var _ref4 = slicedToArray(_ref3, 2),
            k = _ref4[0],
            v = _ref4[1];

        errors[k] = v.__errors;
      });
      return errors;
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(GeolocationField, [{
    key: 'onChange',
    value: function onChange(name) {
      var _this2 = this;

      return function (event) {
        var rawValue = event.target.value;
        _this2.setState(function (oldState) {
          // eslint-disable-next-line no-unused-vars
          var _ref5 = [].concat(toConsumableArray(computeValue(rawValue, oldState[name], name))),
              nextVal = _ref5[0];

          if (nextVal === oldState[name]) {
            return null;
          }
          // if (!invalid) {
          //   this.props.onChange({ ...oldState, ...{ [name]: nextVal } })
          // }
          _this2.props.onChange(_extends({}, oldState, defineProperty({}, name, nextVal)));
          return defineProperty({}, name, nextVal);
        });
      };
    }
  }, {
    key: 'showErrors',
    value: function showErrors(errors) {
      if (!errors || errors.length === 0) {
        return null;
      }
      return React__default.createElement(
        'div',
        null,
        React__default.createElement('p', null),
        React__default.createElement(
          'ul',
          { className: 'error-detail bs-callout bs-callout-info' },
          errors.map(function (err, index) {
            return React__default.createElement(
              'li',
              { key: index, className: 'text-danger' },
              err
            );
          })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          schema = _props.schema,
          uiSchema = _props.uiSchema,
          name = _props.name,
          required = _props.required;
      var zoom = uiSchema.zoom,
          defaultLocation = uiSchema.defaultLocation,
          height = uiSchema.height,
          _uiSchema$showTitle = uiSchema.showTitle,
          showTitle = _uiSchema$showTitle === undefined ? true : _uiSchema$showTitle;
      var title = schema.title,
          _schema$properties = schema.properties,
          properties = _schema$properties === undefined ? {} : _schema$properties;

      var latInfo = properties.lat || {};
      var lngInfo = properties.lng || {};
      var _state = this.state,
          lat = _state.lat,
          lng = _state.lng;

      var latId = name + '_lat';
      var lngId = name + '_lng';

      var errors = this.getErrors();
      var latClassError = errors.lat ? 'has-error' : '';
      var lngClassError = errors.lng ? 'has-error' : '';

      return React__default.createElement(
        Row,
        { className: 'row' },
        showTitle ? React__default.createElement(
          'div',
          { className: 'col-xs-12' },
          React__default.createElement(
            'label',
            { htmlFor: latId },
            title || name,
            required ? React__default.createElement(
              'span',
              { className: 'required' },
              '*'
            ) : ''
          )
        ) : '',
        React__default.createElement(
          'div',
          { className: 'col-xs-12 col-sm-6' },
          React__default.createElement(
            'div',
            { className: 'input-group ' + latClassError },
            React__default.createElement(
              'span',
              { className: 'input-group-addon', id: latId },
              latInfo.title || 'Latitude'
            ),
            React__default.createElement('input', {
              autoComplete: 'off',
              className: 'form-control',
              'aria-describedby': latId,
              type: 'text',
              id: latId + '_field',
              value: lat,
              onKeyPress: this.handleKeyPress,
              onChange: this.onChange('lat')
            })
          ),
          this.showErrors(errors.lat)
        ),
        React__default.createElement(
          'div',
          { className: 'col-xs-12 col-sm-6' },
          React__default.createElement(
            'div',
            { className: 'input-group ' + lngClassError },
            React__default.createElement(
              'span',
              { className: 'input-group-addon', id: lngId },
              lngInfo.title || 'Longitude'
            ),
            React__default.createElement('input', {
              autoComplete: 'off',
              className: 'form-control',
              'aria-describedby': lngId,
              type: 'text',
              id: lngId + '_field',
              value: lng,
              onKeyPress: this.handleKeyPress,
              onChange: this.onChange('lng')
            })
          ),
          this.showErrors(errors.lng)
        ),
        React__default.createElement(
          'div',
          { className: 'col-xs-12' },
          React__default.createElement(MapSelection, {
            ref: function ref(map) {
              return _this3.map = map;
            },
            name: name,
            centerLat: lat || defaultLocation.lat,
            centerLng: lng || defaultLocation.lng,
            lat: lat,
            lng: lng,
            height: height,
            zoom: zoom,
            onUpdateCoords: this.handleUpdateCoords
          })
        )
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(props, state) {
      // const { schema } = props
      var _props$formData = props.formData,
          _props$formData$lat = _props$formData.lat,
          lat = _props$formData$lat === undefined ? '' : _props$formData$lat,
          _props$formData$lng = _props$formData.lng,
          lng = _props$formData$lng === undefined ? '' : _props$formData$lng;
      // const defaults = getDefaults(schema)
      // if (lat === '' && defaults.lat !== undefined) {
      //   lat = defaults.lat
      // }
      // if (lng === '' && defaults.lng !== undefined) {
      //   lng = defaults.lng
      // }

      return { lat: lat, lng: lng };
    }
  }]);
  return GeolocationField;
}(React.PureComponent);

GeolocationField.propTypes = {
  formData: PropTypes.object,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  errorSchema: PropTypes.object
};
GeolocationField.defaultProps = {
  onChange: function onChange() {},
  required: false
};

module.exports = GeolocationField;
//# sourceMappingURL=index.js.map
