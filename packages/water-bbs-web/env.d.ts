import type { Directive } from 'vue';
import { GovernanceMemberKind, vGovernanceMember, vAuthed } from './src/directive';


interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type GovernanceMemberElement = HTMLElement & {
  __governance_member_anchor?: Comment;
  __governance_member_stop?: () => void;
};

declare module 'vue' {
  export interface GlobalDirectives {
    vAuthed: typeof vAuthed;
    vGovernanceMember: typeof vGovernanceMember;
  }
}
export {};
