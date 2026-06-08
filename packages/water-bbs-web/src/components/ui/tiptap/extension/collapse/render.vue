<script lang="ts" setup>
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/vue-3';
import { UiCollapse, UiCollapseItem } from '@/components/ui';
import { computed } from 'vue';

const props = defineProps<NodeViewProps>();
const label = computed(() => props.node.attrs.label);
</script>

<template>
  <node-view-wrapper>
    <ui-collapse>
      <ui-collapse-item :id="label" :label="label">
        <div class="px-2">
          <node-view-content />
        </div>
      </ui-collapse-item>
    </ui-collapse>
  </node-view-wrapper>
</template>
