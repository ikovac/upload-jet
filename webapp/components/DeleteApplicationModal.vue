<template>
  <BaseModal ref="baseModalRef" @close="$emit('close')">
    <template v-slot:header>
      <h2 class="text-center text-xl uppercase">Delete Application</h2>
    </template>
    <template v-slot:content>
      <p>Are you sure you want to permanently delete {{ applicationName }}?</p>
    </template>
    <template #error v-if="errorMessage">
      <div class="text-red-700">{{ errorMessage }}</div>
    </template>
    <template v-slot:footer>
      <button
        @click="closeModal"
        class="rounded-sm border-2 bg-gray-300 p-2 text-black hover:bg-gray-400">
        Cancel
      </button>
      <button
        @click="emit('delete:application', id)"
        class="rounded-sm border-2 bg-gray-500 p-2 text-white hover:bg-red-500">
        Delete
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: Number, default: null },
  applicationName: { type: String, default: null },
  errorMessage: { type: String, default: '' }
});

const emit = defineEmits<{
  'delete:application': [id: number];
  close: [];
}>();

const baseModalRef = ref();

const { showModal, closeModal } = useModal(baseModalRef);

defineExpose({
  showModal,
  closeModal
});
</script>
