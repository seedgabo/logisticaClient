import { Component } from "@angular/core";
import { IonicPage, NavParams, ModalController, ViewController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import moment from "moment";
import { ProductSearchPage } from "../product-search/product-search";
@IonicPage()
@Component({
  selector: "page-order-editor",
  templateUrl: "order-editor.html"
})
export class OrderEditorPage {
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
  signature = false;
  loading = false;
  tipos = ["Residuos Aprovechables", "Residuos Peligrosos", "Destrucción", "Residuos Orgánicos"];
  addresses = [];
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public modal: ModalController, public api: Api) {
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
  }
  ionViewDidLoad() {
    this.api.ready.then((user) => {
      this.api.get("clientes/" + this.order.cliente_id + "?with[]=addresses").then((data: any) => {
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

  async save() {
    this.loading = true;
    var promise;
    var data = {
      direccion_envio: this.order.direccion_envio,
      tipo: this.order.tipo,
      estado: this.order.estado,
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
        if (this.signature) {
          await this.uploadFile(this.dataURItoBlob(this.signature), resp, "Firma Conductor.jpg");
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
    this.order.items.push(item);
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
  
  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], {type: mimeString});


}
}
