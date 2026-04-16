"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Html = Html;
/**
 * Copyright © 2023 650 Industries.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const html_1 = require("expo-router/html");
const static_1 = require("expo-router/internal/static");
const react_1 = __importDefault(require("react"));
function Html({ children }) {
    const { bodyAttributes, bodyNodes, headNodes, htmlAttributes } = (0, static_1.useServerDocumentContext)();
    return (<html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <html_1.ScrollViewStyleReset />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>);
}
//# sourceMappingURL=html.js.map