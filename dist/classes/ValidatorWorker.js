class ValidatorWorker {
    constructor(data) {
        this.errors = [];
        this.objectErrors = {};
        this.validation = {};
        this.messages = {};
        this.fileSize = "";
        this.data = data;
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
    extractFields(validationTypes, validationTypeText) {
        /**
         * ==== Get field validation and extract it ====
         * ["max:20"] => "max" "20"
         * ["min:20"] => "min" "20"
         * etc...
         */
        const extractMax = validationTypes.find((item) => item.startsWith(validationTypeText));
        let [validation, params] = (extractMax === null || extractMax === void 0 ? void 0 : extractMax.split(":")) || "";
        return [validation, params];
    }
    selectErrorType(validationTypes, field) {
        const [max, maxSize] = this.extractFields(validationTypes, "max");
        const [min, minSize] = this.extractFields(validationTypes, "min");
        const [_enum, params] = this.extractFields(validationTypes, "enum");
        const [image, extensions] = this.extractFields(validationTypes, "image");
        const [size, imageSize] = this.extractFields(validationTypes, "size");
        this.fileSize = imageSize;
        const [match, matchField] = this.extractFields(validationTypes, "match");
        if (size && imageSize)
            this.imageSize(field, imageSize.trim());
        if (image && extensions) {
            const exts = extensions === null || extensions === void 0 ? void 0 : extensions.split(",").map((ext) => ext.trim());
            this.image(field, exts);
        }
        if (_enum) {
            let enumParams = params.split(",").map((param) => param.trim()) || "";
            this.enum(field, enumParams);
        }
        if (match && matchField)
            this.match(field, matchField);
        if (max && maxSize.trim())
            this.max(field, maxSize.trim());
        if (min && minSize.trim())
            this.min(field, minSize.trim());
        if (validationTypes.includes("email"))
            this.email(field);
        if (validationTypes.includes("required"))
            this.required(field);
    }
    sendMessage(field, errorType) {
        let message = `${field} has no message for ${errorType} error.`;
        if (errorType === "size") {
            message = `The max size is ${this.fileSize} KB`;
        }
        if ((this === null || this === void 0 ? void 0 : this.messages[field]) && (this === null || this === void 0 ? void 0 : this.messages[field][errorType])) {
            message = this === null || this === void 0 ? void 0 : this.messages[field][errorType];
        }
        this.errors.push(message);
        this.objectErrors[field] = message;
    }
}
export default ValidatorWorker;
