import { Plugin } from 'vite';

const fileRegex = /\.(svg|jpg|jpeg|png|gif|ico|webp)$/;

export default function imageLoader(): Plugin {
  return {
    name: 'imageLoader',
    transform(src, id) {
      if (fileRegex.test(id)) {
        const url = src.match(/export default ["'](.*)["']/)?.[1] ?? id;
        return {
          code: `
import React from 'react';
export const component = props =>
  React.createElement('img', { ...props, src: '${url}' });
export const url = '${url}';
export default component;
//# sourceURL=${url}
`,
          map: null,
        };
      }
    },
  };
}
