class ValidatorWorker {
  constructor(data) {
    this.errors = [];
    this.objectErrors = {};
    this.validation = {};
    this.errorMessages = {};
    this.minSize = "";
    this.maxSize = "";
    this.gtValue = "";
    this.gteValue = "";
    this.ltValue = "";
    this.lteValue = "";
    this.matchField = "";
    this.enumParams = [];
    this.inParams = [];
    this.fileSize = "";
    this.imageExtensions = [];
    this.language = "en";
    this.globalErrorMessages = {
      en: {
        required: `<%fieldName%> field is required.`,
        email: `Please provide a valid email address for <%fieldName%> field.`,
        array: `<%fieldName%> field must be an array.`,
        min: `Minimum length of <%fieldName%> is <%minSize%> characters.`,
        gt: `<%fieldName%> value must be grater than <%gtValue%>.`,
        gte: `<%fieldName%> value must be grater than or equal <%gteValue%>.`,
        lt: `<%fieldName%> value must be less than <%ltValue%>.`,
        lte: `<%fieldName%> value must be less than or equal <%lteValue%>.`,
        max: `Maximum length of <%fieldName%> is <%maxSize%> characters.`,
        match: `<%fieldName%> field and <%matchField%> are not match.`,
        enum: `<%fieldName%> field must be one of <%enumParams%>.`,
        in: `<%fieldName%> values must be at least one of <%inParams%>.`,
        image: `Please provide a valid image (<%imageExtensions%>).`,
        size: `The max size of <%fieldName%> is <%fileSize%>KB.`,
      },
    };
    this.data = data;
  }
  selectErrorType(validationFlags, field) {
    const [max, maxSize] = this.extractFields(validationFlags, "max");
    const [min, minSize] = this.extractFields(validationFlags, "min");
    const [gt, gtValue] = this.extractFields(validationFlags, "gt");
    const [gte, gteValue] = this.extractFields(validationFlags, "gte");
    const [lt, ltValue] = this.extractFields(validationFlags, "lt");
    const [lte, lteValue] = this.extractFields(validationFlags, "lte");
    const [_enum, params] = this.extractFields(validationFlags, "enum");
    const [_in, inParams] = this.extractFields(validationFlags, "in");
    const [image, extensions] = this.extractFields(validationFlags, "image");
    const [size, imageSize] = this.extractFields(validationFlags, "size");
    const [match, matchField] = this.extractFields(validationFlags, "match");
    this.maxSize = maxSize;
    this.minSize = minSize;
    this.gtValue = gtValue;
    this.gteValue = gteValue;
    this.ltValue = ltValue;
    this.lteValue = lteValue;
    this.fileSize = imageSize;
    this.matchField = matchField;
    if (size && imageSize) this.validateImageSize(field, imageSize.trim());
    if (image && extensions) {
      const exts =
        extensions === null || extensions === void 0
          ? void 0
          : extensions.split(",").map((ext) => ext.trim());
      this.imageExtensions = exts;
      this.validateImage(field, exts);
    }
    if (_enum) {
      let enumParams = params.split(",").map((param) => param.trim()) || "";
      this.enumParams = enumParams;
      this.enum(field, enumParams);
    }
    if (_in) {
      let inValues = inParams.split(",").map((param) => param.trim()) || "";
      this.inParams = inValues;
      this.in(field, inValues);
    }
    if (match && matchField) this.match(field, matchField);
    if (max && maxSize.trim()) this.max(field, maxSize.trim());
    if (min && minSize.trim()) this.min(field, minSize.trim());
    if (gt && gtValue.trim() && !gte) this.gt(field, gtValue.trim());
    if (gte && gteValue.trim()) this.gte(field, gteValue.trim());
    if (lt && ltValue.trim() && !lte) this.lt(field, ltValue.trim());
    if (lte && lteValue.trim()) this.lte(field, lteValue.trim());
    if (validationFlags.includes("array")) this.array(field);
    if (validationFlags.includes("email")) this.email(field);
    if (validationFlags.includes("required")) this.required(field);
  }
  replaceMessageVariables(message, fieldName) {
    return message
      .replace("<%fieldName%>", this.prepareFieldName(fieldName))
      .replace("<%minSize%>", this.minSize)
      .replace("<%maxSize%>", this.maxSize)
      .replace("<%matchField%>", this.matchField)
      .replace("<%enumParams%>", this.enumParams.join(", "))
      .replace("<%inParams%>", this.inParams.join(", "))
      .replace("<%imageExtensions%>", this.imageExtensions.join(", "))
      .replace("<%fileSize%>", this.fileSize)
      .replace("<%gtValue%>", this.gtValue)
      .replace("<%gteValue%>", this.gteValue)
      .replace("<%ltValue%>", this.ltValue)
      .replace("<%lteValue%>", this.lteValue);
  }
  sendGlobalMessages(field, errorType) {
    const errorMessages = this.globalErrorMessages[this.language]
      ? this.globalErrorMessages[this.language]
      : this.globalErrorMessages.en;
    const defaultMessage = `There is no [${
      this.language
    }] error message for ${this.prepareFieldName(
      field
    )} for ${errorType} error.`;
    switch (errorType) {
      case "required":
        return this.replaceMessageVariables(
          errorMessages.required || defaultMessage,
          field
        );
      case "email":
        return this.replaceMessageVariables(
          errorMessages.email || defaultMessage,
          field
        );
      case "array":
        return this.replaceMessageVariables(
          errorMessages.array || defaultMessage,
          field
        );
      case "min":
        return this.replaceMessageVariables(
          errorMessages.min || defaultMessage,
          field
        );
      case "gt":
        return this.replaceMessageVariables(
          errorMessages.gt || defaultMessage,
          field
        );
      case "gte":
        return this.replaceMessageVariables(
          errorMessages.gte || defaultMessage,
          field
        );
      case "lt":
        return this.replaceMessageVariables(
          errorMessages.lt || defaultMessage,
          field
        );
      case "lte":
        return this.replaceMessageVariables(
          errorMessages.lte || defaultMessage,
          field
        );
      case "max":
        return this.replaceMessageVariables(
          errorMessages.max || defaultMessage,
          field
        );
      case "match":
        return this.replaceMessageVariables(
          errorMessages.match || defaultMessage,
          field
        );
      case "enum":
        return this.replaceMessageVariables(
          errorMessages.enum || defaultMessage,
          field
        );
      case "in":
        return this.replaceMessageVariables(
          errorMessages.in || defaultMessage,
          field
        );
      case "size":
        return this.replaceMessageVariables(
          errorMessages.size || defaultMessage,
          field
        );
      case "image":
        return this.replaceMessageVariables(
          errorMessages.image || defaultMessage,
          field
        );
      default:
        return defaultMessage;
    }
  }
  sendMessage(field, errorType) {
    let message = this.sendGlobalMessages(field, errorType);
    if (
      (this === null || this === void 0 ? void 0 : this.errorMessages[field]) &&
      (this === null || this === void 0
        ? void 0
        : this.errorMessages[field][errorType])
    ) {
      message =
        this === null || this === void 0
          ? void 0
          : this.errorMessages[field][errorType];
    }
    this.errors.push(message);
    this.objectErrors[field] = message;
  }
  prepareFieldName(fieldName) {
    return (
      (fieldName === null || fieldName === void 0
        ? void 0
        : fieldName.split("_").join(" ")) || "(Field Name)"
    );
  }
  extractFields(validationFlags, validationTypeText) {
    const extractMax = validationFlags.find((item) =>
      item.startsWith(validationTypeText)
    );
    let [validation, params] =
      (extractMax === null || extractMax === void 0
        ? void 0
        : extractMax.split(":")) || "";
    return [validation, params];
  }
}
export default ValidatorWorker;
