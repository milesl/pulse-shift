const NudgeCard = {
  props: {
    type: { type: String, default: 'warning' }, // 'danger', 'warning', 'success'
    message: { type: String, required: true }
  },
  computed: {
    styles() {
      const map = {
        danger: { border: 'var(--red)', bg: 'var(--red-bg)' },
        warning: { border: 'var(--amber)', bg: 'var(--amber-bg)' },
        success: { border: 'var(--green)', bg: 'var(--green-bg)' }
      };
      return map[this.type] || map.warning;
    }
  },
  template: `
    <div class="card" :style="{
      borderLeft: '3px solid ' + styles.border,
      background: styles.bg,
      padding: 'var(--space-md) var(--space-lg)'
    }">
      <p style="font-size: 13px; font-weight: 500; line-height: 1.55;">{{ message }}</p>
    </div>
  `
};
