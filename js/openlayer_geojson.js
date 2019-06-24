import 'ol/ol.css';
import {Map, View} from 'ol';
import {getCenter} from 'ol/extent.js';
import ImageLayer from 'ol/layer/Image.js';
import Projection from 'ol/proj/Projection.js';
import Static from 'ol/source/ImageStatic.js';



import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Circle from 'ol/geom/Circle.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';

      var image = new CircleStyle({
          radius: 5,
          fill: null,
          stroke: new Stroke({color: 'red', width: 1})
        });

        var styles = {
          'Point': new Style({
            image: image
          }),
          'LineString': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 1
            })
          }),
          'MultiLineString': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 1
            })
          }),
          'MultiPoint': new Style({
            image: image
          }),
          'MultiPolygon': new Style({
            stroke: new Stroke({
              color: 'yellow',
              width: 1
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 0, 0.1)'
            })
          }),
          'Polygon': new Style({
            stroke: new Stroke({
              color: 'blue',
              lineDash: [4],
              width: 3
            }),
            fill: new Fill({
              color: 'rgba(0, 0, 255, 0.1)'
            })
          }),
          'GeometryCollection': new Style({
            stroke: new Stroke({
              color: 'magenta',
              width: 2
            }),
            fill: new Fill({
              color: 'magenta'
            }),
            image: new CircleStyle({
              radius: 10,
              fill: null,
              stroke: new Stroke({
                color: 'magenta'
              })
            })
          }),
          'Circle': new Style({
            stroke: new Stroke({
              color: 'red',
              width: 2
            }),
            fill: new Fill({
              color: 'rgba(255,0,0,0.2)'
            })
          })
        };

        var styleFunction = function(feature) {
          return styles[feature.getGeometry().getType()];
        };

        var geojsonObject = {
          'type': 'FeatureCollection',
          'crs': {
            'type': 'name',
            'properties': {
              'name': 'EPSG:3857'
            }
          },
          'features': [{
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [0, 0]
            }
          }, {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': [[4e6, -2e6], [8e6, 2e6]]
            }
          }, {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': [[4e6, 2e6], [8e6, -2e6]]
            }
          }, {
            'type': 'Feature',
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[[-5e6, -1e6], [-4e6, 1e6], [-3e6, -1e6]]]
            }
          }, {
            'type': 'Feature',
            'geometry': {
              'type': 'MultiLineString',
              'coordinates': [
                [[-1e6, -7.5e5], [-1e6, 7.5e5]],
                [[1e6, -7.5e5], [1e6, 7.5e5]],
                [[-7.5e5, -1e6], [7.5e5, -1e6]],
                [[-7.5e5, 1e6], [7.5e5, 1e6]]
              ]
            }
          }, {
            'type': 'Feature',
            'geometry': {
              'type': 'MultiPolygon',
              'coordinates': [
                [[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6], [-3e6, 6e6]]],
                [[[-2e6, 6e6], [-2e6, 8e6], [0, 8e6], [0, 6e6]]],
                [[[1e6, 6e6], [1e6, 8e6], [3e6, 8e6], [3e6, 6e6]]]
              ]
            }
          }, {
            'type': 'Feature',
            'geometry': {
              'type': 'GeometryCollection',
              'geometries': [{
                'type': 'LineString',
                'coordinates': [[-5e6, -5e6], [0, -5e6]]
              }, {
                'type': 'Point',
                'coordinates': [4e6, -5e6]
              }, {
                'type': 'Polygon',
                'coordinates': [[[1e6, -6e6], [2e6, -4e6], [3e6, -6e6]]]
              }]
            }
          }]
        };

        var vectorSource = new VectorSource({
          features: (new GeoJSON()).readFeatures(geojsonObject)
        });

        vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

        var vectorLayer = new VectorLayer({
          source: vectorSource,
          style: styleFunction
        });


        var extent = [0, 0, 1200, 850];
              var projection = new Projection({
                code: 'xkcd-image',
                units: 'pixels',
                extent: extent
              });

              var map = new Map({
                layers: [
                  new TileLayer({
                    source: new OSM()
                  }),
                  vectorLayer,
                  new ImageLayer({
                    source: new Static({
                      attributions: '© <a href="https://twitter.com/KDMG_tl/">屠竜の王と門の神子</a>',
                      url: 'https://pbs.twimg.com/media/Dqg10LzUcAA2JX7.jpg',
                      projection: projection,
                      imageExtent: extent
                    })
                  }),
                ],
                target: 'map',
                view: new View({
                  projection: projection,
                  center: getCenter(extent),
                  zoom: 2,
                  maxZoom: 8
                })
              });
