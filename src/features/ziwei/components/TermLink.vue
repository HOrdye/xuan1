<template>
  <span
    class="term-link"
    @click.stop="handleClick"
  >
    <slot>{{ term }}</slot>
  </span>
</template>

<script setup lang="ts">
// Props
interface Props {
  term: string;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  'show-term': [term: string];
}>();

// 处理点击
const handleClick = () => {
  emit('show-term', props.term);
};
</script>

<style scoped>
.term-link {
  color: #9333EA;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: rgba(147, 51, 234, 0.3);
  transition: all 0.2s ease;
  font-weight: 500;
}

.term-link:hover {
  color: #7c3aed;
  text-decoration-color: rgba(147, 51, 234, 0.6);
  background: rgba(147, 51, 234, 0.05);
  padding: 0 2px;
  border-radius: 4px;
}
</style>

