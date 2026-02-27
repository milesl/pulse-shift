const ToggleGroup = {
  props: {
    modelValue: { type: [Boolean, null], default: null },
    yesClass: { type: String, default: 'toggle-yes' },
    noClass: { type: String, default: 'toggle-no' }
  },
  emits: ['update:modelValue'],
  template: `
    <div class="toggle-group">
      <button
        class="btn"
        :class="[yesClass, { active: modelValue === true }]"
        @click="$emit('update:modelValue', modelValue === true ? null : true)"
      >Yes</button>
      <button
        class="btn"
        :class="[noClass, { active: modelValue === false }]"
        @click="$emit('update:modelValue', modelValue === false ? null : false)"
      >No</button>
    </div>
  `
};
