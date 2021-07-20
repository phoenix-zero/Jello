import { Plugin } from 'vite';

const fileRegex = /\.(svg|jpg|jpeg|png|gif|svg|ico|webp)$/;

export default function myPlugin(): Plugin {
  return {
    name: 'imageLoader',
    transform(_src, id) {
      if (fileRegex.test(id)) {
        return {
          code: `
import React from 'react';
export default (props) => React.createElement("img",{...props,src:"${id}"})
`,
          map: null,
        };
      }
    },
  };
}
