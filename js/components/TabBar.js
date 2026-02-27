const TabBar = {
  props: {
    active: { type: String, default: 'checkin' }
  },
  emits: ['navigate'],
  template: `
    <nav class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-bar-item"
        :class="{ active: active === tab.id }"
        @click="$emit('navigate', tab.id)"
        :aria-label="tab.label"
      >
        <span class="tab-bar-icon">{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </button>
    </nav>
  `,
  data() {
    return {
      tabs: [
        { id: 'checkin', icon: '\u2713', label: 'Check-in' },
        { id: 'diet', icon: '\u25C9', label: 'Diet' },
        { id: 'injuries', icon: '\u2661', label: 'Injuries' },
        { id: 'dashboard', icon: '\u25A6', label: 'Dashboard' }
      ]
    };
  }
};
