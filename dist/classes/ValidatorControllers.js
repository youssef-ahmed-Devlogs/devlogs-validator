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
        this.errorMessages = messages;
        return this;
    }
    prepare() {
        const validationFields = Object.keys(this.validation);
        const dataFields = Object.keys(this.data);
        validationFields.forEach((validationField) => {
            if (dataFields.includes(validationField)) {
                const flags = this.validation[validationField];
                const fieldName = validationField;
                this.selectErrorType(flags, fieldName);
            }
        });
        return this;
    }
    getErrors() {
        return this.errors;
    }
    getObjectErrors() {
        return this.objectErrors;
    }
    setLanguage(lang) {
        this.language = lang;
        return this;
    }
    addTranslation(key, messages) {
        this.globalErrorMessages[key] = messages;
        return this;
    }
}
export default ValidatorControllers;
