const DashboardScreen = {
  components: { StatBox, WeekStrip },
  computed: {
    profile() {
      return Store.getProfile();
    },
    weighIns() {
      return Store.getLastWeighIns(14);
    },
    bfReadings() {
      return Store.getLastBfReadings(14);
    },
    latestWeight() {
      return this.weighIns.length ? this.weighIns[this.weighIns.length - 1].weight : null;
    },
    weightLost() {
      if (!this.profile.startWeight || !this.latestWeight) return null;
      return this.profile.startWeight - this.latestWeight;
    },
    weightToGo() {
      if (!this.profile.goalWeight || !this.latestWeight) return null;
      const diff = this.latestWeight - this.profile.goalWeight;
      return diff <= 0 ? 0 : diff;
    },
    latestBf() {
      return this.bfReadings.length ? this.bfReadings[this.bfReadings.length - 1].bodyFat : null;
    },
    bfChange() {
      if (!this.profile.startBf || !this.latestBf) return null;
      return this.profile.startBf - this.latestBf;
    },
    bfToGo() {
      if (!this.profile.goalBf || !this.latestBf) return null;
      const diff = this.latestBf - this.profile.goalBf;
      return diff <= 0 ? 0 : diff;
    },
    showBfStats() {
      return this.latestBf != null;
    },
    showBfChart() {
      return this.bfReadings.length >= 2;
    },
    weightChartBars() {
      if (!this.weighIns.length) return [];
      const weights = this.weighIns.map(w => w.weight);
      const min = Math.min(...weights) - 1;
      const max = Math.max(...weights) + 1;
      const range = max - min || 1;
      return this.weighIns.map(w => ({
        height: ((w.weight - min) / range * 80) + 20,
        label: w.date.slice(8),
        value: w.weight,
        color: 'var(--accent)'
      }));
    },
    bfChartBars() {
      if (!this.bfReadings.length) return [];
      const values = this.bfReadings.map(r => r.bodyFat);
      const min = Math.min(...values) - 1;
      const max = Math.max(...values) + 1;
      const range = max - min || 1;
      return this.bfReadings.map(r => ({
        height: ((r.bodyFat - min) / range * 80) + 20,
        label: r.date.slice(8),
        value: r.bodyFat,
        color: 'var(--accent-mid)'
      }));
    },
    weekDays() {
      const dates = Store.getCurrentWeekDates();
      const checkins = Store.getCheckins();
      return dates.map(date => ({
        date,
        rating: checkins[date]?.overallDiet || ''
      }));
    },
    dietBars() {
      const heights = { good: 100, okay: 60, bad: 30 };
      const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      return this.weekDays.map((d, i) => ({
        height: heights[d.rating] || 8,
        label: labels[i],
        rating: d.rating
      }));
    },
    mealGrid() {
      const dates = Store.getCurrentWeekDates();
      const checkins = Store.getCheckins();
      const meals = ['breakfast', 'lunch', 'dinner', 'snacks', 'beer'];
      const mealLabels = { breakfast: 'Bre', lunch: 'Lun', dinner: 'Din', snacks: 'Snk', beer: 'Beer' };
      const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      return {
        dayLabels,
        meals: meals.map(m => ({
          label: mealLabels[m],
          days: dates.map(date => checkins[date]?.meals?.[m] || '')
        }))
      };
    },
    goodDietDays() {
      return Store.getGoodDietDaysThisWeek();
    },
    cleanStreak() {
      return Store.getCleanStreak();
    },
    restDays() {
      return Store.getRestDaysThisWeek();
    },
    badBeerDays() {
      return Store.getBadBeerDaysThisWeek();
    },
    activeInjuries() {
      return Store.getActiveInjuries();
    }
  },
  methods: {
    fmt(n) {
      return n != null ? n.toFixed(1) : '\u2014';
    },
    fmtDiff(n) {
      if (n == null) return '\u2014';
      return (n >= 0 ? '-' : '+') + Math.abs(n).toFixed(1);
    }
  },
  template: `
    <div class="screen">
      <h1 class="dash-title">Dashboard</h1>

      <!-- Weight stats -->
      <div class="stat-grid">
        <stat-box label="Current" :value="latestWeight ? latestWeight.toFixed(1) + 'kg' : '\u2014'" />
        <stat-box
          label="Lost"
          :value="weightLost != null ? weightLost.toFixed(1) + 'kg' : '\u2014'"
          :color="weightLost > 0 ? 'var(--green)' : 'var(--text)'"
        />
        <stat-box
          label="To go"
          :value="weightToGo != null ? (weightToGo === 0 ? '\u2713' : weightToGo.toFixed(1) + 'kg') : '\u2014'"
          :color="weightToGo === 0 ? 'var(--green)' : 'var(--text)'"
        />
      </div>

      <!-- BF stats -->
      <div v-if="showBfStats" class="stat-grid">
        <stat-box label="Body fat" :value="latestBf ? latestBf.toFixed(1) + '%' : '\u2014'" />
        <stat-box
          label="BF change"
          :value="bfChange != null ? fmtDiff(bfChange) + '%' : '\u2014'"
          :color="bfChange > 0 ? 'var(--green)' : 'var(--text)'"
        />
        <stat-box
          label="BF to go"
          :value="bfToGo != null ? (bfToGo === 0 ? '\u2713' : bfToGo.toFixed(1) + '%') : '\u2014'"
          :color="bfToGo === 0 ? 'var(--green)' : 'var(--text)'"
        />
      </div>

      <!-- Weight trend chart -->
      <div v-if="weightChartBars.length" class="card chart-card">
        <div class="chart-title">Weight trend (last {{ weightChartBars.length }} weigh-ins)</div>
        <div class="chart-bars">
          <div v-for="(bar, i) in weightChartBars" :key="i" class="chart-bar-wrapper">
            <div class="chart-bar" :style="{ height: bar.height + '%', background: bar.color }"></div>
            <span class="chart-bar-label">{{ bar.label }}</span>
          </div>
        </div>
      </div>

      <!-- BF trend chart -->
      <div v-if="showBfChart" class="card chart-card">
        <div class="chart-title">Body fat trend (last {{ bfChartBars.length }} readings)</div>
        <div class="chart-bars">
          <div v-for="(bar, i) in bfChartBars" :key="i" class="chart-bar-wrapper">
            <div class="chart-bar" :style="{ height: bar.height + '%', background: bar.color }"></div>
            <span class="chart-bar-label">{{ bar.label }}</span>
          </div>
        </div>
      </div>

      <!-- Diet this week -->
      <div class="card chart-card">
        <div class="chart-title">Diet this week</div>
        <div class="chart-bars" style="height: 80px;">
          <div v-for="(bar, i) in dietBars" :key="i" class="chart-bar-wrapper">
            <div class="chart-bar diet-bar" :class="bar.rating || 'none'" :style="{ height: bar.height + '%' }"></div>
            <span class="chart-bar-label">{{ bar.label }}</span>
          </div>
        </div>
      </div>

      <!-- Meals this week -->
      <div class="card" style="margin-bottom: var(--space-xl);">
        <div class="chart-title">Meals this week</div>
        <div class="meal-grid">
          <div></div>
          <div v-for="d in mealGrid.dayLabels" :key="d" class="meal-grid-day">{{ d }}</div>
          <template v-for="meal in mealGrid.meals" :key="meal.label">
            <div class="meal-grid-label">{{ meal.label }}</div>
            <div v-for="(rating, j) in meal.days" :key="j">
              <div class="meal-dot" :class="rating"></div>
            </div>
          </template>
        </div>
      </div>

      <!-- Week stats -->
      <div class="stat-grid-2x2">
        <stat-box label="Good diet days" :value="goodDietDays + '/7'" :color="goodDietDays >= 5 ? 'var(--green)' : 'var(--text)'" />
        <stat-box label="Clean streak" :value="cleanStreak + 'd'" :color="cleanStreak >= 5 ? 'var(--green)' : 'var(--text)'" />
        <stat-box label="Rest days" :value="restDays + '/2'" :color="restDays >= 2 ? 'var(--green)' : 'var(--amber)'" />
        <stat-box label="Bad beer days" :value="badBeerDays" :color="badBeerDays > 0 ? 'var(--red)' : 'var(--green)'" />
      </div>

      <!-- Active injuries -->
      <div v-if="activeInjuries.length" class="dash-injuries" style="margin-top: var(--space-lg);">
        <div class="dash-injuries-title">Active injuries</div>
        <div v-for="inj in activeInjuries" :key="inj.area" style="font-size: 14px; margin-top: var(--space-xs);">
          {{ inj.area }} \u2014 {{ inj.severity.replace('_', ' ') }}
        </div>
      </div>
    </div>
  `
};
