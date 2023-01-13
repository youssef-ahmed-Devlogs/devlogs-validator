interface Validators {
  required(field: string): void;
  email(field: string): void;
  match(field: string, matchField: string): void;
  max(field: string, maxSize: string): void;
  min(field: string, minSize: string): void;
  imageSize(image: any, field: string, imageSize: string | number): void;
  image(image: any, field: string, extensions: string[]): void;
  enum(field: string, enumParams: string[]): void;
}

export default Validators;
