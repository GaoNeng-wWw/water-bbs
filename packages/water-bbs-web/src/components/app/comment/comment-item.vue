<script lang="ts" setup>
import { useToggle } from '@vueuse/core';
import { createHashvatar } from 'hashvatar';
import {
  UiAvatar,
  UiButton,
  UiPopover,
  UiPopoverContent,
  UiPopoverTrigger,
  UiListbox,
  UiListboxSection,
  UiListboxItem,
} from '@/components/ui';
import { motion, AnimatePresence } from 'motion-v';
import { useContext } from './context';
import commentEditor from './comment-editor.vue';
import commentList from './comment-list.vue';

const { replyId, loading } = defineProps<{
  replyId: string;
  authorId: string;
  nick: string;
  content: string;
  expandable: boolean;
  loading: boolean;
}>();

const [editorVisiblity, toggleEditorVisiblity] = useToggle(false);
const [subTreeVisiblity, toggleSubTreeVisibility] = useToggle(false);

const getAvatarBase64 = (id: string) => {
  const { canvas } = createHashvatar({
    hash: id,
  });
  return canvas.toDataURL('image/webp');
};

const { commentId, onSubmit, loadingReply } = useContext();

const handleSubmit = (content: string) => {
  onSubmit({ commentId: commentId.value, content, replyId });
};
</script>

<template>
  <div class="w-full">
    <div class="w-full flex gap-3">
      <div class="shrink-0">
        <ui-avatar
          size="sm"
          :border="false"
          :url="getAvatarBase64(authorId as unknown as string)"
          :fallback-text="nick"
        />
      </div>
      <div class="shrink grow">
        <p class="text-surface-fg">
          {{ nick }}
        </p>
        <div class="w-full">
          <div class="w-full wrap-break-word mt-2 text-surface-fg">
            {{ content }}
          </div>
        </div>
      </div>
    </div>
    <div class="w-full mt-2 flex gap-2">
      <div class="min-w-8">
        <ui-button v-if="expandable" size="sm" variant="ghost" :loading="loading" icon @click="() => toggleSubTreeVisibility()">
          <div class="size-4 icon-[bi--chevron-expand]" />
        </ui-button>
      </div>
      <div class="w-full">
        <div class="flex gap-1">
          <ui-button size="sm" variant="ghost" icon @click="() => toggleEditorVisiblity()">
            <div class="icon-[boxicons--message-circle-reply-filled] size-4" />
          </ui-button>
          <ui-popover>
            <ui-popover-trigger>
              <ui-button icon variant="ghost" size="sm">
                <div class="icon-[material-symbols--more-horiz] size-4 text-surface-fg" />
              </ui-button>
            </ui-popover-trigger>
            <ui-popover-content class="w-50!">
              <ui-listbox mode="none">
                <ui-listbox-section label="行为">
                  <ui-listbox-item id="report" value="report" danger>
                    举报
                  </ui-listbox-item>
                </ui-listbox-section>
              </ui-listbox>
            </ui-popover-content>
          </ui-popover>
        </div>
        <animate-presence>
          <motion.div
            v-show="editorVisiblity"
            class="overflow-hidden mt-2"
            :initial="{ height: '0', opacity: 0 }"
            :animate="{ height: 'auto', opacity: 1 }"
            :exit="{ height: '0', opacity: 0 }"
          >
            <comment-editor :loading="loadingReply.has(replyId)" @submit="handleSubmit" @cancel="() => toggleEditorVisiblity(false)" />
          </motion.div>
        </animate-presence>
        <animate-presence>
          <motion.div
            v-if="subTreeVisiblity"
            class="overflow-hidden mt-2"
            :initial="{ height: '0', opacity: 0 }"
            :animate="{ height: 'auto', opacity: 1 }"
            :exit="{ height: '0', opacity: 0 }"
          >
            <comment-list :comment-id="commentId" :parent-id="replyId" :size="20" />
          </motion.div>
        </animate-presence>
      </div>
    </div>
  </div>
</template>
