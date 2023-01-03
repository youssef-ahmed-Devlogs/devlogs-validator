import ValidatorWorker from "./ValidatorWorker.js";

class Validator extends ValidatorWorker {
  constructor(data) {
    super(data);
  }

  required(field) {
    if (this.data[field] === "") this.sendMessage(field, "required");
  }

  match(field, matchField) {
    if (this.data[field].trim() !== this.data[matchField].trim())
      this.sendMessage(field, "match");
  }

  max(field, size = 255) {
    if (this.data[field].length > size) this.sendMessage(field, "max");
  }

  min(field, size = 5) {
    if (this.data[field].length < size) this.sendMessage(field, "min");
  }

  email(field) {
    const validateEmail = String(this.data[field])
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

    if (!validateEmail) this.sendMessage(field, "email");
  }

  image(field, extensions) {
    const type =
      this.data[field].type !== "" ? this.data[field].type : "null/null";

    const ext = type?.split("/")[1];
    if (ext && !extensions.includes(ext)) this.sendMessage(field, "image");
  }

  imageSize(field, imageSize) {
    const convertSizeToKB = Math.ceil(this?.data[field]?.size / 1024) || "";

    if (convertSizeToKB && convertSizeToKB > imageSize)
      this.sendMessage(field, "size");
  }

  enum(field, params) {
    const check = `${this.data[field]}`;
    if (!params.includes(check)) this.sendMessage(field, "enum");
  }
}

export default Validator;
