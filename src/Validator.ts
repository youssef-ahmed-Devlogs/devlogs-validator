import ValidatorControllers from "./classes/ValidatorControllers.js";
import Validators from "./interfaces/Validator.js";

class Validator extends ValidatorControllers implements Validators {
  constructor(data: Object) {
    super(data);
  }

  public required(field: string): void {
    if (this.data[field] === "") this.sendMessage(field, "required");
  }

  public match(field: string, matchField: string): void {
    if (this.data[field].trim() !== this.data[matchField].trim())
      this.sendMessage(field, "match");
  }

  public max(field: string, size: string = "255"): void {
    if (this.data[field].length > size) this.sendMessage(field, "max");
  }

  public min(field: string, size: string = "5"): void {
    if (this.data[field].length < size) this.sendMessage(field, "min");
  }

  public email(field: string): void {
    const validateEmail = String(this.data[field])
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

    if (!validateEmail) this.sendMessage(field, "email");
  }

  public image(field: string, extensions: string[]): void {
    const type =
      this.data[field].type !== "" ? this.data[field].type : "null/null";

    const ext = type?.split("/")[1];
    if (ext && !extensions.includes(ext)) this.sendMessage(field, "image");
  }

  public imageSize(field: string, imageSize: string | number): void {
    const convertSizeToKB = Math.ceil(this?.data[field]?.size / 1024) || "";

    if (convertSizeToKB && convertSizeToKB > imageSize)
      this.sendMessage(field, "size");
  }

  public enum(field: string, params: string[]): void {
    const check = `${this.data[field]}`;
    if (!params.includes(check)) this.sendMessage(field, "enum");
  }
}

export default Validator;
