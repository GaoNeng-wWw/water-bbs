<script lang="ts" setup>
import { ProgressRoot, ProgressIndicator } from 'reka-ui';
</script>

<template>
  <div class="w-full flex flex-col gap-2 bg-surface-100 p-2 rounded-md border border-solid border-surface-200 text-surface-fg">
    <div class="w-full flex gap-2 items-center">
      <router-link class="transition duration-fast hover:text-primary" to="/proposal/123">
        <p class="text-xl">
          Proposal Name
        </p>
      </router-link>
      <div class="badge">
        剩余2天
      </div>
    </div>
    <div
      class="w-full line-clamp-2"
      title="Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus atque, repellat voluptatem dicta autem expedita veniam voluptas eaque, exercitationem numquam explicabo corporis reprehenderit nostrum! Totam error accusantium eaque fugiat iusto?"
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus atque, repellat voluptatem dicta autem expedita veniam voluptas eaque, exercitationem numquam explicabo corporis reprehenderit nostrum! Totam error accusantium eaque fugiat iusto?
    </div>
    <progress-root
      class="rounded-full relative h-2 w-full overflow-hidden bg-surface-50 border border-surface-200"
    >
      <progress-indicator
        :agreen="50"
        :disagreen="50"
        class="indicator"
        style="transform: translateX(0%)"
      />
    </progress-root>
    <div class="w-full grid grid-cols-2 content-center place-items-center">
      <div class="grid cols-2">支持: 50</div>
      <div class="grid cols-2">反对: 50</div>
    </div>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';
@reference "../../../../assets/style.css";

.badge {
  @apply w-fit h-fit px-1.5 py-0.5 rounded-full text-xs bg-warning-900;
}
.indicator {
  @apply rounded-full block absolute left-0 top-0 w-full h-full bg-success-500 transition-transform overflow-hidden duration-660;
  background: linear-gradient(
    to right,
    var(--color-success-500) calc(1% * attr(agreen type(<number>))),
    var(--color-danger-500) calc(1% * attr(disagreen type(<number>)))
    );
}
</style>
