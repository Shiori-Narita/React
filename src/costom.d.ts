declare module '*.svg' {
    import * as React from 'react';
  
    export const svgReactComponent: React.FC<React.SVGProps<
      SVGSVGElement
    > >;
  

  }