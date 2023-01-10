class ValidatorWorker {
    constructor(data) {
        this.errors = [];
        this.objectErrors = {};
        this.validation = {};
        this.errorMessages = {};
        this.minSize = "";
        this.maxSize = "";
        this.matchField = "";
        this.enumParams = [];
        this.fileSize = "";
        this.imageExtensions = [];
        this.language = "en";
        this.globalErrorMessages = {
            en: {
                required: `<%fieldName%> field is required.`,
                email: `Please provide a valid email address for <%fieldName%> field.`,
                min: `Minimum length of <%fieldName%> is <%minSize%> characters.`,
                max: `Maximum length of <%fieldName%> is <%maxSize%> characters.`,
                match: `<%fieldName%> field and <%matchField%> are not match.`,
                enum: `<%fieldName%> field must be one of <%enumParams%>.`,
                image: `Please provide a valid image (<%imageExtensions%>).`,
                size: `The max size of <%fieldName%> is <%fileSize%>KB.`,
            },
        };
        this.data = data;
    }
    selectErrorType(validationFlags, field) {
        const [max, maxSize] = this.extractFields(validationFlags, "max");
        const [min, minSize] = this.extractFields(validationFlags, "min");
        const [_enum, params] = this.extractFields(validationFlags, "enum");
        const [image, extensions] = this.extractFields(validationFlags, "image");
        const [size, imageSize] = this.extractFields(validationFlags, "size");
        const [match, matchField] = this.extractFields(validationFlags, "match");
        this.maxSize = maxSize;
        this.minSize = minSize;
        this.fileSize = imageSize;
        this.matchField = matchField;
        if (size && imageSize)
            this.imageSize(field, imageSize.trim());
        if (image && extensions) {
            const exts = extensions === null || extensions === void 0 ? void 0 : extensions.split(",").map((ext) => ext.trim());
            this.imageExtensions = exts;
            this.image(field, exts);
        }
        if (_enum) {
            let enumParams = params.split(",").map((param) => param.trim()) || "";
            this.enumParams = enumParams;
            this.enum(field, enumParams);
        }
        if (match && matchField)
            this.match(field, matchField);
        if (max && maxSize.trim())
            this.max(field, maxSize.trim());
        if (min && minSize.trim())
            this.min(field, minSize.trim());
        if (validationFlags.includes("email"))
            this.email(field);
        if (validationFlags.includes("required"))
            this.required(field);
    }
    replaceMessageVariables(message, fieldName) {
        return message
            .replace("<%fieldName%>", this.prepareFieldName(fieldName))
            .replace("<%minSize%>", this.minSize)
            .replace("<%maxSize%>", this.maxSize)
            .replace("<%matchField%>", this.matchField)
            .replace("<%enumParams%>", this.enumParams.join(", "))
            .replace("<%imageExtensions%>", this.imageExtensions.join(", "))
            .replace("<%fileSize%>", this.fileSize);
    }
    sendGlobalMessages(field, errorType) {
        const errorMessages = this.globalErrorMessages[this.language]
            ? this.globalErrorMessages[this.language]
            : this.globalErrorMessages.en;
        const defaultMessage = `There is no [${this.language}] error message for ${this.prepareFieldName(field)} for ${errorType} error.`;
        switch (errorType) {
            case "required":
                return this.replaceMessageVariables(errorMessages.required || defaultMessage, field);
            case "email":
                return this.replaceMessageVariables(errorMessages.email || defaultMessage, field);
            case "min":
                return this.replaceMessageVariables(errorMessages.min || defaultMessage, field);
            case "max":
                return this.replaceMessageVariables(errorMessages.max || defaultMessage, field);
            case "match":
                return this.replaceMessageVariables(errorMessages.match || defaultMessage, field);
            case "enum":
                return this.replaceMessageVariables(errorMessages.enum || defaultMessage, field);
            case "size":
                return this.replaceMessageVariables(errorMessages.size || defaultMessage, field);
            case "image":
                return this.replaceMessageVariables(errorMessages.image || defaultMessage, field);
            default:
                return defaultMessage;
        }
    }
    sendMessage(field, errorType) {
        let message = this.sendGlobalMessages(field, errorType);
        if ((this === null || this === void 0 ? void 0 : this.errorMessages[field]) && (this === null || this === void 0 ? void 0 : this.errorMessages[field][errorType])) {
            message = this === null || this === void 0 ? void 0 : this.errorMessages[field][errorType];
        }
        this.errors.push(message);
        this.objectErrors[field] = message;
    }
    prepareFieldName(fieldName) {
        return (fieldName === null || fieldName === void 0 ? void 0 : fieldName.split("_").join(" ")) || "(Field Name)";
    }
    extractFields(validationFlags, validationTypeText) {
        const extractMax = validationFlags.find((item) => item.startsWith(validationTypeText));
        let [validation, params] = (extractMax === null || extractMax === void 0 ? void 0 : extractMax.split(":")) || "";
        return [validation, params];
    }
}
export default ValidatorWorker;
