/* eslint-disable import/no-duplicates */
/// <reference lib="dom" />

// CSS modules
type CSSModuleClasses = { readonly [key: string]: string };

declare module '*.module.css' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.scss' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.sass' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.less' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.styl' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.stylus' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.pcss' {
  const classes: CSSModuleClasses;
  export default classes;
}

// CSS
declare module '*.css' {
  const css: string;
  export default css;
}
declare module '*.scss' {
  const css: string;
  export default css;
}
declare module '*.sass' {
  const css: string;
  export default css;
}
declare module '*.less' {
  const css: string;
  export default css;
}
declare module '*.styl' {
  const css: string;
  export default css;
}
declare module '*.stylus' {
  const css: string;
  export default css;
}
declare module '*.pcss' {
  const css: string;
  export default css;
}

// Built-in asset types
// see `src/constants.ts`

// images
declare module '*.jpg' {
  import * as React from 'react';
  export type SVGProps = Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    'src'
  >;
  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}
declare module '*.jpeg' {
  import * as React from 'react';
  export type SVGProps = Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    'src'
  >;
  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}
declare module '*.png' {
  import * as React from 'react';
  export type SVGProps = Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    'src'
  >;
  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}
declare module '*.gif' {
  import * as React from 'react';
  export type SVGProps = Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    'src'
  >;
  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}
declare module '*.svg' {
  import * as React from 'react';
  export type SVGProps = Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    'src'
  >;
  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}
declare module '*.ico' {
  import * as React from 'react';
  export type SVGProps = Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    'src'
  >;
  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}
declare module '*.webp' {
  import * as React from 'react';
  export type SVGProps = Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    'src'
  >;
  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}

// media
declare module '*.mp4' {
  const src: string;
  export default src;
}
declare module '*.webm' {
  const src: string;
  export default src;
}
declare module '*.ogg' {
  const src: string;
  export default src;
}
declare module '*.mp3' {
  const src: string;
  export default src;
}
declare module '*.wav' {
  const src: string;
  export default src;
}
declare module '*.flac' {
  const src: string;
  export default src;
}
declare module '*.aac' {
  const src: string;
  export default src;
}

// fonts
declare module '*.woff' {
  const src: string;
  export default src;
}
declare module '*.woff2' {
  const src: string;
  export default src;
}
declare module '*.eot' {
  const src: string;
  export default src;
}
declare module '*.ttf' {
  const src: string;
  export default src;
}
declare module '*.otf' {
  const src: string;
  export default src;
}

// web worker
declare module '*?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module '*?worker&inline' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module '*?sharedworker' {
  const sharedWorkerConstructor: {
    new (): SharedWorker;
  };
  export default sharedWorkerConstructor;
}

declare module '*?raw' {
  const src: string;
  export default src;
}

declare module '*?url' {
  const src: string;
  export default src;
}
