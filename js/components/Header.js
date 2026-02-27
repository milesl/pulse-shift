const Header = {
  props: {
    showSettings: { type: Boolean, default: true }
  },
  emits: ['settings'],
  template: `
    <header class="app-header">
      <div class="app-header-left">
        <img src="icons/logo.svg" alt="Pulse Shift" class="app-header-logo">
        <span class="app-header-title">Pulse Shift</span>
      </div>
      <button v-if="showSettings" class="app-header-action" @click="$emit('settings')" aria-label="Settings">
        <span>&#9881;</span>
      </button>
    </header>
  `
};
