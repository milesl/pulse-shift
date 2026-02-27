// Pulse Shift — localStorage data store
const Store = {
  PREFIX: 'pulseshift_',

  _get(key) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  _set(key, value) {
    localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
  },

  _remove(key) {
    localStorage.removeItem(this.PREFIX + key);
  },

  // ── Profile ──
  getProfile() {
    return this._get('profile') || {};
  },

  saveProfile(profile) {
    this._set('profile', { ...profile, setupComplete: true });
  },

  isSetupComplete() {
    const p = this.getProfile();
    return p && p.setupComplete === true;
  },

  // ── Check-ins ──
  getCheckins() {
    return this._get('checkins') || {};
  },

  getCheckin(date) {
    return this.getCheckins()[date] || null;
  },

  saveCheckin(date, data) {
    const all = this.getCheckins();
    all[date] = { ...data, date, timestamp: new Date().toISOString() };
    this._set('checkins', all);
  },

  // ── Temptations / Treats ──
  getTemptations() {
    return this._get('temptations') || {};
  },

  getTemptationsForDate(date) {
    return this.getTemptations()[date] || [];
  },

  addTemptation(date, type, note) {
    const all = this.getTemptations();
    if (!all[date]) all[date] = [];
    all[date].push({ type, timestamp: new Date().toISOString(), note: note || null });
    this._set('temptations', all);
  },

  // ── Injuries ──
  getInjuries() {
    return this._get('injuries') || [];
  },

  getActiveInjuries() {
    return this.getInjuries().filter(i => i.active);
  },

  addInjury(area, severity) {
    const injuries = this.getInjuries();
    injuries.push({ area, severity, dateLogged: Store.today(), active: true });
    this._set('injuries', injuries);
  },

  clearInjury(index) {
    const injuries = this.getInjuries();
    if (injuries[index]) injuries[index].active = false;
    this._set('injuries', injuries);
  },

  // ── Recovery Logs ──
  getRecoveryLogs() {
    return this._get('recoveryLogs') || {};
  },

  getRecoveryLog(date) {
    return this.getRecoveryLogs()[date] || { types: [], date };
  },

  saveRecoveryLog(date, types) {
    const all = this.getRecoveryLogs();
    all[date] = { types, date };
    this._set('recoveryLogs', all);
  },

  // ── Reset ──
  resetAll() {
    const keys = ['profile', 'checkins', 'temptations', 'injuries', 'recoveryLogs'];
    keys.forEach(k => this._remove(k));
  },

  // ── Helpers ──
  today() {
    return new Date().toISOString().slice(0, 10);
  },

  // Get dates for current week (Mon-Sun)
  getCurrentWeekDates() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon...
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().slice(0, 10));
    }
    return dates;
  },

  // Count consecutive training days (backwards from today)
  getConsecutiveTrainingDays() {
    const checkins = this.getCheckins();
    let count = 0;
    const d = new Date();
    // Start from yesterday since check-in logs yesterday's training
    d.setDate(d.getDate() - 1);
    while (true) {
      const key = d.toISOString().slice(0, 10);
      const ci = checkins[key];
      if (ci && ci.trained && !ci.restDay) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  },

  // Count rest days this week
  getRestDaysThisWeek() {
    const checkins = this.getCheckins();
    const weekDates = this.getCurrentWeekDates();
    return weekDates.filter(date => {
      const ci = checkins[date];
      return ci && ci.restDay;
    }).length;
  },

  // Get clean eating streak (consecutive days with "good" overall diet)
  getCleanStreak() {
    const checkins = this.getCheckins();
    let count = 0;
    const d = new Date();
    d.setDate(d.getDate() - 1); // Start from yesterday
    while (true) {
      const key = d.toISOString().slice(0, 10);
      const ci = checkins[key];
      if (ci && ci.overallDiet === 'good') {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  },

  // Get last N weigh-ins (data points, not consecutive days)
  getLastWeighIns(n = 14) {
    const checkins = this.getCheckins();
    const entries = Object.values(checkins)
      .filter(c => c.weight != null)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, n)
      .reverse();
    return entries;
  },

  // Get last N body fat readings
  getLastBfReadings(n = 14) {
    const checkins = this.getCheckins();
    const entries = Object.values(checkins)
      .filter(c => c.bodyFat != null)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, n)
      .reverse();
    return entries;
  },

  // Get bad diet days count this week
  getBadDietDaysThisWeek() {
    const checkins = this.getCheckins();
    const weekDates = this.getCurrentWeekDates();
    return weekDates.filter(date => {
      const ci = checkins[date];
      return ci && ci.overallDiet === 'bad';
    }).length;
  },

  // Get good diet days count this week
  getGoodDietDaysThisWeek() {
    const checkins = this.getCheckins();
    const weekDates = this.getCurrentWeekDates();
    return weekDates.filter(date => {
      const ci = checkins[date];
      return ci && ci.overallDiet === 'good';
    }).length;
  },

  // Get weekday beers this week
  getWeekdayBeersThisWeek() {
    const temptations = this.getTemptations();
    const weekDates = this.getCurrentWeekDates();
    let count = 0;
    // Mon-Thu = indices 0-3
    for (let i = 0; i < 4; i++) {
      const date = weekDates[i];
      const treats = temptations[date] || [];
      count += treats.filter(t => t.type === 'beer').length;
    }
    return count;
  },

  // Get total treats this week
  getTreatsThisWeek() {
    const temptations = this.getTemptations();
    const weekDates = this.getCurrentWeekDates();
    let count = 0;
    weekDates.forEach(date => {
      count += (temptations[date] || []).length;
    });
    return count;
  },

  // Check if weight is in plateau (±0.5kg for 14+ days)
  isWeightPlateau() {
    const weighIns = this.getLastWeighIns(14);
    if (weighIns.length < 5) return false;
    const first = weighIns[0].weight;
    const last = weighIns[weighIns.length - 1].weight;
    const daysDiff = (new Date(weighIns[weighIns.length - 1].date) - new Date(weighIns[0].date)) / 86400000;
    return daysDiff >= 14 && Math.abs(last - first) <= 0.5;
  }
};

window.Store = Store;
