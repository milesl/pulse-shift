const MealRater = {
  props: {
    label: { type: String, required: true },
    modelValue: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  template: `
    <div class="meal-rater">
      <span class="meal-rater-label">{{ label }}</span>
      <div class="meal-rater-buttons">
        <button
          class="btn btn-good"
          :class="{ active: modelValue === 'good' }"
          @click="$emit('update:modelValue', modelValue === 'good' ? '' : 'good')"
        >Good</button>
        <button
          class="btn btn-okay"
          :class="{ active: modelValue === 'okay' }"
          @click="$emit('update:modelValue', modelValue === 'okay' ? '' : 'okay')"
        >Okay</button>
        <button
          class="btn btn-bad"
          :class="{ active: modelValue === 'bad' }"
          @click="$emit('update:modelValue', modelValue === 'bad' ? '' : 'bad')"
        >Bad</button>
      </div>
    </div>
  `
};
