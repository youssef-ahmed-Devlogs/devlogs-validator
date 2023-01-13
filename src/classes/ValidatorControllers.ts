import ValidatorWorker from "./ValidatorWorker.js";

class ValidatorControllers extends ValidatorWorker {
  constructor(data: Object) {
    super(data);
  }

  /**
   * Set validation for a fields in object
   * {
   *    username: ["required","min:3"],
   *    email: ["required","email"],
   * }
   * @param validation
   * @returns ValidatorWorker
   */
  public setValidation(validation: Object): ValidatorWorker {
    this.validation = validation;
    return this;
  }

  /**
   * Set a custom error message for each field and each type of error in object.
   * {
   *    username: {
   *      required: "Username is required",
   *      min: "Username must be at least 3 characters",
   *    },
   *    email: {
   *      required: "Email is required",
   *      email: "Email is invalid",
   *    }
   * }
   *
   * @param messages
   * @returns ValidatorWorker
   */
  public setMessages(messages: Object): ValidatorWorker {
    this.errorMessages = messages;
    return this;
  }

  /**
   * Prepare the validation data before starts checking it.
   * @returns ValidatorWorker
   */
  public prepare(): ValidatorWorker {
    // Get validation flags fields names
    const validationFields = Object.keys(this.validation);
    // Get data fields names
    const dataFields = Object.keys(this.data);

    // Loop through validation fields names
    validationFields.forEach((validationField) => {
      // Check if the validation field is in the data fields names
      if (dataFields.includes(validationField)) {
        /**
         * example for flags:-
         * ["required", "min:8","enum:admin, user"]
         */
        const flags: string[] = this.validation[validationField];

        /**
         * example for field name: "role"
         */
        const fieldName: string = validationField;

        /**
         * Run select error type method to select the correct validation method for each field.
         * And send with it the array of flags for this field, and field name.
         */
        this.selectErrorType(flags, fieldName);
      }
    });

    return this;
  }

  /**
   * Get error messages as an array.
   * @returns string[]
   */
  public getErrors(): string[] {
    this.prepare();
    return this.errors;
  }

  /**
   * Get error messages as an object.
   * @returns object
   */
  public getObjectErrors(): Object {
    this.prepare();
    return this.objectErrors;
  }

  /**
   * Set validation language
   * @param lang
   * @returns
   */
  public setLanguage(lang: string) {
    this.language = lang;
    return this;
  }

  /**
   * Add global error messages in a new language
   * @param key
   * @param messages
   * @returns
   */
  public addTranslation(key: string, messages: object): ValidatorWorker {
    this.globalErrorMessages[key] = messages;
    return this;
  }

  public updateTranslation(key: string, messages: object): ValidatorWorker {
    this.globalErrorMessages[key] = {
      ...this.globalErrorMessages[key],
      ...messages,
    };

    return this;
  }
}

export default ValidatorControllers;
