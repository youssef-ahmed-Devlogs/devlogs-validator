import Validator from "./node_modules/devlogs-validator/Validator.js";

const form = document.getElementById("example");
const { username, email, password, passwordConfirm, role, photo } = form;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {
    username: username.value,
    email: email.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value,
    role: role.value,
    photo: photo.files[0] || "",
  };

  const validator = new Validator(formData);
  const errors = validator
    .setValidation({
      username: ["required", "min:5", "max:20"],
      email: ["required", "email"],
      password: ["required", "min:8", "max:50"],
      passwordConfirm: ["required", "match:password", "min:8", "max:50"],
      photo: ["image:jpeg,png", "size:2048"],
      role: ["required", "enum:user,admin"],
    })
    .setMessages({
      username: {
        required: "Username field is required.",
        min: "Username must be at least 5 characters.",
        max: "Username characters max 20.",
      },
      email: {
        required: "Email field is required.",
        email: "Please provide a valid email.",
      },
      password: {
        required: "Password is required",
        min: "Password must be at least 8 characters.",
        max: "Password characters max 50.",
      },
      passwordConfirm: {
        required: "Password confirm is required",
        match: "Passwords are not the same.",
        min: "Password confirm must be at least 8 characters.",
        max: "Password confirm characters max 50.",
      },
      photo: {
        image: "Please provide a valid image (jpeg, png).",
        size: "Max size is 2048KB.",
      },
      role: {
        required: "Role is required",
        enum: "Role value must be in (user, admin)",
      },
    })
    .prepare()
    //.getErrors(); // get errors as array
    .getObjectErrors(); // get errors as object

  // Remove error elements values
  form
    .querySelectorAll(".form-item .error")
    .forEach((ele) => (ele.textContent = ""));

  // Set error in the corresponding error element
  for (let key in errors) {
    document.getElementById(`${key}-error`).textContent = errors[key];
  }

  if (Object.keys(errors).length == 0) {
    alert("User created successfully.");
  }
});
