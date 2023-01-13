import ValidatorControllers from "./classes/ValidatorControllers.js";
class Validator extends ValidatorControllers {
  constructor(data) {
    super(data);
  }
  required(field) {
    if (Array.isArray(this.data[field]) && this.data[field].length === 0) {
      this.sendMessage(field, "required");
    } else if (
      typeof this.data[field] === "object" &&
      !Array.isArray(this.data[field]) &&
      this.data[field] !== null
    ) {
      if (Object.keys(this.data[field]).length === 0)
        this.sendMessage(field, "required");
    } else {
      if (
        this.data[field].trim() === "" ||
        this.data[field] === undefined ||
        this.data[field] === null
      ) {
        this.sendMessage(field, "required");
      }
    }
  }
  match(field, matchField) {
    if (this.data[field].trim() !== this.data[matchField].trim())
      this.sendMessage(field, "match");
  }
  max(field, size = "255") {
    if (this.data[field].length > size) this.sendMessage(field, "max");
  }
  min(field, size = "5") {
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
  image(image, field, extensions) {
    const type = image && image.type !== "" ? image.type : "null/null";
    const ext = (
      type === null || type === void 0 ? void 0 : type.startsWith("image")
    )
      ? type === null || type === void 0
        ? void 0
        : type.split("/")[1]
      : "null";
    if (ext && !extensions.includes(ext)) this.sendMessage(field, "image");
  }
  imageSize(image, field, imageSize) {
    const convertSizeToKB =
      Math.ceil(
        (image === null || image === void 0 ? void 0 : image.size) / 1024
      ) || "";
    if (convertSizeToKB && convertSizeToKB > imageSize)
      this.sendMessage(field, "size");
  }
  validateImage(field, extensions) {
    if (Array.isArray(this.data[field])) {
      const images = this.data[field];
      images.forEach((image) => this.image(image, field, extensions));
    } else {
      this.image(this.data[field], field, extensions);
    }
  }
  validateImageSize(field, imageSize) {
    if (Array.isArray(this.data[field])) {
      const images = this.data[field];
      images.forEach((image) => this.imageSize(image, field, imageSize));
    } else {
      this.imageSize(this.data[field], field, imageSize);
    }
  }
  enum(field, params) {
    const value = `${this.data[field]}`;
    if (!params.includes(value)) this.sendMessage(field, "enum");
  }
  in(field, params) {
    const values = this.data[field];
    let check = false;
    values.forEach((value) => {
      if (params.includes(`${value}`)) {
        check = true;
      }
    });
    if (!check) this.sendMessage(field, "in");
  }
  gt(field, value) {
    if (this.data[field] <= +value) this.sendMessage(field, "gt");
  }
  gte(field, value) {
    if (this.data[field] < +value) this.sendMessage(field, "gte");
  }
  lt(field, value) {
    if (this.data[field] >= +value) this.sendMessage(field, "lt");
  }
  lte(field, value) {
    if (this.data[field] > +value) this.sendMessage(field, "lte");
  }
  array(field) {
    if (!Array.isArray(this.data[field])) this.sendMessage(field, "array");
  }
}
export default Validator;
