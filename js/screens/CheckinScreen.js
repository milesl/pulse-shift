const CheckinScreen = {
  components: { NudgeCard, MealRater, FeelingPicker, ToggleGroup },
  data() {
    const today = Store.today();
    const existing = Store.getCheckin(today);
    const profile = Store.getProfile();
    return {
      today,
      profileName: profile.name || '',
      saved: false,
      nudges: Nudges.generate(),
      form: {
        weight: existing?.weight ?? '',
        bodyFat: existing?.bodyFat ?? '',
        feeling: existing?.feeling ?? 0,
        breakfast: existing?.meals?.breakfast ?? '',
        lunch: existing?.meals?.lunch ?? '',
        dinner: existing?.meals?.dinner ?? '',
        snacks: existing?.meals?.snacks ?? '',
        beer: existing?.meals?.beer ?? '',
        overallDiet: existing?.overallDiet ?? '',
        trained: existing?.trained ?? null,
        restDay: existing?.restDay ?? null
      }
    };
  },
  computed: {
    seriousInjuries() {
      return Store.getActiveInjuries().filter(
        i => i.severity === 'moderate' || i.severity === 'needs_attention'
      );
    }
  },
  methods: {
    setTrained(val) {
      this.form.trained = val;
      if (val === true) this.form.restDay = false;
    },
    setRestDay(val) {
      this.form.restDay = val;
      if (val === true) this.form.trained = false;
    },
    save() {
      Store.saveCheckin(this.today, {
        weight: this.form.weight ? Number(this.form.weight) : null,
        bodyFat: this.form.bodyFat ? Number(this.form.bodyFat) : null,
        feeling: this.form.feeling,
        meals: {
          breakfast: this.form.breakfast,
          lunch: this.form.lunch,
          dinner: this.form.dinner,
          snacks: this.form.snacks,
          beer: this.form.beer
        },
        overallDiet: this.form.overallDiet,
        trained: this.form.trained,
        restDay: this.form.restDay
      });
      this.saved = true;
      this.nudges = Nudges.generate();
      setTimeout(() => { this.saved = false; }, 2000);
    }
  },
  template: `
    <div class="screen">
      <h1 class="checkin-greeting">Morning, {{ profileName || 'there' }}</h1>

      <!-- Injury warning -->
      <div v-if="seriousInjuries.length" class="card" style="border-left: 3px solid var(--red); background: var(--red-bg); padding: var(--space-md) var(--space-lg); margin-bottom: var(--space-lg);">
        <p style="font-size: 13px; font-weight: 700; color: var(--red); margin-bottom: var(--space-xs);">ACTIVE INJURIES</p>
        <p v-for="inj in seriousInjuries" :key="inj.area" style="font-size: 13px; font-weight: 500; line-height: 1.55;">
          {{ inj.area }} \u2014 {{ inj.severity.replace('_', ' ') }}
        </p>
      </div>

      <div v-if="nudges.length" class="checkin-nudges">
        <nudge-card
          v-for="n in nudges"
          :key="n.id"
          :type="n.type"
          :message="n.message"
        />
      </div>

      <div class="checkin-form">
        <!-- Weight & BF% -->
        <div class="checkin-row">
          <div class="form-group">
            <label class="label">Weight (kg)</label>
            <input class="input" type="number" step="0.1" v-model="form.weight" placeholder="Optional" inputmode="decimal">
          </div>
          <div class="form-group">
            <label class="label">Body fat %</label>
            <input class="input" type="number" step="0.1" v-model="form.bodyFat" placeholder="Optional" inputmode="decimal">
          </div>
        </div>

        <!-- Feeling -->
        <div class="form-group">
          <label class="label">How do you feel?</label>
          <feeling-picker v-model="form.feeling" />
        </div>

        <!-- Yesterday's meals -->
        <div class="form-group">
          <label class="label">Yesterday's meals</label>
          <div style="display: flex; flex-direction: column; gap: var(--space-sm); margin-top: var(--space-sm);">
            <meal-rater label="Breakfast" v-model="form.breakfast" />
            <meal-rater label="Lunch" v-model="form.lunch" />
            <meal-rater label="Dinner" v-model="form.dinner" />
            <meal-rater label="Snacks" v-model="form.snacks" />
            <meal-rater label="Beer" v-model="form.beer" />
          </div>
        </div>

        <!-- Overall day -->
        <div class="form-group">
          <label class="label">Overall day rating</label>
          <div class="meal-rater-buttons" style="margin-top: var(--space-sm);">
            <button class="btn btn-good" :class="{ active: form.overallDiet === 'good' }" @click="form.overallDiet = form.overallDiet === 'good' ? '' : 'good'">Good</button>
            <button class="btn btn-okay" :class="{ active: form.overallDiet === 'okay' }" @click="form.overallDiet = form.overallDiet === 'okay' ? '' : 'okay'">Okay</button>
            <button class="btn btn-bad" :class="{ active: form.overallDiet === 'bad' }" @click="form.overallDiet = form.overallDiet === 'bad' ? '' : 'bad'">Bad</button>
          </div>
        </div>

        <!-- Trained -->
        <div class="form-group">
          <label class="label">Trained yesterday?</label>
          <toggle-group :modelValue="form.trained" @update:modelValue="setTrained" />
        </div>

        <!-- Rest day -->
        <div class="form-group">
          <label class="label">Rest day?</label>
          <toggle-group :modelValue="form.restDay" @update:modelValue="setRestDay" />
        </div>

        <!-- Save -->
        <div class="checkin-save">
          <button class="btn btn-block" :class="saved ? 'btn-success' : 'btn-primary'" @click="save">
            {{ saved ? '\u2713 UPDATED' : 'LOG CHECK-IN' }}
          </button>
        </div>
      </div>
    </div>
  `
};
