interface Validators {
  required(field: string): void;
  email(field: string): void;
  match(field: string, matchField: string): void;
  max(field: string, maxSize: string): void;
  min(field: string, minSize: string): void;
  imageSize(field: string, imageSize: string | number): void;
  image(field: string, extensions: string[]): void;
  enum(field: string, enumParams: string[]): void;
}

export default Validators;
