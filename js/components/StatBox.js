const StatBox = {
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], default: '\u2014' },
    color: { type: String, default: 'var(--text)' }
  },
  template: `
    <div class="stat-box">
      <div class="stat-box-label">{{ label }}</div>
      <div class="stat-box-value" :style="{ color }">{{ value }}</div>
    </div>
  `
};
