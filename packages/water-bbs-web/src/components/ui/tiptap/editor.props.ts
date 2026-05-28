import type { InjectionKey, Ref } from 'vue';

export type EditorContext = {
  setSource: (isSource: boolean) => void;
};

export const EditorContextKey: InjectionKey<EditorContext> = Symbol('editor.context');
