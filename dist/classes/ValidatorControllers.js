import ValidatorWorker from "./ValidatorWorker.js";
class ValidatorControllers extends ValidatorWorker {
    constructor(data) {
        super(data);
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
export default ValidatorControllers;
