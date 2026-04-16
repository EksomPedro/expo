import { requireNativeModule } from 'expo-modules-core';
import type { ComponentProps } from 'react';

import { UnloadFontOptions } from './Font.types';

export type FontServerResourceDescriptor =
  | {
      type: 'style';
      css: string;
      href: string;
    }
  | {
      type: 'link';
      rel: 'preload';
      href: string;
      as: 'font';
      crossOrigin: ComponentProps<'link'>['crossOrigin'];
    };

export type ExpoFontLoaderModule = {
  getLoadedFonts: () => string[];
  loadAsync: (fontFamilyName: string, localUriOrWebAsset: any) => Promise<void>;
  // the following methods are only available on web
  unloadAllAsync?: () => Promise<void>;
  unloadAsync?: (fontFamilyName: string, options?: UnloadFontOptions) => Promise<void>;
  isLoaded?: (fontFamilyName: string, options?: UnloadFontOptions) => boolean;
  getServerResources?: () => string[];
  getServerResourceDescriptors?: () => FontServerResourceDescriptor[];
  resetServerContext?: () => void;
};

const m: ExpoFontLoaderModule =
  typeof window === 'undefined'
    ? // React server mock
      {
        getLoadedFonts() {
          return [];
        },
        loadAsync() {
          return Promise.resolve();
        },
      }
    : requireNativeModule('ExpoFontLoader');
export default m;
