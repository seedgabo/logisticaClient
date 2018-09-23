import { Component, forwardRef, EventEmitter, Output, Input, SimpleChanges, OnChanges } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { ModalController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { ItemFinderPage } from "../../pages/item-finder/item-finder";

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ItemSelectorComponent),
  multi: true
};

@Component({
  selector: "item-selector",
  templateUrl: "item-selector.html",
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class ItemSelectorComponent implements ControlValueAccessor, OnChanges {
  public item;
  public _item;
  list = [];
  ready = false;
  @Input()
  resource: string;
  @Input()
  multiple: boolean;
  @Input()
  title = "full_name";
  @Input()
  description = "description";
  @Input()
  image = null;
  @Input()
  trackBy: string = null;
  @Input()
  placeholder: string = null;
  @Output()
  onChange: EventEmitter<any> = new EventEmitter();

  constructor(public modal: ModalController, public api: Api) {}

  selectItem() {
    this.onTouchedCallback();
    var modal = this.modal.create(ItemFinderPage, {
      resource: this.resource,
      title: this.title,
      description: this.description,
      image: this.image,
      selected:
        this.item && Array.isArray(this.item)
          ? this.item.map((i) => {
              return i.id;
            })
          : null,
      multiple: this.multiple
    });
    modal.present();
    modal.onDidDismiss((data, role) => {
      if (role == "cancel") return;
      if (data && (data.length || data.id)) {
        this.item = data;
        console.log(this.item);
        if (this.trackBy) {
          if (this.multiple) {
            this._item = this.item.map((i) => {
              return i[this.trackBy];
            });
          } else {
            this._item = this.item[this.trackBy];
          }
        } else {
          this._item = this.item;
        }
      } else {
        this._item = this.item = null;
      }
      this.onChangeCallback(this._item);
      this.onChange.emit(this._item);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.resource.currentValue) {
      this.api.ready.then(() => {
        this.api.load(this.resource).then(() => {
          // Multiple Selection
          if (this.multiple) {
            if (this.trackBy) {
              this.item = this.api.objects[this.resource].filter((i) => {
                return this._item.includes(i[this.trackBy]);
              });
              this._item = this.item.map((i) => {
                return i[this.trackBy];
              });
            } else {
              this._item = this.item;
            }
          }
          // Single select
          else {
            if (this.trackBy && this._item) {
              this.item = this.api.objects[this.resource].find((i) => {
                return i[this.trackBy] == this._item;
              });

              this._item = this.item[this.trackBy];
            } else {
              this._item = this.item;
            }
          }
          this.ready = true;
        });
      });
    }
  }

  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};
  get value(): any {
    if (this.trackBy && this._item) {
      return this._item[this.trackBy];
    }
    return this._item;
  }
  set value(v: any) {
    if (v !== this._item) {
      this._item = v;
      this.onChangeCallback(v);
      if (this.trackBy && this._item) {
        if (this.multiple) {
          this.item = this.api.objects[this.resource].filter((i) => {
            return this._item.includes(i[this.trackBy]);
          });
        } else {
          this.item = this.api.objects[this.resource].find((i) => {
            return i[this.trackBy] == this._item;
          });
        }
      }
    }
  }
  writeValue(value: any) {
    this._item = this.item = value;
    if (this.trackBy && this._item) {
      this.api.load(this.resource).then(() => {
        if (this.multiple) {
          this.item = this.api.objects[this.resource].filter((i) => {
            return this._item.includes(i[this.trackBy]);
          });
        } else {
          this.item = this.api.objects[this.resource].find((i) => {
            return i[this.trackBy] == this._item;
          });
        }
      });
    }
  }
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
