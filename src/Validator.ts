import ValidatorControllers from "./classes/ValidatorControllers.js";
import Validators from "./interfaces/Validator.js";

class Validator extends ValidatorControllers implements Validators {
  constructor(data: Object) {
    super(data);
  }

  public required(field: string): void {
    if (this.data[field] === "") this.sendMessage(field, "required");
  }

  public match(field: string, matchField: string): void {
    if (this.data[field].trim() !== this.data[matchField].trim())
      this.sendMessage(field, "match");
  }

  public max(field: string, size: string = "255"): void {
    if (this.data[field].length > size) this.sendMessage(field, "max");
  }

  public min(field: string, size: string = "5"): void {
    if (this.data[field].length < size) this.sendMessage(field, "min");
  }

  public email(field: string): void {
    const validateEmail = String(this.data[field])
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

    if (!validateEmail) this.sendMessage(field, "email");
  }

  public image(field: string, extensions: string[]): void {
    const type =
      this.data[field].type !== "" ? this.data[field].type : "null/null";

    const ext = type?.split("/")[1];
    if (ext && !extensions.includes(ext)) this.sendMessage(field, "image");
  }

  public imageSize(field: string, imageSize: string | number): void {
    const convertSizeToKB = Math.ceil(this?.data[field]?.size / 1024) || "";

    if (convertSizeToKB && convertSizeToKB > imageSize)
      this.sendMessage(field, "size");
  }

  public enum(field: string, params: string[]): void {
    const check = `${this.data[field]}`;
    if (!params.includes(check)) this.sendMessage(field, "enum");
  }
}

const formData = {
  username: "",
  email: "ad",
  password: "12345678",
  passwordConfirm: "123456789",
  role: "asd",
  photo: {
    type: "image/png",
    size: 1213,
  },
};

const validator = new Validator(formData);

validator.addTranslation("ar", {
  required: "حقل <%fieldName%> مطلوب.",
  email: "من فضلك أدخل بريد الكتروني صالح لحقل <%fieldName%>",
  min: "الحد الأدنى للحروف التي يمكن ادخالها في حقل <%fieldName%> هو <%minSize%>",
  max: "الحد الأقصى للقيمة التي يمكن ادخالها في حقل <%fieldName%> هو <%maxSize%>",
  match: "الحقل <%fieldName%> و <%matchField%> غير متطابقيين.",
  enum: "الحقل <%fieldName%> يجب أن يكون من ضمن هذة القيم <%enumParams%>.",
  image: "من فضلك قم برفع صورة صالحة من نوع <%imageExtensions%>.",
  size: "أقصى حجم ملف مسموح به هو <%fieldName%> كيلوبايت.",
});

validator.addTranslation("fr", {
  required: `Le champ <%fieldName%> est obligatoire.`,
  email: `Veuillez fournir une adresse e-mail valide pour le champ <%fieldName%>.`,
  min: `La longueur minimale de <%fieldName%> est de <%minSize%> caractères.`,
  max: `La longueur maximale de <%fieldName%> est de <%maxSize%> caractères.`,
  match: `Le champ <%fieldName%> et <%matchField%> ne correspondent pas.`,
  enum: `Le champ <%fieldName%> doit être l'un des <%enumParams%>.`,
  image: `Veuillez fournir une image valide (<%imageExtensions%>).`,
  size: `La taille maximale de <%fieldName%> est de <%fileSize%>Ko.`,
});

validator.updateTranslation("en", {
  required: `<%fieldName%> can't be empty!`,
  match: `<%fieldName%> field and <%matchField%> field are not the same.`,
});

let errors = validator
  .setValidation({
    username: ["required", "min:5", "max:20"],
    email: ["required", "email"],
    password: ["required", "min:8", "max:50"],
    passwordConfirm: ["required", "match:password", "min:8", "max:50"],
    photo: ["image:jpeg,png", "size:2048"],
    role: ["required", "enum:user,admin"],
  })
  .setLanguage("en") // French
  .prepare()
  .getObjectErrors();

console.log("====================================");
console.log(errors);
console.log("====================================");

export default Validator;
