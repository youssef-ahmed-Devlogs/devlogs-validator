# devlogs-validator.js

[![NPM version][npm-image]][npm-url]

Devlogs Validator is a library to validate data in client or server.
documentation

## Where can I use it?

Devlogs Validator is a library to validate data in a client or server. Which means that you can use devlogs-validator to validate data in any technology that uses javascript. ( a standalone Javascript, React.js, Node.js, Angular, vue, etc.)

## Installation and Usage

Install the library with `npm install devlogs-validator`

#### No ES6

```javascript
var Validator = require("devlogs-validator");
```

#### ES6

```javascript
import Validator from "devlogs-validator";
```

#### Imagine that you have a form with this data

```javascript
const formData = {
  username: "youssef27", // document.querySelector("form input#username")
  email: "youssef@gmail.com",
  password: "12345678",
  passwordConfirm: "12345678",
  role: "admin",
  photo: {
    type: "image/jpeg",
    size: "421123", // Byte
  },
};
```

#### Set Validation

```javascript
const validator = new Validator(formData);
let errors = validator.setValidation({
  username: ["required", "min:5", "max:20"],
  email: ["required", "email"],
  password: ["required", "min:8", "max:50"],
  passwordConfirm: ["required", "match:password", "min:8", "max:50"],
  photo: ["image:jpeg,png", "size:2048"],
  role: ["required", "enum:user,admin"],
});
```

#### Set Messages

```javascript
errors.setMessages({
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
});
```

#### Prepare and return errors as object or array

```javascript
errors = errors.prepare().getObjectErrors(); // get errors as object
//.getErrors(); // get errors as array
```

#### The entire example

```javascript
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
```

#### Available ["FLAGS"]

```javascript
"required"; // Check if a certain field is not empty.
"email"; // Check if a certain field is a valid email address.
"match:(field)"; // Check if a certain field value is equal to another field value. ["match:password"]
"min:(number)"; // Set a certain minimum length. ["min:8"]
"max:(number)"; // Set a certain maximum length. ["max:100"]
"image:(extensions)"; // Check if a certain image field is an image with certain extensions. ["image:jpeg,png,jpg"]
"size:(KB)"; // Set a certain file size in KB. ["size:2048"]
"enum:(values)"; // Set a certain values. ["enum:user,admin"]
```

[npm-url]: https://www.npmjs.com/package/devlogs-validator
