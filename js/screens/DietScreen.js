const DietScreen = {
  components: { WeekStrip },
  data() {
    return {
      today: Store.today(),
      selectedTreat: null,
      treatVersion: 0,
      treatTypes: [
        { id: 'cake', emoji: '\uD83C\uDF70', label: 'Cake/Treats' },
        { id: 'beer', emoji: '\uD83C\uDF7A', label: 'Beer' },
        { id: 'snacks', emoji: '\uD83C\uDF7F', label: 'Snacks' },
        { id: 'chocolate', emoji: '\uD83C\uDF6B', label: 'Chocolate' },
        { id: 'other', emoji: '\uD83D\uDED2', label: 'Other' }
      ]
    };
  },
  computed: {
    cleanStreak() {
      return Store.getCleanStreak();
    },
    streakEmoji() {
      if (this.cleanStreak >= 7) return '\uD83D\uDD25';
      if (this.cleanStreak >= 3) return '\uD83D\uDCAA';
      return '\uD83C\uDFAF';
    },
    weekDays() {
      const dates = Store.getCurrentWeekDates();
      const checkins = Store.getCheckins();
      return dates.map(date => ({
        date,
        rating: checkins[date]?.overallDiet || ''
      }));
    },
    todaysTreats() {
      this.treatVersion; // reactive dependency
      return Store.getTemptationsForDate(this.today);
    },
    isWeekend() {
      const day = new Date().getDay();
      return day === 0 || day === 5 || day === 6; // Fri, Sat, Sun
    }
  },
  methods: {
    tapTreat(id) {
      if (this.selectedTreat === id) {
        // Second tap — confirm
        Store.addTemptation(this.today, id, null);
        this.treatVersion++;
        this.selectedTreat = null;
      } else {
        this.selectedTreat = id;
      }
    },
    isBeerWeekendOk(id) {
      return id === 'beer' && this.isWeekend;
    },
    formatTime(ts) {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    treatLabel(type) {
      const t = this.treatTypes.find(tt => tt.id === type);
      return t ? `${t.emoji} ${t.label}` : type;
    }
  },
  template: `
    <div class="screen">
      <h1 class="section-title">Diet</h1>

      <!-- Clean streak -->
      <div class="card diet-streak" style="margin-top: var(--space-lg);">
        <div class="diet-streak-emoji">{{ streakEmoji }}</div>
        <div class="diet-streak-count" :style="{ color: cleanStreak >= 3 ? 'var(--green)' : 'var(--text)' }">{{ cleanStreak }}</div>
        <div class="diet-streak-label">Clean day streak</div>
      </div>

      <!-- Week view -->
      <div class="card" style="margin-top: var(--space-lg);">
        <span class="label">This week</span>
        <week-strip :days="weekDays" :today-date="today" />
      </div>

      <!-- Treat logger -->
      <div class="card" style="margin-top: var(--space-lg);">
        <span class="label">Log a treat</span>
        <div class="treat-grid">
          <button
            v-for="t in treatTypes"
            :key="t.id"
            class="treat-btn"
            :class="{ selected: selectedTreat === t.id }"
            @click="tapTreat(t.id)"
          >
            <span class="treat-btn-emoji">{{ t.emoji }}</span>
            <span>{{ selectedTreat === t.id ? 'Tap to confirm' : t.label }}</span>
            <span v-if="isBeerWeekendOk(t.id) && selectedTreat !== t.id" class="treat-hint">WEEKEND OK</span>
          </button>
        </div>
      </div>

      <!-- Today's treats -->
      <div v-if="todaysTreats.length" class="card" style="margin-top: var(--space-lg);">
        <span class="label">Today's treats</span>
        <div class="treat-list">
          <div v-for="(treat, i) in todaysTreats" :key="i" class="treat-item">
            <span>{{ treatLabel(treat.type) }}</span>
            <span class="treat-item-time">{{ formatTime(treat.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  `
};
