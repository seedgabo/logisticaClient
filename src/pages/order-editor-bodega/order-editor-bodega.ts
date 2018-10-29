import { Component } from "@angular/core";
import { IonicPage, NavParams, ViewController, ModalController, AlertController } from "ionic-angular";
import moment from "moment";
import { Api } from "../../providers/api/api";
import { ProductSearchPage } from "../product-search/product-search";
@IonicPage()
@Component({
  selector: "page-order-editor-bodega",
  templateUrl: "order-editor-bodega.html"
})
export class OrderEditorBodegaPage {
  order: any = {
    fecha_pedido: moment()
      .local()
      .toDate()
      .toISOString(),
    tipo: "Residuos Aprovechables",
    estado: "solicitud en bodega",
    fecha_entrega: null,
    direccion_envio: "",
    user_id: this.api.user.id,
    cliente_id: this.api.user.cliente_id,
    entidad_id: this.api.user.entidad_id,
    items: []
  };
  signature = false;
  signature2 = false;
  loading = false;
  tipos = ["Residuos Aprovechables", "Residuos Peligrosos", "Destrucción", "Residuos Orgánicos"];
  bodega = null;
  make_entry = true;
  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public modal: ModalController,
    public alert: AlertController,
    public api: Api
  ) {
    if (this.navParams.get("order")) {
      this.order = Object.assign({}, this.navParams.get("order"));
      if (this.order.fecha_pedido) {
        this.order.fecha_pedido = moment
          .utc(this.order.fecha_pedido)
          .local()
          .toDate()
          .toISOString();
      }
      if (this.order.fecha_envio) {
        this.order.fecha_envio = moment
          .utc(this.order.fecha_envio)
          .local()
          .toDate()
          .toISOString();
      }
    }
    this.api.load("clientes");
    this.api.load("inventarios");
    this.api.load("bodegas?scope[byuser]=1");
  }

  ionViewDidLoad() {
    this.order.items = this.order.items.map((item) => {
      item.cantidad_despachado = item.cantidad_pedidos;
      return item;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async save() {
    function pad(n, width, z = "0") {
      n = n + "";
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    this.loading = true;
    var promise;
    var data: any = {
      fecha_entrega: moment()
        .local()
        .format("YYYY-MM-DD HH:mm:ss"),
      direccion_envio: this.bodega && this.bodega.location ? this.bodega.location.address : "" + this.bodega.direccion_envio,
      tipo: this.order.tipo,
      estado: "solicitud en bodega",
      cliente_id: this.order.cliente_id,
      entidad_id: this.order.entidad_id,
      bodega_id: this.bodega.id,
      bodeguero_id: this.api.user.id,
      pedido_id: this.order.pedido_id,
      items: this.order.items
    };
    if (this.order.id) {
      promise = this.api.put(`pedidos/${this.order.id}`, data);
    } else {
      var count: any = await this.api.get(`pedidos?where[cliente_id]=${data.cliente_id}&count=1`).catch((err) => {
        this.loading = false;
      });
      count = pad(++count, 4);
      (data.numero_pedido = `01/${this.api.objects.clientes.collection[data.cliente_id].document}/0${this.tipos.indexOf(this.order.tipo) +
        1}/${count}`),
        (promise = this.api.post(`pedidos`, data));
    }
    promise
      .then(async (resp) => {
        this.order = resp;
        if (this.signature) {
          await this.uploadFile(this.dataURItoBlob(this.signature), resp, "Firma Personal Planta.jpg");
        }
        if (this.signature2) {
          await this.uploadFile(this.dataURItoBlob(this.signature2), resp, "Firma Conductor en Bodega.jpg");
        }
        if (this.make_entry) {
          await this.makeEntryToBodega();
        }
        await this.api.post(`pedidos/${this.order.id}/order-stored-mail`, {});
        this.viewCtrl.dismiss(this.order);
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
        this.api.error(err);
      });
  }

  editItem(item) {
    this.alert
      .create({
        title: "Cambiar Cantidades | " + item.name,
        subTitle: "Recogidos en Cliente: " + item.cantidad_despachado,
        inputs: [
          {
            type: "number",
            name: "cantidad_pedidos",
            placeholder: this.api.trans("literals.quantity"),
            min: 1,
            value: item.cantidad_pedidos,
            label: this.api.trans("literals.quantity")
          }
        ],
        buttons: [
          this.api.trans("crud.cancel"),
          {
            text: this.api.trans("literals.ok"),
            handler: (data) => {
              if (data.cantidad_pedidos) {
                item.cantidad_pedidos = data.cantidad_pedidos;
              }
            }
          }
        ]
      })
      .present();
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
    if (!this.order.items.find((i) => i.id == item.id || item.id == i.producto_id)) {
      this.order.items.push(item);
    }
  }

  removeItem(i) {
    this.order.items.splice(i, 1);
  }

  diff(item) {
    return (Math.abs(item.cantidad_despachado - item.cantidad_pedidos) / item.cantidad_despachado) * 100;
  }

  total() {
    var total = 0;
    this.order.items.forEach((element) => {
      total += element.cantidad_pedidos + element.precio;
    });
    return total;
  }

  canSave() {
    return this.bodega && this.order.tipo && this.order.items && this.order.items.length > 0;
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
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];

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
    return new Blob([ab], { type: mimeString });
  }

  makeEntryToBodega() {
    var data = {
      razon: "Entrada por bodega",
      cliente_id: this.order.cliente_id,
      entidad_id: this.order.entidad_id,
      bodega_id: this.bodega.id,
      entries: [],
      outputs: []
    };
    this.order.items.forEach((item) => {
      var i = this.api.objects.inventarios.find((inv) => inv.referencia == item.referencia);
      if (i) {
        data.entries.push({ item_id: i.id, bodega_id: this.bodega.id, quantity: item.cantidad_pedidos });
      }
    });

    this.api.post("inventarios/transform", data).then((resp) => {
      console.log(resp);
      this.loading = false;
    });
  }
}
