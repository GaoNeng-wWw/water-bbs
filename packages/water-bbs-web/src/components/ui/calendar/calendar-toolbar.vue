<script setup lang="ts">
import { UiButton } from '@/components/ui';
import { useContext } from './context';

const { currentDate, toYearView, toMonthView, toDayView } = useContext();
</script>

<template>
  <div class="text-surface-fg/50 space-x-2">
    <ui-button variant="ghost" size="sm" html-type="button" @click="toYearView">
      {{ currentDate.year }}
    </ui-button>
    <span>/</span>
    <ui-button variant="ghost" size="sm" html-type="button" @click="toMonthView">
      {{ currentDate.month.toString().padStart(2, '0') }}
    </ui-button>
    <span>/</span>
    <ui-button variant="ghost" size="sm" html-type="button" @click="toDayView">
      {{ currentDate.day.toString().padStart(2, '0') }}
    </ui-button>
  </div>
</template>
