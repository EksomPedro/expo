import type { ComponentProps } from 'react';
import { UnloadFontOptions } from './Font.types';
export type FontServerResourceDescriptor = {
    type: 'style';
    css: string;
    href: string;
} | {
    type: 'link';
    rel: 'preload';
    href: string;
    as: 'font';
    crossOrigin: ComponentProps<'link'>['crossOrigin'];
};
export type ExpoFontLoaderModule = {
    getLoadedFonts: () => string[];
    loadAsync: (fontFamilyName: string, localUriOrWebAsset: any) => Promise<void>;
    unloadAllAsync?: () => Promise<void>;
    unloadAsync?: (fontFamilyName: string, options?: UnloadFontOptions) => Promise<void>;
    isLoaded?: (fontFamilyName: string, options?: UnloadFontOptions) => boolean;
    getServerResources?: () => string[];
    getServerResourceDescriptors?: () => FontServerResourceDescriptor[];
    resetServerContext?: () => void;
};
declare const m: ExpoFontLoaderModule;
export default m;
//# sourceMappingURL=ExpoFontLoader.d.ts.map