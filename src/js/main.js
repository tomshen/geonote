import 'babel-core/polyfill';
import 'fetch';
import Leaflet from 'leaflet';

const $map = document.getElementsByClassName('map')[0];

const map = Leaflet.map($map, {
  center: [40.74, -74.00],
  zoom: 13
});

Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
