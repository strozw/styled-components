"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var t=require("@babel/helper-module-imports"),r=e(require("@babel/traverse")),n=require("babel-plugin-macros"),a=e(require("babel-plugin-styled-components"));function o(){return(o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}var s=n.createMacro((function(e){var n,s=e.references,i=e.state,l=e.babel.types,c=e.config,u=void 0===c?{}:c,p=i.file.path;Object.keys(s).forEach((function(e){var r;"default"===e?(r=t.addDefault(p,"styled-components",{nameHint:"styled"}),n=r):r=t.addNamed(p,e,"styled-components",{nameHint:e}),s[e].forEach((function(e){e.node.name=r.name}))}));var f=o({},i,{opts:u,customImportName:n});r(p.parent,a({types:l}).visitor,void 0,f)}),{configName:"styledComponents"});exports.default=s;
//# sourceMappingURL=styled-components-macro.cjs.js.map
