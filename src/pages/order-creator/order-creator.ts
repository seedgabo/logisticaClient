import { Component } from "@angular/core";
import { IonicPage, NavParams, ModalController, ViewController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import moment from "moment";
import { ProductSearchPage } from "../product-search/product-search";
@IonicPage()
@Component({
  selector: "page-order-creator",
  templateUrl: "order-creator.html"
})
export class OrderCreatorPage {
  order: any = {
    fecha_pedido: moment()
      .local()
      .toDate()
      .toISOString(),
    tipo: "Residuos Aprovechables",
    estado: "solicitud generada",
    fecha_entrega: null,
    direccion_envio: null,
    user_id: this.api.user.id,
    cliente_id: this.api.user.cliente_id,
    entidad_id: this.api.user.entidad_id,
    items: []
  };
  image = null;
  image2 = null;
  image3 = null;
  loading = false;
  tipos = ["Residuos Aprovechables", "Residuos Peligrosos", "Destrucción", "Residuos Orgánicos"];
  addresses = [];
  editing = true;
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public api: Api, public modal: ModalController) {
    if (this.navParams.get("order")) {
      this.order = Object.assign({}, this.navParams.get("order"));
      console.log(this.order);
      if (this.order.fecha_pedido) {
        this.order.fecha_pedido = moment
          .utc(this.order.fecha_pedido)
          .local()
          .toDate()
          .toISOString();
      }
    }
    if (this.navParams.get("editing")) {
      this.editing = this.navParams.get("editing");
    }
  }

  ionViewDidLoad() {
    this.api.ready.then((user) => {
      this.api.get("clientes/" + this.api.user.cliente_id + "?with[]=addresses").then((data: any) => {
        this.addresses = data.addresses;
        if (this.addresses.length > 0) {
          this.order.direccion_envio = this.addresses[this.addresses.length - 1].address;
        }
      });
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  addAddress() {
    this.api.alert
      .create({
        title: this.api.trans("crud.add") + " " + this.api.trans("literals.address"),
        inputs: [
          {
            type: "text",
            placeholder: this.api.trans("literals.address"),
            value: "",
            name: "address"
          }
        ],
        buttons: [
          this.api.trans("cancel"),
          {
            text: this.api.trans("crud.save"),
            handler: (data) => {
              if (data && data.address.length > 0) {
                this.api.post("addresses", data).then((resp: any) => {
                  this.api.post(`addresses/add-cliente/${resp.id}/${this.api.user.cliente_id}`, {}).then((data) => {
                    this.ionViewDidLoad();
                  });
                });
              }
            }
          }
        ]
      })
      .present();
  }

  async save() {
    this.loading = true;
    var count: any = await this.api.get(`pedidos?where[cliente_id]=${this.api.user.cliente_id}&count=1`).catch((err) => {
      this.loading = false;
    });
    function pad(n, width, z = "0") {
      n = n + "";
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    count = pad(++count, 4);
    var promise;
    var data = {
      numero_pedido: `01/${this.api.user.cliente.document}/0${this.tipos.indexOf(this.order.tipo) + 1}/${count}`,
      direccion_envio: this.order.direccion_envio,
      tipo: this.order.tipo,
      fecha_pedido: moment(this.order.fecha_pedido)
        .local()
        .format("YYYY-MM-DD HH:mm:ss"),
      estado: this.order.estado,
      user_id: this.order.user_id ? this.order.user_id : this.api.user.id,
      entidad_id: this.order.entidad_id,
      cliente_id: this.order.cliente_id,
      items: this.order.items
    };
    if (this.order.id) {
      promise = this.api.put(`pedidos/${this.order.id}`, data);
    } else {
      promise = this.api.post(`pedidos`, data);
    }
    promise
      .then(async (resp) => {
        this.order = resp;
        this.editing = false;
        if (this.image) {
          await this.uploadFile(this.image, resp, "Imagen # 1.jpg");
        }
        if (this.image2) {
          await this.uploadFile(this.image2, resp, "Imagen # 2.jpg");
        }
        if (this.image3) {
          await this.uploadFile(this.image3, resp, "Imagen # 3.jpg");
        }
        this.viewCtrl.dismiss(this.order);
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
        this.api.error(err);
      });
  }

  addItem() {
    var modal = this.modal.create(ProductSearchPage, {});
    modal.present();
    modal.onDidDismiss((data, role) => {
      if (role !== "cancel") {
        console.log(data, role);
        data.cantidad_pedidos = 1;
        this._addItem(data);
      }
    });
  }

  _addItem(item) {
    if (!this.order.items.find((i) => i.id == item.id)) {
      this.order.items.push(item);
    }
  }

  removeItem(i) {
    this.order.items.splice(i, 1);
  }

  total() {
    var total = 0;
    this.order.items.forEach((element) => {
      total += element.cantidad_pedidos + element.precio;
    });
    return total;
  }

  canSave() {
    return this.order.direccion_envio && this.order.tipo && this.order.items && this.order.items.length > 0 && this.order.cliente_id;
  }

  uploadFile(image, item, name = null) {
    if (!name) name = image.name;
    return new Promise((resolve, reject) => {
      var formData, xhr;
      formData = new FormData();
      xhr = new XMLHttpRequest();
      xhr.open("POST", this.api.url + "api/archivo/upload/pedido/" + item.id, true);
      formData.append("file", image, name);
      xhr.onload = () => {
        if (xhr.status == 200) {
          return resolve(JSON.parse(xhr.responseText));
        } else {
          console.error(xhr);
          return reject(xhr);
        }
      };
      xhr.setRequestHeader("Auth-Token", this.api.user.token);

      xhr.send(formData);
    });
  }
}
