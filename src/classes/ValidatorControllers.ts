import ValidatorWorker from "./ValidatorWorker.js";

class ValidatorControllers extends ValidatorWorker {
  constructor(data: Object) {
    super(data);
  }

  public setValidation(validation: Object): ValidatorWorker {
    this.validation = validation;
    return this;
  }

  public setMessages(messages: Object): ValidatorWorker {
    this.messages = messages;
    return this;
  }

  public getErrors(): string[] {
    return this.errors;
  }

  public getObjectErrors(): Object {
    return this.objectErrors;
  }
}

export default ValidatorControllers;
