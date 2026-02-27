// Pulse Shift — Nudge Engine
const Nudges = {
  generate() {
    const nudges = [];
    const profile = Store.getProfile();
    const consecutiveTraining = Store.getConsecutiveTrainingDays();
    const activeInjuries = Store.getActiveInjuries();
    const badDietDays = Store.getBadDietDaysThisWeek();
    const weekdayBeers = Store.getWeekdayBeersThisWeek();
    const cleanStreak = Store.getCleanStreak();
    const restDays = Store.getRestDaysThisWeek();
    const weighIns = Store.getLastWeighIns(14);

    // Get current day of week (0=Sun, 1=Mon...) to check how far into the week
    const dayOfWeek = new Date().getDay();
    const daysIntoWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Mon=1...Sun=7

    // ── Danger nudges ──

    // 4+ consecutive training days
    if (consecutiveTraining >= 4) {
      nudges.push({
        id: 'train_4plus',
        type: 'danger',
        message: `${consecutiveTraining} days straight training. You will get injured. Rest today \u2014 not tomorrow, today.`
      });
    }

    // Active injury + 2+ consecutive training days
    if (activeInjuries.length > 0 && consecutiveTraining >= 2) {
      const areas = activeInjuries.map(i => i.area).join(', ');
      nudges.push({
        id: 'injury_no_rest',
        type: 'danger',
        message: `You have active niggles (${areas}). Training on them turns a 3-day recovery into a 3-week one. Rest now.`
      });
    }

    // 3+ bad diet days
    if (badDietDays >= 3) {
      nudges.push({
        id: 'diet_bad_3plus',
        type: 'danger',
        message: `${badDietDays} bad diet days this week. This is why your weight isn't moving. Every bad day adds 2-3 days to reaching your goal.`
      });
    }

    // Weight below floor
    if (profile.weightFloor && weighIns.length > 0) {
      const latest = weighIns[weighIns.length - 1].weight;
      if (latest < profile.weightFloor) {
        nudges.push({
          id: 'weight_floor',
          type: 'danger',
          message: `${latest}kg is below your floor. You need to eat more \u2014 being underweight at your height causes its own problems.`
        });
      }
    }

    // ── Warning nudges ──

    // 3 consecutive training days
    if (consecutiveTraining === 3) {
      nudges.push({
        id: 'train_3',
        type: 'warning',
        message: '3 days straight. One more without rest increases your injury risk significantly. Schedule a rest day.'
      });
    }

    // 2 bad diet days
    if (badDietDays === 2) {
      nudges.push({
        id: 'diet_bad_2',
        type: 'warning',
        message: `${badDietDays} bad days already this week. You need 5 clean days minimum to see the scale move.`
      });
    }

    // Weekday beers
    if (weekdayBeers > 0) {
      nudges.push({
        id: 'weekday_beer',
        type: 'warning',
        message: `${weekdayBeers} weekday beer${weekdayBeers > 1 ? 's' : ''} this week. Weekday beers are empty calories that directly slow your fat loss. Save it for the weekend.`
      });
    }

    // No rest days (5+ days into week)
    if (daysIntoWeek >= 5 && restDays === 0) {
      nudges.push({
        id: 'no_rest_days',
        type: 'warning',
        message: 'Zero rest days this week. You need minimum 2 per week. Your muscles grow during rest, not during training.'
      });
    }

    // Weight plateau
    if (Store.isWeightPlateau()) {
      nudges.push({
        id: 'weight_plateau',
        type: 'warning',
        message: "Weight hasn't moved in 2 weeks. Look at your diet logs \u2014 the answer is there. Consistency has slipped somewhere."
      });
    }

    // ── Success nudges ──

    // Clean streak 5+
    if (cleanStreak >= 5) {
      nudges.push({
        id: 'clean_streak_5',
        type: 'success',
        message: `${cleanStreak} clean days in a row. One bad meal doesn't ruin this \u2014 but one bad day makes the next one easier to justify. Stay sharp.`
      });
    }

    // Weight down
    if (profile.startWeight && weighIns.length > 0) {
      const latest = weighIns[weighIns.length - 1].weight;
      const lost = profile.startWeight - latest;
      if (lost > 0) {
        nudges.push({
          id: 'weight_down',
          type: 'success',
          message: `Down ${lost.toFixed(1)}kg since you started. The boring consistency is working. Don't stop.`
        });
      }
    }

    // Weight in target zone
    if (profile.goalWeight && weighIns.length > 0) {
      const latest = weighIns[weighIns.length - 1].weight;
      if (latest <= profile.goalWeight) {
        nudges.push({
          id: 'weight_target',
          type: 'success',
          message: `You're in your target zone (${latest}kg). Now maintain it. Don't let up.`
        });
      }
    }

    // BF% down
    const bfReadings = Store.getLastBfReadings(14);
    if (profile.startBf && bfReadings.length > 0) {
      const latest = bfReadings[bfReadings.length - 1].bodyFat;
      const drop = profile.startBf - latest;
      if (drop > 0) {
        nudges.push({
          id: 'bf_down',
          type: 'success',
          message: `Body fat down ${drop.toFixed(1)}% since you started. Even if the scale isn't moving, you're getting leaner.`
        });
      }
    }

    // BF% at target
    if (profile.goalBf && bfReadings.length > 0) {
      const latest = bfReadings[bfReadings.length - 1].bodyFat;
      if (latest <= profile.goalBf) {
        nudges.push({
          id: 'bf_target',
          type: 'success',
          message: `You've hit your body fat target (${latest}%). Maintain it.`
        });
      }
    }

    // Sort by priority: danger > warning > success, limit to 3
    const priority = { danger: 0, warning: 1, success: 2 };
    nudges.sort((a, b) => priority[a.type] - priority[b.type]);
    return nudges.slice(0, 3);
  }
};

window.Nudges = Nudges;
