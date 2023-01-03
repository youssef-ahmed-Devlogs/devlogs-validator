class ValidatorWorker {
  constructor(data) {
    this.data = data;
    this.errors = [];
    this.objectErrors = {};
  }

  prepare() {
    const validationFields = Object.keys(this.validation);
    const dataFields = Object.keys(this.data);

    validationFields.forEach((validationField) => {
      if (dataFields.includes(validationField)) {
        this.selectErrorType(this.validation[validationField], validationField);
      }
    });

    return this;
  }

  selectErrorType(errorTypes, field) {
    // ==== Get max validation and extract it ["max:20"] => "max" "20" ========
    const extractMax = errorTypes.find((item) => item.startsWith("max"));
    let [max, maxSize] = extractMax?.split(":") || "";
    // ==== Get min validation and extract it ["min:20"] => "min" "20" ========
    const extractMin = errorTypes.find((item) => item.startsWith("min"));
    let [min, minSize] = extractMin?.split(":") || "";
    // ==== Get enum validation and extract its params ["enum:user,admin"] => "enum" "user,admin" ========
    const extractEum = errorTypes.find((item) => item.startsWith("enum"));
    let [_enum, params] = extractEum?.split(":") || "";
    // ==== Get image validation and extract its extensions ["image:png,jpeg"] => "image" "png,jpeg" ========
    const extractImage = errorTypes.find((item) => item.startsWith("image"));
    let [image, extensions] = extractImage?.split(":") || "";
    // ==== Get image size validation and extract it ["size:1000"] => "size" "1000" ========
    const extractImageSize = errorTypes.find((item) => item.startsWith("size"));
    let [size, imageSize] = extractImageSize?.split(":") || "";
    // ==== Get min validation and extract it ["min:20"] => "min" "20" ========
    const extractMatch = errorTypes.find((item) => item.startsWith("match"));
    let [match, matchField] = extractMatch?.split(":") || "";

    if (size && imageSize) this.imageSize(field, imageSize.trim());

    if (image && extensions) {
      extensions = extensions?.split(",").map((ext) => ext.trim());
      this.image(field, extensions);
    }

    if (_enum) {
      let enumParams = params.split(",").map((param) => param.trim()) || "";
      this.enum(field, enumParams);
    }

    if (match && matchField) this.match(field, matchField);
    if (max && maxSize.trim()) this.max(field, maxSize.trim());
    if (min && minSize.trim()) this.min(field, minSize.trim());
    if (errorTypes.includes("email")) this.email(field);
    if (errorTypes.includes("required")) this.required(field);
  }

  sendMessage(field, errorType) {
    let message = `${field} has no message for ${errorType} error.`;

    if (this?.messages[field]) {
      message = this?.messages[field][errorType];
    }

    this.errors.push(message);
    this.objectErrors[field] = message;
  }

  setValidation(validation) {
    this.validation = validation;
    return this;
  }

  setMessages(messages) {
    this.messages = messages;
    return this;
  }

  getErrors() {
    return this.errors;
  }

  getObjectErrors() {
    return this.objectErrors;
  }
}

export default ValidatorWorker;
