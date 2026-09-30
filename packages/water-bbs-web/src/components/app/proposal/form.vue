<script lang="ts" setup>
import { computed, reactive, watch, useTemplateRef, ref } from 'vue';
import { UiForm, UiFormItem, UiInput } from '@/components/ui';
import { getStepDef, type ProposalStep, type StepInfo } from '@/api';
import StepUiRender from './step/ui-render.vue';
import StepPicker from './step-picker.vue';
import { motion, AnimatePresence } from 'motion-v';
import { Icon } from '@iconify/vue';
import { UiButton, UiCheckbox, UiCalendarSelectField } from '@/components/ui';
import z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { createCalendarDate, createNowCalendarDate, getUserTimezone } from '@/helper';
import { createProposal } from '@/api';

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

const emits = defineEmits<{
  successed: [string];
  failed: [string];
  done: [];
}>();

const form = reactive<Record<string, any>>({
  endAt: createNowCalendarDate().toDate(getUserTimezone()).toISOString(),
});
const render = useTemplateRef('render');
const formRef = useTemplateRef('formRef');
const steps = reactive(new Set<{ info: StepInfo; collapse: boolean }>([]));
const stepData = reactive<Record<string, any>>({});
const disabled = computed(() => {
  return Array.from(steps).map(s => s.info.key);
});
const loading = ref(false);

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
  if (disabled.value.includes(key)) {
    return;
  }
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
const onSubmit = async () => {
  loading.value = true;
  if (!render.value || !render.value.length) {
    loading.value = false;
    return;
  }
  if (!formRef.value) {
    loading.value = false;
    return;
  }
  const validateResult = await formRef.value.validate();
  if (!validateResult.valid) {
    loading.value = false;
    return;
  }

  const validateOk = await Promise.all(
    render.value.map(r => r?.validate()),
  );
  if (
    !validateOk
      .filter(v => v !== undefined)
      .every(v => v)
  ) {
    loading.value = false;
    return;
  }
  const steps: ProposalStep[] = [];
  for (const [name, data] of Object.entries(stepData)) {
    steps.push({
      stepName: name,
      param: data,
    });
  }
  createProposal({
    body: {
      content: form.description,
      title: form.title,
      kind: form.emergency ? 'emergency' : 'normal',
      steps,
      proposalEndAt: createCalendarDate(form.endAt).toDate(getUserTimezone()),
    },
  })
    .then(data => data.data!)
    .then((data) => {
      emits('successed', data.id);
    })
    .catch((reason) => {
      emits('failed', reason.toString());
    })
    .finally(() => {
      loading.value = false;
      emits('done');
    });
};

const schema = toTypedSchema(z.object({
  title: z.string(),
  description: z.string(),
}));
</script>

<template>
  <div>
    <ui-form ref="formRef" :model="form" :schema="schema" trigger-method="change">
      <ui-form-item prop="title" label="标题" required>
        <ui-input v-model="form.title" placeholder="请输入标题" />
      </ui-form-item>
      <ui-form-item prop="description" label="描述">
        <ui-input v-model="form.description" placeholder="请输入描述" />
      </ui-form-item>
      <ui-form-item v-governance-member prop="emergency" label="紧急提案">
        <ui-checkbox v-model="form.emergency" />
      </ui-form-item>
      <ui-form-item v-governance-member prop="endAt" label="提案结束时间">
        <ui-calendar-select-field v-model="form.endAt" />
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
              <div v-if="allowAddStep" class="p-1 rounded hover:bg-danger-100" @click.stop="() => removeStep(step.info.key)">
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
                ref="render"
                v-model="stepData[step.info.key]"
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
      <ui-button size="full" color="primary" :loading="loading" @click="onSubmit">
        提交
      </ui-button>
    </div>
  </div>
</template>
