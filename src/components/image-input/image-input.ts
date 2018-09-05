import { Component, forwardRef, EventEmitter, Output, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { Api } from "../../providers/api/api";

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImageInputComponent),
  multi: true
};
@Component({
  selector: "image-input",
  templateUrl: "image-input.html",
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class ImageInputComponent implements ControlValueAccessor {
  public file;
  public ready = false;
  @Input()
  large: boolean = false;
  @Input()
  clear: boolean = false;
  @Input()
  color: string = null;
  @Input()
  placeholder: string = null;
  @Input()
  preview: boolean = true;
  @Input()
  label: string = this.api.trans("literals.image");
  @Input()
  camera: boolean = true;
  @Output()
  onChange: EventEmitter<any> = new EventEmitter();
  constructor(public api: Api) {}

  askFile() {
    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    if (this.camera) {
      input.setAttribute("capture", "camera");
    }
    input.setAttribute("display", "none");

    input.onchange = (event: any) => {
      try {
        this.file = event.target.files[0];
        this.onChangeCallback(this.file);
        this.onChange.emit(this.file);
        if (!this.file) {
          return;
        }
        if (this.file.size > 5000000) {
          return alert("el archivo es muy grande: " + Math.floor(this.file.size) + " (< 5MB)");
        }

        var reader = new FileReader();
        reader.onload = () => (this.file.preview = reader.result);
        reader.readAsDataURL(this.file);
      } catch (e) {
        console.error(e);
      }
    };
    input.click();
  }

  remove() {
    this.file = null;
    this.onChangeCallback(this.file);
    this.onChange.emit(this.file);
  }

  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor
  public onTouchedCallback: () => {};
  public onChangeCallback: (_: any) => {};

  //get accessor
  get value(): any {
    return this.file;
  }

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.file) {
      this.file = v;
      this.onChangeCallback(v);
    }
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value) {
      this.file = value;
    }
  }
  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
