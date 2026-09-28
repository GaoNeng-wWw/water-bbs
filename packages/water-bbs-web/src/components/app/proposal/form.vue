<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import {
  UiForm, UiFormItem, UiInput,
} from '@/components/ui';
import { getStepDef, type StepInfo } from '@/api';
import StepUiRender from './step/ui-render.vue';
import StepPicker from './step-picker.vue';
import { motion, AnimatePresence } from 'motion-v';
import { Icon } from '@iconify/vue';
import { UiButton } from '@/components/ui';

interface StepFieldConfig {
  disabled?: string[];
  defaults?: Record<string, any>;
}

const {
  size = 1,
  allowAddStep = true,
  defaultSteps = [],
  stepFieldConfig = {},
} = defineProps<{
  size?: number;
  allowAddStep?: boolean;
  defaultSteps?: string[];
  stepFieldConfig?: Record<string, StepFieldConfig>;
}>();

const form = reactive<Record<string, any>>({});

const steps = reactive(new Set<{ info: StepInfo; collapse: boolean }>([]));
const disabled = computed(() => {
  return Array.from(steps).map(s => s.info.key);
});

const getStepFieldConfig = (key: string) => stepFieldConfig[key] ?? {};

const getFormData = () => form;

defineExpose({ getFormData });

watch(
  () => defaultSteps,
  async (val) => {
    for (const key of val) {
      if (Array.from(steps).some(s => s.info.key === key)) {
        continue;
      }
      const resp = await getStepDef({ path: { id: key } });
      if (!resp.data) {
        continue;
      }
      steps.add({ info: resp.data, collapse: false });
    }
  },
  { immediate: true },
);

const removeStep = (key: string) => {
  const st = Array.from(steps).find(s => s.info.key === key);
  if (st) {
    steps.delete(st);
  }
};
const onSelect = (info: StepInfo) => {
  if (steps.size >= size) {
    return;
  }
  steps.add({
    info,
    collapse: false,
  });
};
</script>

<template>
  <div>
    <ui-form>
      <ui-form-item prop="title" label="标题">
        <ui-input v-model="form.title" placeholder="请输入标题" />
      </ui-form-item>
      <ui-form-item prop="description" label="描述">
        <ui-input v-model="form.description" placeholder="请输入描述" />
      </ui-form-item>
      <ui-form-item prop="steps" label="行为">
        <div v-for="step in steps" :key="step.info.key" class="mb-2">
          <animate-presence>
            <div
              class="
            w-full justify-between! transition duration-fast ease-in-out rounded-md cursor-pointer flex items-center
          "
              @click="() => step.collapse = !step.collapse"
            >
              <div class="flex text-surface-fg items-center gap-2 hover:bg-surface-100 w-fit px-2 py-1 rounded-md">
                <icon :data-active="!step.collapse" icon="radix-icons:chevron-down" class="transition duration-fast ease-in-out size-4 data-[active=true]:rotate-180" />
                {{ step.info.key }}
              </div>
              <div class="p-1 rounded hover:bg-danger-100" @click.stop="() => removeStep(step.info.key)">
                <icon icon="radix-icons:trash" class="text-danger transition duration-fast ease-in-out rounded-md size-5" />
              </div>
            </div>
            <motion.div
              v-if="!step.collapse"
              :key="`${step.info.key}-content`"
              :initial="{ height: '0', opacity: 0 }"
              :animate="{ height: 'auto', opacity: 1 }"
              :exit="{ height: '0', opacity: 0 }"
              class="overflow-hidden px-2 "
            >
              <step-ui-render
                v-model="form[step.info.key]"
                :ui="step.info.ui"
                :param="step.info.param as any"
                :disabled-fields="getStepFieldConfig(step.info.key).disabled"
                :default-values="getStepFieldConfig(step.info.key).defaults"
              />
            </motion.div>
          </animate-presence>
        </div>
        <step-picker v-if="allowAddStep" :disabled="disabled" @select="onSelect" />
      </ui-form-item>
    </ui-form>
    <div class="w-full mt-2">
      <ui-button size="full" color="primary">
        提交
      </ui-button>
    </div>
  </div>
</template>
