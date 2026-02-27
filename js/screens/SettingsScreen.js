const SettingsScreen = {
  emits: ['back', 'reset'],
  data() {
    const profile = Store.getProfile();
    return {
      form: {
        name: profile.name || '',
        height: profile.height || '',
        startWeight: profile.startWeight || '',
        goalWeight: profile.goalWeight || '',
        weightFloor: profile.weightFloor || '',
        startBf: profile.startBf || '',
        goalBf: profile.goalBf || ''
      },
      saved: false,
      showConfirm: false
    };
  },
  methods: {
    save() {
      const f = this.form;
      Store.saveProfile({
        name: f.name.trim(),
        height: Number(f.height),
        startWeight: Number(f.startWeight),
        goalWeight: Number(f.goalWeight),
        weightFloor: f.weightFloor ? Number(f.weightFloor) : null,
        startBf: f.startBf ? Number(f.startBf) : null,
        goalBf: f.goalBf ? Number(f.goalBf) : null,
        setupDate: Store.getProfile().setupDate
      });
      this.saved = true;
      setTimeout(() => { this.saved = false; }, 2000);
    },
    resetAll() {
      Store.resetAll();
      this.$emit('reset');
    }
  },
  template: `
    <div class="screen">
      <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-xl);">
        <button class="btn btn-outline" @click="$emit('back')" style="padding: var(--space-sm) var(--space-md);">\u2190 Back</button>
        <h1 class="settings-title" style="margin-bottom: 0;">Settings</h1>
      </div>

      <!-- Profile -->
      <div class="settings-section">
        <div class="settings-section-title">Profile</div>
        <div class="settings-form">
          <div class="form-group">
            <label class="label">Name</label>
            <input class="input" v-model="form.name">
          </div>
          <div class="form-group">
            <label class="label">Height (cm)</label>
            <input class="input" type="number" v-model="form.height" inputmode="decimal">
          </div>
          <div class="form-group">
            <label class="label">Start weight (kg)</label>
            <input class="input" type="number" step="0.1" v-model="form.startWeight" inputmode="decimal">
          </div>
          <div class="form-group">
            <label class="label">Goal weight (kg)</label>
            <input class="input" type="number" step="0.1" v-model="form.goalWeight" inputmode="decimal">
          </div>
          <div class="form-group">
            <label class="label">Weight floor (kg)</label>
            <input class="input" type="number" step="0.1" v-model="form.weightFloor" placeholder="Optional" inputmode="decimal">
          </div>
          <div class="form-group">
            <label class="label">Current body fat %</label>
            <input class="input" type="number" step="0.1" v-model="form.startBf" placeholder="Optional" inputmode="decimal">
          </div>
          <div class="form-group">
            <label class="label">Goal body fat %</label>
            <input class="input" type="number" step="0.1" v-model="form.goalBf" placeholder="Optional" inputmode="decimal">
          </div>
          <button class="btn btn-block" :class="saved ? 'btn-success' : 'btn-primary'" @click="save">
            {{ saved ? '\u2713 Saved' : 'Save changes' }}
          </button>
        </div>
      </div>

      <!-- Data -->
      <div class="settings-section">
        <div class="settings-section-title">Data</div>
        <button class="btn btn-danger btn-block" @click="showConfirm = true">Reset all data</button>
      </div>

      <!-- About -->
      <div class="settings-section">
        <div class="settings-section-title">About</div>
        <div class="about-info">
          <strong>Pulse Shift</strong>
          <div class="about-version">v1.0.0</div>
          <div class="about-tagline">Small shifts. Big change.</div>
        </div>
      </div>

      <!-- Confirm dialog -->
      <div v-if="showConfirm" class="confirm-overlay" @click.self="showConfirm = false">
        <div class="confirm-dialog">
          <p>This will delete all your data. Are you sure?</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" @click="showConfirm = false">Cancel</button>
            <button class="btn btn-danger" @click="resetAll">Delete everything</button>
          </div>
        </div>
      </div>
    </div>
  `
};
