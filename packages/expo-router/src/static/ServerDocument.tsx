import React, { PropsWithChildren, ReactNode, useContext } from 'react';

export type ServerDocumentPayload = {
  headNodes?: ReactNode;
  bodyNodes?: ReactNode;
  htmlAttributes?: React.ComponentProps<'html'>;
  bodyAttributes?: React.ComponentProps<'body'>;
};

const EMPTY_DOCUMENT: ServerDocumentPayload = {};

export const ServerDocumentContext = React.createContext<ServerDocumentPayload>(EMPTY_DOCUMENT);

export function useServerDocumentContext(): ServerDocumentPayload {
  return useContext(ServerDocumentContext);
}

export function ServerDocument({
  children,
  value,
}: PropsWithChildren<{ value: ServerDocumentPayload }>) {
  return <ServerDocumentContext value={value}>{children}</ServerDocumentContext>;
}
