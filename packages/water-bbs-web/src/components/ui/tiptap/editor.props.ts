import type { AnyExtension, Editor } from '@tiptap/vue-3';
import type { Component, InjectionKey } from 'vue';

export type EditorContext = {
  setSource: (isSource: boolean) => void;
  extensions: Ext[];
  editor: Editor;
};

export const EditorContextKey: InjectionKey<EditorContext> = Symbol('editor.context');

export type Ext<T extends Record<string, any>> = {
  icon: Component | null;
  extension: T | null;
  options?: T['options'];
  isActive: ((editor: Editor) => boolean) | (() => void);
  onClick?: ((editor: Editor) => void) | (() => void);
};

export type ContentType = 'json' | 'html' | 'markdown';

export type EditorProps = {
  content?: object | string;
  readonly?: boolean;
  wysiwyg?: boolean;
  extensions?: Ext<Record<string, any>>[];
  contentType?: ContentType;
};
