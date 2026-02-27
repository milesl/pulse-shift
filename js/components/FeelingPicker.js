const FeelingPicker = {
  props: {
    modelValue: { type: Number, default: 0 }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      feelings: [
        { value: 1, emoji: '\uD83D\uDC80', label: 'Wrecked' },
        { value: 2, emoji: '\uD83D\uDE2E\u200D\uD83D\uDCA8', label: 'Rough' },
        { value: 3, emoji: '\uD83D\uDE10', label: 'Alright' },
        { value: 4, emoji: '\uD83D\uDCAA', label: 'Good' },
        { value: 5, emoji: '\uD83D\uDD25', label: 'Great' }
      ]
    };
  },
  template: `
    <div class="feeling-picker">
      <button
        v-for="f in feelings"
        :key="f.value"
        class="feeling-btn"
        :class="{ active: modelValue === f.value }"
        @click="$emit('update:modelValue', modelValue === f.value ? 0 : f.value)"
      >
        <span>{{ f.emoji }}</span>
        <span class="feeling-label">{{ f.label }}</span>
      </button>
    </div>
  `
};
