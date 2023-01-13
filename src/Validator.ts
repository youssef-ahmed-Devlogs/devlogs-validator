import ValidatorControllers from "./classes/ValidatorControllers.js";
import Validators from "./interfaces/Validator.js";

class Validator extends ValidatorControllers implements Validators {
  constructor(data: Object) {
    super(data);
  }

  protected required(field: string): void {
    if (Array.isArray(this.data[field]) && this.data[field].length === 0) {
      // if is an empty array
      this.sendMessage(field, "required");
    } else if (
      // if is an empty object
      typeof this.data[field] === "object" &&
      !Array.isArray(this.data[field]) &&
      this.data[field] !== null
    ) {
      if (Object.keys(this.data[field]).length === 0)
        this.sendMessage(field, "required");
    } else {
      // if is an empty string
      if (
        this.data[field].trim() === "" ||
        this.data[field] === undefined ||
        this.data[field] === null
      ) {
        this.sendMessage(field, "required");
      }
    }
  }

  protected match(field: string, matchField: string): void {
    if (this.data[field].trim() !== this.data[matchField].trim())
      this.sendMessage(field, "match");
  }

  protected max(field: string, size: string = "255"): void {
    if (this.data[field].length > size) this.sendMessage(field, "max");
  }

  protected min(field: string, size: string = "5"): void {
    if (this.data[field].length < size) this.sendMessage(field, "min");
  }

  protected email(field: string): void {
    const validateEmail = String(this.data[field])
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

    if (!validateEmail) this.sendMessage(field, "email");
  }

  protected image(image: any, field: string, extensions: string[]): void {
    const type = image && image.type !== "" ? image.type : "null/null";
    const ext = type?.startsWith("image") ? type?.split("/")[1] : "null";

    if (ext && !extensions.includes(ext)) this.sendMessage(field, "image");
  }

  protected imageSize(
    image: any,
    field: string,
    imageSize: string | number
  ): void {
    const convertSizeToKB = Math.ceil(image?.size / 1024) || "";

    if (convertSizeToKB && convertSizeToKB > imageSize)
      this.sendMessage(field, "size");
  }

  protected validateImage(field: string, extensions: string[]): void {
    if (Array.isArray(this.data[field])) {
      // array of images
      const images = this.data[field];
      images.forEach((image: object) => this.image(image, field, extensions));
    } else {
      // single image
      this.image(this.data[field], field, extensions);
    }
  }

  protected validateImageSize(field: string, imageSize: string | number): void {
    if (Array.isArray(this.data[field])) {
      // array of images
      const images = this.data[field];
      images.forEach((image: object) =>
        this.imageSize(image, field, imageSize)
      );
    } else {
      // single image
      this.imageSize(this.data[field], field, imageSize);
    }
  }

  protected enum(field: string, params: string[]): void {
    const value = `${this.data[field]}`;

    if (!params.includes(value)) this.sendMessage(field, "enum");
  }

  protected in(field: string, params: string[]): void {
    const values = this.data[field];
    let check = false;

    values.forEach((value: any) => {
      if (params.includes(`${value}`)) {
        check = true;
      }
    });

    if (!check) this.sendMessage(field, "in");
  }

  protected gt(field: string, value: string): void {
    if (this.data[field] <= +value) this.sendMessage(field, "gt");
  }

  protected gte(field: string, value: string): void {
    if (this.data[field] < +value) this.sendMessage(field, "gte");
  }

  protected lt(field: string, value: string): void {
    if (this.data[field] >= +value) this.sendMessage(field, "lt");
  }

  protected lte(field: string, value: string): void {
    if (this.data[field] > +value) this.sendMessage(field, "lte");
  }

  protected array(field: string): void {
    if (!Array.isArray(this.data[field])) this.sendMessage(field, "array");
  }
}

export default Validator;
