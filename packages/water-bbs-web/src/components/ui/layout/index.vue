<template>
  <main class="w-full h-full flex flex-col">
    <div class="w-full min-h-12 py-2 flex border-b border-warm-300 shrink-0 sticky top-0 bg-warm-50 z-10 items-center">
      <div class="size-full flex items-center px-8 justify-between mx-auto">
        <slot name="header" />
      </div>
    </div>
    <div class="w-full h-full flex">
      <slot name="aside" />
      <slot />
    </div>
  </main>
</template>
