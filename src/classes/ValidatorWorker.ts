class ValidatorWorker {
  // ==== Main Properties ====
  /**
   * The object of data to be validated
   * @type {Object}
   * @protected
   * {
   *    username: "youssef27",
   *    role: "admin"
   * }
   */
  protected data: any;

  /**
   * An array of errors after validation
   */
  protected errors: string[] = [];

  /**
   * An object of errors after validation
   */
  protected objectErrors: any = {};

  /**
   * An object of validation flags
   * @type {Object}
   * @protected
   * {
   *    username: ["required","min:3"]
   *    role: ["required","enum:admin,user"]
   * }
   */
  protected validation: any = {};

  /**
   * An array of custom error messages
   */
  protected errorMessages: any = {};

  // ==== Flags parameters values ====
  private minSize: string = "";
  private maxSize: string = "";
  private gtValue: string = "";
  private gteValue: string = "";
  private ltValue: string = "";
  private lteValue: string = "";
  private matchField: string = "";
  private enumParams: string[] = [];
  private inParams: string[] = [];

  // files parameters
  private fileSize: string = "";
  private imageExtensions: string[] = [];

  /**
   * Error messages language
   */
  protected language: string = "en";

  protected globalErrorMessages: any = {
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

  constructor(data: Object) {
    /**
     * The object of data to be validated
     */
    this.data = data;
  }

  /**
   * select the correct validation method for each field.
   * @param validationFlags
   * @param field
   */
  private selectErrorType(validationFlags: string[], field: string): void {
    /**
     * this.extractFields() i used it for :-
     * Get current validation flag then Extract parameters from it.
     *
     * example:-
     * if current validation flag is "min:8" then Extract parameters from it ( 8 ).
     */

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

    // Save Flags parameters to use them in global error messages in this.sendMessage()
    this.maxSize = maxSize;
    this.minSize = minSize;
    this.gtValue = gtValue;
    this.gteValue = gteValue;
    this.ltValue = ltValue;
    this.lteValue = lteValue;
    this.fileSize = imageSize;
    this.matchField = matchField;

    // ==== ** Select the correct validation method for each field ** ====

    // Validate image size
    if (size && imageSize) this.validateImageSize(field, imageSize.trim());

    // Validate image with extensions
    if (image && extensions) {
      // Convert extensions from a string like this "jpg,png" to an array ["jpg", "png"]
      const exts = extensions?.split(",").map((ext) => ext.trim());

      // Save Flags parameters to use them in global error messages in this.sendMessage()
      this.imageExtensions = exts;

      // Run validation method
      this.validateImage(field, exts);
    }

    // Validate a field with enum values
    if (_enum) {
      // Convert enum params from a string like this "admin,user" to an array ["admin", "user"]
      let enumParams = params.split(",").map((param) => param.trim()) || "";

      // Save Flags parameters to use them in global error messages in this.sendMessage()
      this.enumParams = enumParams;

      // Run validation method
      this.enum(field, enumParams);
    }

    // Validate a field with in values
    if (_in) {
      // Convert in params from a string like this "admin,user" to an array ["admin", "user"]
      let inValues = inParams.split(",").map((param) => param.trim()) || "";

      // Save Flags parameters to use them in global error messages in this.sendMessage()
      this.inParams = inValues;

      // Run validation method
      this.in(field, inValues);
    }

    // Validate match field
    if (match && matchField) this.match(field, matchField);

    // Validate max size
    if (max && maxSize.trim()) this.max(field, maxSize.trim());

    // Validate min size
    if (min && minSize.trim()) this.min(field, minSize.trim());

    // Validate gt value
    if (gt && gtValue.trim() && !gte) this.gt(field, gtValue.trim());

    // Validate gte value
    if (gte && gteValue.trim()) this.gte(field, gteValue.trim());

    // Validate lt value
    if (lt && ltValue.trim() && !lte) this.lt(field, ltValue.trim());

    // Validate lte value
    if (lte && lteValue.trim()) this.lte(field, lteValue.trim());

    // Validate array field
    if (validationFlags.includes("array")) this.array(field);

    // Validate valid email
    if (validationFlags.includes("email")) this.email(field);

    // Validate required field
    if (validationFlags.includes("required")) this.required(field);
  }

  /**
   * replace global message variables.
   * then return it after replacing.
   * <%fieldName%> field is required => username field is required
   *
   * @param message
   * @param data
   * @returns string
   */
  private replaceMessageVariables(message: string, fieldName: string): string {
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

  /**
   * Set global errors.
   * @param field
   * @param errorType
   * @returns
   */
  private sendGlobalMessages(field: string, errorType: string): string {
    // Get global messages in the current language
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

  /**
   * Set errors after validation failed.
   * And add it to ( this.errors ) and ( this.objectErrors ).
   *
   * @param field
   * @param errorType
   */
  protected sendMessage(field: string, errorType: string): void {
    // set errors message from global
    let message = this.sendGlobalMessages(field, errorType);

    // if there is custom error message from ( this.errorMessages ) set it.
    if (this?.errorMessages[field] && this?.errorMessages[field][errorType]) {
      message = this?.errorMessages[field][errorType];
    }

    // Add errors as an array to ( this.errors )
    this.errors.push(message);

    // Add errors as an object to ( this.objectErrors )
    this.objectErrors[field] = message;
  }

  /**
   * Convert this field name ( first_name ) to ( first name )
   * @param fieldName
   * @returns string
   */
  private prepareFieldName(fieldName: string): string {
    return fieldName?.split("_").join(" ") || "(Field Name)";
  }

  /**
   * Get current validation flag then Extract parameters from it.
   * if current validation flag is "min:8" then Extract parameters from it ( 8 ).
   * @param validationFlags
   * @param validationTypeText
   * @returns
   */
  private extractFields(validationFlags: string[], validationTypeText: string) {
    // Get current validation flag
    const extractMax = validationFlags.find((item) =>
      item.startsWith(validationTypeText)
    );

    // Extract parameters from it
    let [validation, params] = extractMax?.split(":") || "";
    return [validation, params];
  }
}

export default ValidatorWorker;
