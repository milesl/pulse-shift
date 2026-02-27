const RecoveryScreen = {
  data() {
    const today = Store.today();
    const log = Store.getRecoveryLog(today);
    return {
      today,
      recoveryTypes: [
        { id: 'stretch', emoji: '\uD83E\uDDD8', label: 'Stretching/Yoga' },
        { id: 'walk', emoji: '\uD83D\uDEB6', label: 'Light walk' },
        { id: 'full_rest', emoji: '\uD83D\uDECB\uFE0F', label: 'Full rest' },
        { id: 'foam_roll', emoji: '\uD83D\uDC86', label: 'Massage/Foam roll' }
      ],
      activeTypes: [...log.types],
      newInjuryArea: '',
      newInjurySeverity: 'mild',
      injuryVersion: 0
    };
  },
  computed: {
    consecutiveTraining() {
      return Store.getConsecutiveTrainingDays();
    },
    trainingColor() {
      if (this.consecutiveTraining >= 4) return 'var(--red)';
      if (this.consecutiveTraining >= 3) return 'var(--amber)';
      return 'var(--green)';
    },
    trainingBarWidth() {
      return Math.min(this.consecutiveTraining / 5 * 100, 100);
    },
    trainingWarning() {
      if (this.consecutiveTraining >= 4) return `${this.consecutiveTraining} days straight. You will get injured. Rest today.`;
      if (this.consecutiveTraining >= 3) return '3 days straight. Schedule a rest day.';
      return '';
    },
    restDays() {
      return Store.getRestDaysThisWeek();
    },
    activeInjuries() {
      this.injuryVersion;
      return Store.getActiveInjuries();
    },
    allInjuries() {
      this.injuryVersion;
      return Store.getInjuries();
    }
  },
  methods: {
    toggleRecovery(id) {
      const idx = this.activeTypes.indexOf(id);
      if (idx >= 0) {
        this.activeTypes.splice(idx, 1);
      } else {
        this.activeTypes.push(id);
      }
      Store.saveRecoveryLog(this.today, this.activeTypes);
    },
    addInjury() {
      if (!this.newInjuryArea.trim()) return;
      Store.addInjury(this.newInjuryArea.trim(), this.newInjurySeverity);
      this.injuryVersion++;
      this.newInjuryArea = '';
      this.newInjurySeverity = 'mild';
    },
    clearInjury(idx) {
      // Find the actual index in the full injuries array
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
      <h1 class="section-title">Recovery</h1>

      <!-- Consecutive training days -->
      <div class="card recovery-counter" style="margin-top: var(--space-lg);">
        <div class="recovery-counter-value" :style="{ color: trainingColor }">{{ consecutiveTraining }}</div>
        <div class="recovery-counter-label">Consecutive training days</div>
        <div class="recovery-bar">
          <div class="recovery-bar-fill" :style="{ width: trainingBarWidth + '%', background: trainingColor }"></div>
        </div>
        <p v-if="trainingWarning" class="recovery-warning" :style="{ color: trainingColor }">{{ trainingWarning }}</p>
      </div>

      <!-- Rest days this week -->
      <div class="card" style="margin-top: var(--space-lg); text-align: center;">
        <span class="label">Rest days this week</span>
        <div class="rest-target">
          <span :style="{ color: restDays >= 2 ? 'var(--green)' : 'var(--amber)' }">{{ restDays }}</span>
          <span class="rest-target-label">/ 2 target</span>
        </div>
      </div>

      <!-- Recovery activities -->
      <div class="card" style="margin-top: var(--space-lg);">
        <span class="label">Today's recovery</span>
        <div class="recovery-grid">
          <button
            v-for="r in recoveryTypes"
            :key="r.id"
            class="recovery-toggle"
            :class="{ active: activeTypes.includes(r.id) }"
            @click="toggleRecovery(r.id)"
          >
            <span class="recovery-toggle-emoji">{{ r.emoji }}</span>
            <span>{{ r.label }}</span>
          </button>
        </div>
      </div>

      <!-- Active injuries -->
      <div class="card" style="margin-top: var(--space-lg);">
        <span class="label">Active injuries</span>

        <div v-if="activeInjuries.length" class="injury-list">
          <div v-for="(inj, i) in activeInjuries" :key="i" class="injury-item">
            <div class="injury-item-left">
              <div class="injury-dot" :class="inj.severity"></div>
              <div>
                <div class="injury-area">{{ inj.area }}</div>
                <div class="injury-severity">{{ inj.severity.replace('_', ' ') }}</div>
              </div>
            </div>
            <button class="injury-clear" @click="clearInjury(i)">CLEAR</button>
          </div>
        </div>
        <p v-else style="font-size: 14px; color: var(--muted); margin-top: var(--space-sm);">No active injuries</p>

        <div class="injury-form">
          <input class="input" v-model="newInjuryArea" placeholder="Body area" @keyup.enter="addInjury">
          <select v-model="newInjurySeverity">
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="needs_attention">Needs attention</option>
          </select>
          <button class="btn btn-primary" @click="addInjury">Add</button>
        </div>
      </div>
    </div>
  `
};
