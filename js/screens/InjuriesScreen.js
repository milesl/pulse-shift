const InjuriesScreen = {
  data() {
    return {
      newInjuryArea: '',
      newInjurySeverity: 'mild',
      injuryVersion: 0
    };
  },
  computed: {
    activeInjuries() {
      this.injuryVersion;
      return Store.getActiveInjuries();
    },
    clearedInjuries() {
      this.injuryVersion;
      return Store.getInjuries().filter(i => !i.active);
    }
  },
  methods: {
    addInjury() {
      if (!this.newInjuryArea.trim()) return;
      Store.addInjury(this.newInjuryArea.trim(), this.newInjurySeverity);
      this.injuryVersion++;
      this.newInjuryArea = '';
      this.newInjurySeverity = 'mild';
    },
    clearInjury(idx) {
      const injuries = Store.getInjuries();
      let activeCount = 0;
      for (let i = 0; i < injuries.length; i++) {
        if (injuries[i].active) {
          if (activeCount === idx) {
            Store.clearInjury(i);
            this.injuryVersion++;
            return;
          }
          activeCount++;
        }
      }
    }
  },
  template: `
    <div class="screen">
      <h1 class="section-title">Injuries</h1>

      <!-- Active injuries -->
      <div class="card" style="margin-top: var(--space-lg);">
        <span class="label">Active injuries</span>

        <div v-if="activeInjuries.length" class="injury-list">
          <div v-for="(inj, i) in activeInjuries" :key="i" class="injury-item">
            <div class="injury-item-left">
              <div class="injury-dot" :class="inj.severity"></div>
              <div>
                <div class="injury-area">{{ inj.area }}</div>
                <div class="injury-severity">{{ inj.severity.replace('_', ' ') }} &mdash; logged {{ inj.dateLogged }}</div>
              </div>
            </div>
            <button class="injury-clear" @click="clearInjury(i)">CLEAR</button>
          </div>
        </div>
        <p v-else style="font-size: 14px; color: var(--muted); margin-top: var(--space-sm);">No active injuries. Keep it that way.</p>
      </div>

      <!-- Add injury -->
      <div class="card" style="margin-top: var(--space-lg);">
        <span class="label">Log an injury</span>
        <div class="injury-form">
          <input class="input" v-model="newInjuryArea" placeholder="Body area (e.g. left knee)" @keyup.enter="addInjury">
          <select v-model="newInjurySeverity">
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="needs_attention">Needs attention</option>
          </select>
          <button class="btn btn-primary" @click="addInjury">Add</button>
        </div>
      </div>

      <!-- Cleared injuries -->
      <div v-if="clearedInjuries.length" class="card" style="margin-top: var(--space-lg);">
        <span class="label">History</span>
        <div class="injury-list">
          <div v-for="(inj, i) in clearedInjuries" :key="i" class="injury-item" style="opacity: 0.5;">
            <div class="injury-item-left">
              <div class="injury-dot" :class="inj.severity"></div>
              <div>
                <div class="injury-area">{{ inj.area }}</div>
                <div class="injury-severity">{{ inj.severity.replace('_', ' ') }} &mdash; {{ inj.dateLogged }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};
