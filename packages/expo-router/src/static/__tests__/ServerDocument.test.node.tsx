import { ScrollViewStyleReset } from '../html';
import { ServerDocument, useServerDocumentContext, type ServerDocumentPayload } from '../ServerDocument';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

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

function DocumentHtml({ children }: React.PropsWithChildren) {
  const { bodyAttributes, bodyNodes, headNodes, htmlAttributes } = useServerDocumentContext();

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <ScrollViewStyleReset />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}

function CustomHtml({ children }: React.PropsWithChildren) {
  const { bodyNodes } = useServerDocumentContext();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body data-custom="true">
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}

async function renderStreamingDocument(
  payload: ServerDocumentPayload,
  Root: React.ComponentType<React.PropsWithChildren> = DocumentHtml
) {
  const stream = await ReactDOMServer.renderToReadableStream(
    <ServerDocument value={payload}>
      <Root>
        <div id="root">hello</div>
      </Root>
    </ServerDocument>
  );

  await stream.allReady;
  return await new Response(stream).text();
}

describe('ServerDocument', () => {
  it('renders late body nodes into the head via React hoisting', async () => {
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
      '<link rel="stylesheet" href="/global.css" data-precedence="default"/>'
    );
    expect(html).not.toContain('<style href="react-native-stylesheet"');
  });

  it('supports custom html documents that render bodyNodes after children', async () => {
    const html = await renderStreamingDocument(
      {
        bodyNodes: <>{createReactNativeWebStylesheet('body{color:red}')}</>,
      },
      CustomHtml
    );

    expect(html).toContain('<body data-custom="true"><div id="root">hello</div></body>');
    expect(html).toContain(
      '<style data-precedence="react-native" data-href="react-native-stylesheet">body{color:red}</style>'
    );
  });
});
