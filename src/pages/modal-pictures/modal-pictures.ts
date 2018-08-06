import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { Lightbox } from "ngx-lightbox";
@IonicPage()
@Component({
  selector: "page-modal-pictures",
  templateUrl: "modal-pictures.html"
})
export class ModalPicturesPage {
  images:any = [];
  albums:any = [];
  resourceType = "inventario";
  resource = null;
  constructor(public viewCtrl: ViewController, public lightbox: Lightbox, public navCtrl: NavController, public navParams: NavParams, public api: Api) {

    this.resource = this.navParams.get("resource");
    if (this.navParams.get("images")){
      this.images = this.navParams.get("images");
    }
  }

  ionViewDidLoad() {
    this.api.ready.then(()=>{
      this.getReources();
    })
  }


  getReources(){
    this.api.get(`${this.resourceType}s/${this.resource.id}?with[]=images`)
    .then((resp:any)=>{
      this.images =  resp.images;
      this.getAlbum()
    })
  }

  getAlbum(){
    var albums = [{
      src: this.resource.foto_url,
      caption: this.resource.item,
      thumb: this.resource.foto_url,
    }];
    this.images.forEach(image => {
      albums.push({
        src: image.url,
        caption: image.name,
        thumb: image.name,
      });
    });
    this.albums = albums;
  }

  open(index){
    if(this.albums.length> 0)
    this.lightbox.open(this.albums, index);
  }

  dismiss(){
    this.viewCtrl.dismiss()
  }


  deleteImage(image,i){
    this.api.delete(`${this.resourceType}s/${this.resource.id}/photo/remove/${image.id}`)
    .then((resp)=>{
        this.images.splice(i,1);
        this.getAlbum();
    })
  }

  askFile() {
    return document.getElementById("input-images").click();
  }

  readFile(evt) {
    try {
      for (let index = 0; index <evt.target.files.length; index++) {
        const file = evt.target.files[index];
          if (file.size / 1024 / 1024 > 5) {
            return alert("el archivo es muy grande: " + Math.floor(file.size) + " (< 5MB)");
          }
        this.uploadFile(file)
      }
    } catch (error) {
      return console.error(error);
    }
  }

  uploadFile(file) {
    var formData, xhr;
    formData = new FormData();
    xhr = new XMLHttpRequest();
    xhr.open("POST", `${this.api.url}api/${this.resourceType}s/${this.resource.id}/photo/upload`, true);
    formData.append("image",file, file.name);
    xhr.onload = () => {
      if (xhr.status == 200) {
         this.images.push(JSON.parse(xhr.responseText));
      } else {
        this.api.error(xhr.status);
        return console.error(xhr);
      }
    };
    xhr.setRequestHeader("Auth-Token", this.api.user.token);

    return xhr.send(formData);
  }
}
