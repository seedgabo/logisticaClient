import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ActionSheetController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { TransPipe } from "../../pipes/trans/trans";
import { InAppBrowser } from "@ionic-native/in-app-browser";
@IonicPage()
@Component({
  selector: "page-tasks",
  templateUrl: "tasks.html"
})
export class TasksPage {
  tasks = [];
  ordered: any = {
    "in progress": [],
    open: [],
    closed: [],
    completed: []
  };
  mode = "user";
  loading = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public actionsheet: ActionSheetController,
    public inappbrowser: InAppBrowser
  ) {}

  ionViewDidLoad() {}

  getTasks() {
    this.api.ready.then(() => {
      this.loading = true;
      this.api
        .get(
          `tasks?paginate=100&${
            this.mode == "user" ? "where[user_id]=" + this.api.user.id : ""
          }&order[created_at]=desc&order[status]=asc&includes=cliente,entidad,user`
        )
        .then((resp: any) => {
          this.tasks = resp;
          this.order();
          setTimeout(() => {
            this.loading = false;
          }, 150);
        })
        .catch((err) => {
          this.loading = false;
          this.api.error(err);
        });
    });
  }

  order() {
    this.ordered = {
      open: [],
      "in progress": [],
      completed: [],
      rejected: []
    };
    this.tasks.forEach((t) => {
      if (!this.ordered[t.status]) {
        this.ordered[t.status] = [];
      }
      this.ordered[t.status].push(t);
    });
    for (var list in this.ordered) {
      this.ordered[list] = this.ordered[list].sort((a, b) => {
        return a.timestamp - b.timestamp;
      });
    }
  }

  actions(task) {
    var sheet = this.actionsheet.create({
      title: task.title + " | " + this.api.trans("literals.task"),
      buttons: [
        {
          text: new TransPipe(this.api).transform("__.mark as in progress"),
          icon: "log-in",
          handler: () => {
            this.setStatus(task, "in progress");
          }
        },
        {
          text: new TransPipe(this.api).transform("__.mark as done"),
          icon: "log-in",
          handler: () => {
            this.setStatus(task, "complete");
          }
        },
        {
          text: "cancelar",
          icon: "close",
          role: "cancel",
          handler: () => {}
        }
      ]
    });

    sheet.present();
  }

  setStatus(task, status = "done") {
    this.api
      .put("tasks/" + task.id, {
        status: status
      })
      .then((resp) => {
        task.status = status;
      })
      .catch((err) => {
        this.api.error(err);
      });
  }

  deleteTask(task) {
    this.api
      .delete(`tasks/${task.id}`)
      .then((resp) => {
        this.getTasks();
      })
      .catch((err) => {
        this.api.error(err);
      });
  }

  gotoMaps(task) {
    this.inappbrowser.create(`https://maps.google.com/maps?q=${task.location.latitude},${task.location.longitude}&amp;ll=`, "_system");
  }
}
