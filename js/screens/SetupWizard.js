const SetupWizard = {
  emits: ['complete'],
  data() {
    return {
      form: {
        name: '',
        height: '',
        startWeight: '',
        goalWeight: '',
        weightFloor: '',
        startBf: '',
        goalBf: ''
      },
      errors: {}
    };
  },
  methods: {
    validate() {
      const e = {};
      const f = this.form;

      if (!f.name.trim()) e.name = 'Name is required';
      const h = Number(f.height);
      if (!f.height || h < 100 || h > 250) e.height = '100\u2013250 cm';
      const sw = Number(f.startWeight);
      if (!f.startWeight || sw < 30 || sw > 300) e.startWeight = '30\u2013300 kg';
      const gw = Number(f.goalWeight);
      if (!f.goalWeight || gw < 30 || gw > 300) e.goalWeight = '30\u2013300 kg';
      if (f.weightFloor) {
        const wf = Number(f.weightFloor);
        if (wf < 30 || wf > 300) e.weightFloor = '30\u2013300 kg';
        else if (gw && wf > gw) e.weightFloor = 'Must be \u2264 goal weight';
      }
      if (f.startBf) {
        const bf = Number(f.startBf);
        if (bf < 3 || bf > 60) e.startBf = '3\u201360%';
      }
      if (f.goalBf) {
        const bf = Number(f.goalBf);
        if (bf < 3 || bf > 60) e.goalBf = '3\u201360%';
      }

      this.errors = e;
      return Object.keys(e).length === 0;
    },
    submit() {
      if (!this.validate()) return;
      const f = this.form;
      Store.saveProfile({
        name: f.name.trim(),
        height: Number(f.height),
        startWeight: Number(f.startWeight),
        goalWeight: Number(f.goalWeight),
        weightFloor: f.weightFloor ? Number(f.weightFloor) : null,
        startBf: f.startBf ? Number(f.startBf) : null,
        goalBf: f.goalBf ? Number(f.goalBf) : null,
        setupDate: new Date().toISOString()
      });
      this.$emit('complete');
    }
  },
  template: `
    <div class="setup-screen">
      <img src="icons/logo.svg" alt="Pulse Shift" class="setup-logo">
      <h1 class="setup-title">Pulse Shift</h1>
      <p class="setup-subtitle">Set your targets. Be realistic \u2014 this works when you are.</p>

      <form class="setup-form" @submit.prevent="submit">
        <div class="form-group">
          <label class="label">Your first name *</label>
          <input class="input" v-model="form.name" placeholder="Your first name" autocomplete="given-name">
          <small v-if="errors.name" style="color: var(--red); font-size: 12px;">{{ errors.name }}</small>
        </div>

        <div class="form-group">
          <label class="label">Height (cm) *</label>
          <input class="input" type="number" v-model="form.height" placeholder="e.g. 180" inputmode="decimal">
          <small v-if="errors.height" style="color: var(--red); font-size: 12px;">{{ errors.height }}</small>
        </div>

        <div class="form-group">
          <label class="label">Current weight (kg) *</label>
          <input class="input" type="number" step="0.1" v-model="form.startWeight" placeholder="Current weight in kg" inputmode="decimal">
          <small v-if="errors.startWeight" style="color: var(--red); font-size: 12px;">{{ errors.startWeight }}</small>
        </div>

        <div class="form-group">
          <label class="label">Goal weight (kg) *</label>
          <input class="input" type="number" step="0.1" v-model="form.goalWeight" placeholder="Target weight in kg" inputmode="decimal">
          <small v-if="errors.goalWeight" style="color: var(--red); font-size: 12px;">{{ errors.goalWeight }}</small>
        </div>

        <div class="form-group">
          <label class="label">Weight floor (kg)</label>
          <input class="input" type="number" step="0.1" v-model="form.weightFloor" placeholder="Minimum safe weight" inputmode="decimal">
          <small v-if="errors.weightFloor" style="color: var(--red); font-size: 12px;">{{ errors.weightFloor }}</small>
        </div>

        <div class="form-group">
          <label class="label">Current body fat %</label>
          <input class="input" type="number" step="0.1" v-model="form.startBf" placeholder="e.g. 25" inputmode="decimal">
          <small v-if="errors.startBf" style="color: var(--red); font-size: 12px;">{{ errors.startBf }}</small>
        </div>

        <div class="form-group">
          <label class="label">Goal body fat %</label>
          <input class="input" type="number" step="0.1" v-model="form.goalBf" placeholder="e.g. 18" inputmode="decimal">
          <small v-if="errors.goalBf" style="color: var(--red); font-size: 12px;">{{ errors.goalBf }}</small>
        </div>

        <div class="setup-actions">
          <button type="submit" class="btn btn-primary btn-block">Let's go</button>
        </div>
      </form>
    </div>
  `
};
