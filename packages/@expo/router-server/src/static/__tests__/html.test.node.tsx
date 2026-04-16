import {
  ServerDocument,
  type ServerDocumentPayload,
  useServerDocumentContext,
} from 'expo-router/internal/static';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { Html } from '../html';
import { createBootstrapScriptContent } from '../../utils/html';

function createReactNativeWebStylesheet(css: string) {
  return (
    <style
      href="react-native-stylesheet"
      precedence="react-native"
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}

function createStylesheetResourceNodes(hrefs: string[]) {
  return hrefs.flatMap((href) => [
    <link key={`preload:${href}`} rel="preload" href={href} as="style" />,
    <link key={`stylesheet:${href}`} rel="stylesheet" href={href} precedence="default" />,
  ]);
}

function DefaultHtmlWithServerDocument({
  children,
  payload,
}: React.PropsWithChildren<{ payload: ServerDocumentPayload }>) {
  return (
    <ServerDocument value={payload}>
      <Html>{children}</Html>
    </ServerDocument>
  );
}

async function renderStreamingDocument(payload: ServerDocumentPayload) {
  const stream = await ReactDOMServer.renderToReadableStream(
    <DefaultHtmlWithServerDocument payload={payload}>
      <div id="root">hello</div>
    </DefaultHtmlWithServerDocument>,
    {
      bootstrapScriptContent: createBootstrapScriptContent({
        '/test': { message: 'hello' },
      }),
      bootstrapScripts: ['/main.js'],
    }
  );

  await stream.allReady;
  return await new Response(stream).text();
}

describe('server Html', () => {
  it('renders bootstrap integration for the default server document', async () => {
    const html = await renderStreamingDocument({
      bodyNodes: (
        <>
          {createReactNativeWebStylesheet('body{color:red}')}
          {createStylesheetResourceNodes(['/global.css'])}
        </>
      ),
    });

    expect(html).toContain('<style id="expo-reset">#root,body,html{height:100%}');
    expect(html).toContain(
      '<style data-precedence="react-native" data-href="react-native-stylesheet">body{color:red}</style>'
    );
    expect(html).toContain('<link rel="preload" href="/global.css" as="style"/>');
    expect(html).toContain(
      '<script id="_R_">globalThis.__EXPO_ROUTER_HYDRATE__=true;\n' +
        'globalThis.__EXPO_ROUTER_LOADER_DATA__ = JSON.parse("{\\"/test\\":{\\"message\\":\\"hello\\"}}");</script>'
    );
    expect(html).toContain('<script src="/main.js" async=""></script>');
  });
});
