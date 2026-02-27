const WeekStrip = {
  props: {
    // Array of { date, rating } where rating is 'good'|'okay'|'bad'|''
    days: { type: Array, required: true },
    todayDate: { type: String, default: '' }
  },
  data() {
    return {
      dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    };
  },
  template: `
    <div class="week-view">
      <div v-for="(day, i) in days" :key="day.date" class="week-day">
        <span class="week-day-label">{{ dayLabels[i] }}</span>
        <div
          class="week-day-cell"
          :class="[day.rating, { today: day.date === todayDate }]"
        ></div>
      </div>
    </div>
  `
};
