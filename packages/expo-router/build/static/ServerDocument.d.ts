import React, { PropsWithChildren, ReactNode } from 'react';
export type ServerDocumentPayload = {
    headNodes?: ReactNode;
    bodyNodes?: ReactNode;
    htmlAttributes?: React.ComponentProps<'html'>;
    bodyAttributes?: React.ComponentProps<'body'>;
};
export declare const ServerDocumentContext: React.Context<ServerDocumentPayload>;
export declare function useServerDocumentContext(): ServerDocumentPayload;
export declare function ServerDocument({ children, value, }: PropsWithChildren<{
    value: ServerDocumentPayload;
}>): React.JSX.Element;
//# sourceMappingURL=ServerDocument.d.ts.map