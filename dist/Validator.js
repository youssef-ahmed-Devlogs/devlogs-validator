import ValidatorControllers from "./classes/ValidatorControllers.js";
class Validator extends ValidatorControllers {
    constructor(data) {
        super(data);
    }
    required(field) {
        if (this.data[field] === "")
            this.sendMessage(field, "required");
    }
    match(field, matchField) {
        if (this.data[field].trim() !== this.data[matchField].trim())
            this.sendMessage(field, "match");
    }
    max(field, size = "255") {
        if (this.data[field].length > size)
            this.sendMessage(field, "max");
    }
    min(field, size = "5") {
        if (this.data[field].length < size)
            this.sendMessage(field, "min");
    }
    email(field) {
        const validateEmail = String(this.data[field])
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!validateEmail)
            this.sendMessage(field, "email");
    }
    image(field, extensions) {
        const type = this.data[field].type !== "" ? this.data[field].type : "null/null";
        const ext = type === null || type === void 0 ? void 0 : type.split("/")[1];
        if (ext && !extensions.includes(ext))
            this.sendMessage(field, "image");
    }
    imageSize(field, imageSize) {
        var _a;
        const convertSizeToKB = Math.ceil(((_a = this === null || this === void 0 ? void 0 : this.data[field]) === null || _a === void 0 ? void 0 : _a.size) / 1024) || "";
        if (convertSizeToKB && convertSizeToKB > imageSize)
            this.sendMessage(field, "size");
    }
    enum(field, params) {
        const check = `${this.data[field]}`;
        if (!params.includes(check))
            this.sendMessage(field, "enum");
    }
}
export default Validator;
