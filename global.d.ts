// src/global.d.ts or types/global.d.ts

// Declare the "quill-image-resize" module
declare module "quill-image-resize" {
  const ImageResize: any;
  export default ImageResize;
}

// You can also include declarations for other third-party modules as needed
declare module "quill" {
  export interface QuillOptionsStatic {
    debug?: boolean | string;
    modules?: Record<string, any>;
    placeholder?: string;
    readOnly?: boolean;
    theme?: string | null;
  }

  export default class Quill {
    static register(path: string, module: any): void;
    constructor(selector: string | Element, options?: QuillOptionsStatic);
  }
}
