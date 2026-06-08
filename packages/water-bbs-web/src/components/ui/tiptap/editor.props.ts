import type { AnyExtension, Editor } from '@tiptap/vue-3';
import type { Component, InjectionKey } from 'vue';

export type EditorContext = {
  setSource: (isSource: boolean) => void;
  extensions: Ext[];
  editor: Editor;
};

export const EditorContextKey: InjectionKey<EditorContext> = Symbol('editor.context');

export type Ext = {
  icon: Component | null;
  extension: AnyExtension | null;
  isActive: ((editor: Editor) => boolean) | (() => void);
  onClick?: ((editor: Editor) => void) | (() => void);
};

export type ContentType = 'json' | 'html' | 'markdown';

export type EditorProps = {
  content: object | string;
  readonly?: boolean;
  wysiwyg?: boolean;
  extensions?: Ext[];
  contentType?: ContentType;
};
