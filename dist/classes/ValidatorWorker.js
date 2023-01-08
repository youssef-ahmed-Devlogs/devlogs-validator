class ValidatorWorker {
    constructor(data) {
        this.errors = [];
        this.objectErrors = {};
        this.validation = {};
        this.messages = {};
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
    // extractFields(errorTypes, errorTypesText) {
    //   // ==== Get max validation and extract it ["max:20"] => "max" "20" ========
    //   const extractMax = errorTypes.find((item) =>
    //     item.startsWith(errorTypesText)
    //   );
    //   let [max, maxSize] = extractMax?.split(":") || "";
    //   return [max, maxSize];
    // }
    selectErrorType(validationTypes, field) {
        // ==== Get max validation and extract it ["max:20"] => "max" "20" ========
        const extractMax = validationTypes.find((item) => item.startsWith("max"));
        let [max, maxSize] = (extractMax === null || extractMax === void 0 ? void 0 : extractMax.split(":")) || "";
        // ==== Get min validation and extract it ["min:20"] => "min" "20" ========
        const extractMin = validationTypes.find((item) => item.startsWith("min"));
        let [min, minSize] = (extractMin === null || extractMin === void 0 ? void 0 : extractMin.split(":")) || "";
        // ==== Get enum validation and extract its params ["enum:user,admin"] => "enum" "user,admin" ========
        const extractEum = validationTypes.find((item) => item.startsWith("enum"));
        let [_enum, params] = (extractEum === null || extractEum === void 0 ? void 0 : extractEum.split(":")) || "";
        // ==== Get image validation and extract its extensions ["image:png,jpeg"] => "image" "png,jpeg" ========
        const extractImage = validationTypes.find((item) => item.startsWith("image"));
        let [image, extensions] = (extractImage === null || extractImage === void 0 ? void 0 : extractImage.split(":")) || "";
        // ==== Get image size validation and extract it ["size:1000"] => "size" "1000" ========
        const extractImageSize = validationTypes.find((item) => item.startsWith("size"));
        let [size, imageSize] = (extractImageSize === null || extractImageSize === void 0 ? void 0 : extractImageSize.split(":")) || "";
        // ==== Get min validation and extract it ["min:20"] => "min" "20" ========
        const extractMatch = validationTypes.find((item) => item.startsWith("match"));
        let [match, matchField] = (extractMatch === null || extractMatch === void 0 ? void 0 : extractMatch.split(":")) || "";
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
        if (this === null || this === void 0 ? void 0 : this.messages[field]) {
            message = this === null || this === void 0 ? void 0 : this.messages[field][errorType];
        }
        this.errors.push(message);
        this.objectErrors[field] = message;
    }
}
export default ValidatorWorker;
