import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Api } from "../../providers/api/api";
import L from "leaflet";
import polyline from "@mapbox/polyline";
import { Geolocation } from "@ionic-native/geolocation";

@IonicPage()
@Component({
  selector: "page-order",
  templateUrl: "order.html"
})
export class OrderPage {
  pedido = null;
  location = {
    address: "Bogota, Colombia",
    latitude: 4.710988599999999,
    longitude: -74.072092
  };
  map = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public geolocation: Geolocation) {
    this.pedido = this.navParams.get("order");
    console.log(this.pedido);
    this.location = Object.assign(this.location, this.pedido.location);
    if (this.pedido.direccion_destino) {
      this.location.address = this.pedido.direccion_destino;
    }
  }

  async getRoute() {
    navigator.geolocation.getCurrentPosition(
      async (loc) => {
        var coordinates = `${loc.coords.longitude},${loc.coords.latitude};${this.location.longitude},${this.location.latitude}`;
        var response = await fetch(`http://router.project-osrm.org/route/v1/driving/${coordinates}?alternatives=true&annotations=true`);
        var data = await response.json();
        this.addPath(loc, data.routes[0].geometry);
      },
      () => {
        this.geolocation.getCurrentPosition().then(async (loc) => {
          var coordinates = `${loc.coords.longitude},${loc.coords.latitude};${this.location.longitude},${this.location.latitude}`;
          var response = await fetch(`http://router.project-osrm.org/route/v1/driving/${coordinates}?alternatives=true&annotations=true`);
          var data = await response.json();
          this.addPath(loc, data.routes[0].geometry);
        });
      }
    );
  }

  addPath(loc, geometry) {
    var latlngs = polyline.decode(geometry);
    var poly = L.polyline(latlngs);
    poly.addTo(this.map);
    this.map.fitBounds(poly.getBounds(), { padding: [50, 50] });

    var icon = L.divIcon({
      className: "pin-icon-container",
      iconSize: [50, 50],
      html: `<div class='pin-icon'>
          <i class="fas fa-map-marker" aria-hidden="true"></i>
        </div>`
    });
    L.marker([loc.coords.latitude, loc.coords.longitude], { icon: icon }).addTo(this.map);
  }

  ionViewDidLoad() {
    if (!this.location) {
      return;
    }
    this.initMap();
    this.getRoute();
  }

  initMap() {
    this.map = L.map("map").setView([this.location.latitude, this.location.longitude], 13);

    L.tileLayer("https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}", {
      attribution:
        'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(this.map);
    L.marker([this.location.latitude, this.location.longitude]).addTo(this.map);
  }

  downloadFile(archivo) {
    window.open(archivo.url, "_system");
  }

  openMaps() {
    var label = encodeURI(this.location.address); // encode the label!
    window.open("geo:0,0?q=" + this.location.latitude + "," + this.location.longitude + "(" + label + ")", "_system");
  }
}
