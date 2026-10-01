import { defineComponent, h, ref, reactive, Teleport, type VNode, type Component, type PropType } from 'vue';
import { motion, AnimatePresence } from 'motion-v';
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, Slot } from 'reka-ui';

const defaultOrigin = () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

interface ModalEntry {
  id: number;
  vnode: VNode;
  origin: { x: number; y: number };
  open: boolean;
}

let nextId = 0;
let pendingOrigin: { x: number; y: number } | null = null;
const modals = reactive<ModalEntry[]>([]);

const closeModal = (id: number) => {
  const modal = modals.find(m => m.id === id);
  if (modal) {
    modal.open = false;
  }
};

const removeModal = (id: number) => {
  const idx = modals.findIndex(m => m.id === id);
  if (idx > -1) {
    modals.splice(idx, 1);
  }
};

const render = (vnode: VNode) => {
  const origin = pendingOrigin ?? defaultOrigin();
  pendingOrigin = null;
  const id = nextId++;
  modals.push({
    id,
    vnode,
    origin,
    open: true,
  });
  return id;
};

const remove = (id: number) => {
  closeModal(id);
};

const unmountAll = () => {
  modals.splice(0, modals.length);
};

export const ModalHost = defineComponent({
  name: 'UseModalHost',
  setup() {
    return () => {
      if (!modals.length) {
        return null;
      }
      return modals.map(modal =>
        h(DialogRoot, {
          'key': modal.id,
          'open': modal.open,
          'onUpdate:open': (v: boolean) => {
            if (!v) {
              closeModal(modal.id);
            }
          },
        }, () => [
          h(DialogPortal, () => [
            h(DialogOverlay, { class: 'fixed inset-0 bg-black/20', onClick: () => closeModal(modal.id) }),
            h(AnimatePresence, () =>
              modal.open
                ? h(
                  DialogContent,
                  { asChild: true, onInteractOutside: () => closeModal(modal.id) },
                  () =>
                    h(
                      motion.div,
                      {
                        key: modal.id,
                        class: 'fixed top-0 left-0 max-w-lg w-full p-4 rounded-md bg-surface-200 flex flex-col',
                        initial: {
                          opacity: 0,
                          scale: 0,
                          left: `${modal.origin.x}px`,
                          top: `${modal.origin.y}px`,
                          x: '-50%',
                          y: '-50%',
                        },
                        animate: {
                          opacity: 1,
                          scale: 1,
                          left: '50%',
                          top: '50%',
                          x: '-50%',
                          y: '-50%',
                        },
                        exit: {
                          opacity: 0,
                          scale: 0,
                          left: `${modal.origin.x}px`,
                          top: `${modal.origin.y}px`,
                          x: '-50%',
                          y: '-50%',
                        },
                        onAnimationComplete: () => {
                          if (!modal.open) {
                            removeModal(modal.id);
                          }
                        },
                      },
                      () => [
                        modal.vnode,
                        h(
                          DialogClose,
                          { class: 'mr-0 ml-auto -order-1 cursor-pointer flex items-center justify-center', onClick: () => closeModal(modal.id) },
                          () => [
                            h('div', { class: 'icon-[material-symbols--close] size-6 text-bg-fg' }),
                            h('span', { class: 'sr-only' }, 'Close'),
                          ],
                        ),
                      ],
                    ),
                )
                : null,
            ),
          ]),
        ]),
      );
    };
  },
});

export const useModal = () => {
  const primitiveEl = ref<HTMLElement | null>(null);

  const getOrigin = (): { x: number; y: number } => {
    if (!primitiveEl.value) {
      return defaultOrigin();
    }
    const el = primitiveEl.value instanceof HTMLElement
      ? primitiveEl.value
      : (primitiveEl.value as any).$el as HTMLElement | null;
    if (!el) {
      return defaultOrigin();
    }
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const Primitive = defineComponent({
    name: 'UseModalPrimitive',
    inheritAttrs: false,
    props: {
      asChild: { type: Boolean, default: false },
      as: { type: [String, Object] as PropType<string | Component>, default: 'div' },
    },
    setup(props, { attrs, slots }) {
      const onClick = () => {
        pendingOrigin = getOrigin();
      };

      return () => {
        const merged = { ...attrs, ref: primitiveEl, onClick };
        if (props.asChild) {
          return h(Slot, merged, slots);
        }
        return h(props.as, merged, slots);
      };
    },
  });

  return {
    render,
    Primitive: Primitive as Component,
    remove,
    unmountAll,
  };
};