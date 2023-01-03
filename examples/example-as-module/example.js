import Validator from "devlogs-validator";

const data = {
  name: "",
};

const validator = new Validator(data);
const errors = validator
  .setValidation({ name: ["required"] })
  .setMessages({ name: { required: "Name is required" } })
  .prepare()
  .getObjectErrors();

console.log(errors);
