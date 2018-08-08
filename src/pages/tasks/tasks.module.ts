import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TasksPage } from "./tasks";
import { PipesModule } from "../../pipes/pipes.module";
import { MomentModule } from "angular2-moment";

@NgModule({
  declarations: [TasksPage],
  imports: [IonicPageModule.forChild(TasksPage), PipesModule, MomentModule]
})
export class TasksPageModule {}
