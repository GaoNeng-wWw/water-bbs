<template>
  <main class="w-full h-full flex flex-col">
    <div class="w-full min-h-12 h-fit py-2 flex border-b border-warm-300 shrink-0 sticky top-0 bg-warm-50 z-10 items-center z-auto">
      <div class="size-full flex items-center px-8 justify-between mx-auto h-fit">
        <slot name="header" />
      </div>
    </div>
    <div class="w-full grow min-h-0">
      <slot name="aside" />
      <slot />
    </div>
  </main>
</template>
