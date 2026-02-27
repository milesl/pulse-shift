# Pulse Shift — Personal Fitness & Wellness PWA

## Complete Build Specification (v1)

---

## 1. Overview

**Pulse Shift** is a mobile-first PWA for daily health accountability. It tracks diet (meals + treats), rest/recovery, weight, body fat %, and exercise — with direct, cause-and-effect feedback designed to drive behaviour change.

**Tagline:** "Small shifts. Big change."

**Design philosophy:**
- 30-second daily check-in — zero friction
- Direct feedback — cause and effect, not coddling
- Track the problems, not the wins (diet discipline, rest compliance)
- Gender-neutral, clean, minimal UI
- Works for multiple users in the same household (separate profiles via setup wizard)

---

## 2. Tech Stack & File Structure

### Stack
- **Vue 3** via CDN (Composition API, `<script setup>` where possible)
- **Vanilla CSS** — no framework, CSS custom properties for theming
- **localStorage** for persistence (prefixed `pulseshift_`)
- **PWA** — manifest.json + service worker for install & offline
- **No build step** — runs directly from files, deployable to any static host

### File Structure

```
pulse-shift/
├── index.html                  # Shell — loads app, splash screen
├── manifest.json               # PWA manifest
├── sw.js                       # Service worker (offline + caching)
├── css/
│   ├── reset.css               # Minimal CSS reset
│   ├── tokens.css              # CSS custom properties (colours, spacing, typography)
│   ├── components.css          # Shared component styles (cards, buttons, inputs, labels)
│   ├── layout.css              # Tab bar, screen layout, header, splash
│   ├── checkin.css             # Check-in screen specific styles
│   ├── diet.css                # Diet screen specific styles
│   ├── recovery.css            # Recovery screen specific styles
│   ├── dashboard.css           # Dashboard screen specific styles
│   └── settings.css            # Settings/setup screen styles
├── js/
│   ├── app.js                  # Vue app initialisation, routing, splash logic
│   ├── store.js                # localStorage read/write, data model, migration
│   ├── components/
│   │   ├── TabBar.js           # Bottom tab navigation component
│   │   ├── Header.js           # App header with logo
│   │   ├── NudgeCard.js        # Nudge/feedback card component
│   │   ├── MealRater.js        # Reusable meal rating row (good/okay/bad)
│   │   ├── FeelingPicker.js    # Emoji feeling selector
│   │   ├── ToggleGroup.js      # Yes/No toggle button pair
│   │   ├── StatBox.js          # Dashboard stat box
│   │   └── WeekStrip.js        # 7-day colour-coded week view
│   ├── screens/
│   │   ├── SetupWizard.js      # First-time onboarding wizard
│   │   ├── CheckinScreen.js    # Morning check-in
│   │   ├── DietScreen.js       # Diet tracker + treat logger
│   │   ├── RecoveryScreen.js   # Rest & recovery + injury log
│   │   ├── DashboardScreen.js  # Weekly dashboard + charts
│   │   └── SettingsScreen.js   # Edit profile, goals, reset data
│   └── nudges.js               # Nudge engine — all feedback logic
├── icons/
│   ├── logo.svg                # Main app logo (pulse line → target)
│   ├── icon-192.png            # PWA icon 192x192
│   ├── icon-512.png            # PWA icon 512x512
│   └── favicon.svg             # Browser tab favicon
└── README.md                   # Setup & deployment instructions
```

---

## 3. Design System

### Theme — Light, Minimal, Electric Blue

```css
/* tokens.css */
:root {
  /* Backgrounds */
  --bg:             #f8f9fb;
  --surface:        #ffffff;
  --border:         #e8ecf1;

  /* Text */
  --text:           #1a1d23;
  --muted:          #8b95a5;
  --dim:            #6b7588;

  /* Accent */
  --accent:         #2563ff;
  --accent-light:   #e8eeff;
  --accent-mid:     #5b8aff;

  /* Semantic */
  --green:          #10b981;
  --green-bg:       #ecfdf5;
  --green-border:   #10b98130;
  --amber:          #f59e0b;
  --amber-bg:       #fffbeb;
  --amber-border:   #f59e0b30;
  --amber-light:    #d97706;
  --red:            #ef4444;
  --red-bg:         #fef2f2;
  --red-border:     #ef444430;
  --red-light:      #dc2626;

  /* Shadows */
  --shadow-sm:      0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:      0 2px 8px rgba(0,0,0,0.06);

  /* Typography */
  --font:           'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Spacing */
  --space-xs:       4px;
  --space-sm:       8px;
  --space-md:       12px;
  --space-lg:       16px;
  --space-xl:       20px;
  --space-2xl:      24px;

  /* Radii */
  --radius-sm:      8px;
  --radius-md:      12px;
  --radius-lg:      14px;
}
```

### Typography
- **Font:** DM Sans (Google Fonts CDN)
- **Weights used:** 400 (body), 500 (labels), 600 (emphasis), 700 (buttons), 800 (headings/stats)
- **Screen titles:** 26px, weight 800, letter-spacing -0.03em
- **Labels:** 12px, weight 600, uppercase, letter-spacing 0.06em
- **Body:** 14-15px, weight 400-500
- **Stats:** 20-32px, weight 800-900

### Logo
- Blue rounded square (`rx="20"`)
- Pulse/heartbeat line (3 peaks) transitioning into a crosshair/target circle
- White strokes on `#2563ff` background
- Used at 80px on splash, 32px in header

### Component Patterns
- **Cards:** White surface, 1px border, 14px radius, subtle shadow
- **Buttons:** 1.5px border, 12px radius, shadow-sm, clear active states with colour fill
- **Inputs:** 12px padding, 12px radius, focus state = accent border + accent-light glow
- **Semantic colouring:** Green = good/success, Amber = warning/okay, Red = bad/danger
- **All interactive elements:** 0.15s transition on border, background, colour

---

## 4. Data Model

### localStorage Keys (all prefixed `pulseshift_`)

#### `profile`
```json
{
  "name": "string",
  "height": "number (cm)",
  "startWeight": "number (kg)",
  "goalWeight": "number (kg)",
  "weightFloor": "number (kg)",
  "startBf": "number (%) | null",
  "goalBf": "number (%) | null",
  "setupDate": "ISO date string",
  "setupComplete": true
}
```

#### `checkins`
Keyed by date string (`YYYY-MM-DD`):
```json
{
  "2026-02-27": {
    "date": "2026-02-27",
    "weight": "number | null",
    "bodyFat": "number | null",
    "feeling": "1-5",
    "meals": {
      "breakfast": "good | okay | bad | ''",
      "lunch": "good | okay | bad | ''",
      "dinner": "good | okay | bad | ''"
    },
    "overallDiet": "good | okay | bad",
    "trained": "boolean",
    "restDay": "boolean",
    "timestamp": "ISO datetime"
  }
}
```

#### `temptations`
Keyed by date string:
```json
{
  "2026-02-27": [
    {
      "type": "cake | beer | snacks | chocolate | other",
      "timestamp": "ISO datetime",
      "note": "string | null"
    }
  ]
}
```

#### `injuries`
Array:
```json
[
  {
    "area": "string",
    "severity": "mild | moderate | needs_attention",
    "dateLogged": "YYYY-MM-DD",
    "active": "boolean"
  }
]
```

#### `recoveryLogs`
Keyed by date string:
```json
{
  "2026-02-27": {
    "types": ["stretch", "walk", "full_rest", "foam_roll"],
    "date": "2026-02-27"
  }
}
```

---

## 5. Screens

### 5.1 Setup Wizard

**Trigger:** Shown on first launch when no `profile` exists in storage, or when `profile.setupComplete !== true`.

**Flow:** Single scrollable form (not multi-step — keeps it fast).

**Fields:**
| Field | Type | Required | Placeholder/Default |
|-------|------|----------|-------------------|
| Name | Text | Yes | "Your first name" |
| Height | Number (cm) | Yes | "e.g. 180" |
| Start weight | Number (kg) | Yes | "Current weight in kg" |
| Goal weight | Number (kg) | Yes | "Target weight in kg" |
| Weight floor | Number (kg) | No | "Minimum safe weight" |
| Current body fat % | Number | No | "e.g. 25" |
| Goal body fat % | Number | No | "e.g. 18" |

**Validation:**
- Name: non-empty
- Height: 100-250cm
- Start weight: 30-300kg
- Goal weight: must be less than start weight (or allow higher for those gaining — just validate it's between 30-300)
- Weight floor: if provided, must be ≤ goal weight
- BF%: 3-60% if provided

**Submit button:** "Let's go" — saves profile, transitions to check-in screen.

**Tone:** Welcoming but not cheesy. "Set your targets. Be realistic — this works when you are."

### 5.2 Morning Check-in (Home Tab)

**Header:** "Morning, {name}" (from profile) or "Morning Check-in" if no name.

**Fields (in order):**
1. **Weight (kg)** — optional number input, one decimal
2. **Body fat %** — optional number input, one decimal
3. **How do you feel?** — 5-point emoji picker (💀 Wrecked → 🔥 Great)
4. **Yesterday's meals** — 3 rows (Breakfast, Lunch, Dinner), each with Good/Okay/Bad buttons
5. **Overall day rating** — Good/Okay/Bad (covers snacking, extras, general discipline)
6. **Trained yesterday?** — Yes/No toggle
7. **Rest day?** — Yes/No toggle (mutually exclusive with trained)

**Smart nudges:** Shown above the form, max 3 at a time. See section 7.

**Save button:** "LOG CHECK-IN" → "✓ UPDATED" once saved. Can re-edit same day.

### 5.3 Diet Tracker (Diet Tab)

**Sections:**
1. **Clean streak** — large counter showing consecutive days with "good" overall diet. Emoji escalation: 🎯 (0-2), 💪 (3-6), 🔥 (7+).
2. **Week view** — 7 columns (Mon-Sun), colour-coded by overall diet score (green/amber/red/grey).
3. **Log a treat** — grid of quick-tap buttons:
   - 🍰 Cake/Treats
   - 🍺 Beer
   - 🍿 Snacks
   - 🍫 Chocolate
   - 🛒 Other
   - Two taps to log (first tap selects, second confirms)
   - Beer button shows "WEEKEND OK" on Fri-Sun
4. **Today's treats** — list of logged items with timestamps.

### 5.4 Rest & Recovery (Recovery Tab)

**Sections:**
1. **Consecutive training days** — counter with progress bar. Colour: green (1-2), amber (3), red (4+). Direct warning text at 3+.
2. **Rest days this week** — X/2 with target indicator.
3. **Recovery activities** — 2x2 grid of toggles:
   - 🧘 Stretching/Yoga
   - 🚶 Light walk
   - 🛋️ Full rest
   - 💆 Massage/Foam roll
4. **Active injuries** — list with severity colour coding. "CLEAR" button to resolve. Add form with area text input + severity dropdown + add button.

### 5.5 Dashboard (Dashboard Tab)

**Sections (in order):**
1. **Key stats** — 3-column grid:
   - Current weight (or "—")
   - Weight lost (from start, or "—")
   - To go (to goal, or "✓" if reached)
2. **Body fat stats** — 3-column grid (only shown if BF% data exists):
   - Current BF%
   - BF% change (from start)
   - BF% to goal
3. **Weight trend chart** — last 14 weigh-ins as bar chart. Target zone indicated.
4. **Body fat trend chart** — last 14 BF% readings as bar chart. Goal indicated. (Only shown if 2+ readings exist.)
5. **Diet this week** — 7 bars colour-coded by overall diet score.
6. **Meals this week** — grid: 3 rows (breakfast/lunch/dinner) × 7 columns, colour-coded dots.
7. **Week stats** — 2x2 grid:
   - Good diet days (X/7)
   - Clean streak (Xd)
   - Rest days (X/2)
   - Treats this week (count)
8. **Active injuries** — red card with list (only if injuries exist).

### 5.6 Settings (Accessed via gear icon in header)

**Sections:**
1. **Profile** — edit all setup wizard fields (name, height, start weight, goal weight, weight floor, current BF%, goal BF%)
2. **Data** — "Reset all data" button with confirmation dialog
3. **About** — app name, version, tagline

---

## 6. Beer Rules

- **Monday–Thursday:** Beer = treat (flagged, counted)
- **Friday–Sunday:** Beer = allowed (button shows "WEEKEND OK", still loggable but not flagged as negative)
- Weekday beers trigger specific nudge

---

## 7. Nudge Engine (`nudges.js`)

All nudges are direct, cause-and-effect language. No softening.

### Nudge Priority & Display
- Maximum 3 nudges shown at once
- Priority: danger > warning > success
- Shown on check-in screen above the form

### Nudge Rules

| ID | Trigger | Type | Message |
|----|---------|------|---------|
| `train_4plus` | 4+ consecutive training days | danger | "{n} days straight training. You will get injured. Rest today — not tomorrow, today." |
| `train_3` | 3 consecutive training days | warning | "3 days straight. One more without rest increases your injury risk significantly. Schedule a rest day." |
| `injury_no_rest` | Active injury + 2+ consecutive training days | danger | "You have active niggles ({areas}). Training on them turns a 3-day recovery into a 3-week one. Rest now." |
| `diet_bad_3plus` | 3+ bad diet days this week | danger | "{n} bad diet days this week. This is why your weight isn't moving. Every bad day adds 2-3 days to reaching your goal." |
| `diet_bad_2` | 2 bad diet days this week | warning | "{n} bad days already this week. You need 5 clean days minimum to see the scale move." |
| `weekday_beer` | Any weekday beer logged this week | warning | "{n} weekday beer(s) this week. Weekday beers are empty calories that directly slow your fat loss. Save it for the weekend." |
| `clean_streak_5` | 5+ clean eating days | success | "{n} clean days in a row. One bad meal doesn't ruin this — but one bad day makes the next one easier to justify. Stay sharp." |
| `no_rest_days` | 0 rest days this week (5+ days in) | warning | "Zero rest days this week. You need minimum 2 per week. Your muscles grow during rest, not during training." |
| `weight_down` | Total weight lost > 0 | success | "Down {x}kg since you started. The boring consistency is working. Don't stop." |
| `weight_target` | Weight in target zone | success | "You're in your target zone ({x}kg). Now maintain it. Don't let up." |
| `weight_floor` | Weight below floor | danger | "{x}kg is below your floor. You need to eat more — being underweight at your height causes its own problems." |
| `weight_plateau` | Weight unchanged (±0.5kg) for 14+ days | warning | "Weight hasn't moved in 2 weeks. Look at your diet logs — the answer is there. Consistency has slipped somewhere." |
| `bf_down` | BF% trending down | success | "Body fat down {x}% since you started. Even if the scale isn't moving, you're getting leaner." |
| `bf_target` | BF% at or below goal | success | "You've hit your body fat target ({x}%). Maintain it." |

---

## 8. Shared Components

### TabBar
- Fixed bottom, 4 tabs: Check-in (✓), Diet (◉), Recovery (♡), Dashboard (▦)
- Active tab = accent blue, inactive = muted
- White background, top border, subtle shadow

### Header
- Fixed top area (scrolls with content)
- Logo (32px SVG) + "Pulse Shift" text
- Gear icon (⚙) on right → navigates to settings

### NudgeCard
- Left border colour based on type (red/amber/green)
- Background tint based on type
- 13px text, font-weight 500, line-height 1.55

### MealRater
- Row: label (80px) + 3 buttons (Good ✅ / Okay ⚠️ / Bad ❌)
- Active state: coloured border + background tint + coloured text

### FeelingPicker
- 5 buttons in a row, each with emoji + label
- Active: accent blue border + light blue background

### ToggleGroup
- 2 buttons (Yes/No), flex row
- Active states: Yes = green, No = amber (for trained); Yes = accent, No = muted (for rest)

### StatBox
- White card, centred text
- Label (10px uppercase) + value (20-22px bold)
- Value colour varies by context

### WeekStrip
- 7 equal columns with day label + colour-coded cell
- Today highlighted with accent border

---

## 9. PWA Configuration

### manifest.json
```json
{
  "name": "Pulse Shift",
  "short_name": "Pulse Shift",
  "description": "Small shifts. Big change.",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#f8f9fb",
  "theme_color": "#2563ff",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker (sw.js)
- Cache-first strategy for static assets (CSS, JS, icons, fonts)
- Network-first for index.html (so updates are picked up)
- Offline fallback — app works fully offline after first load

---

## 10. Logo & Icons

### Logo SVG (`icons/logo.svg`)
```svg
<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="80" height="80" rx="20" fill="#2563ff"/>
  <path d="M16 44 L26 44 L30 32 L36 56 L42 38 L46 48 L50 44 L54 44"
        stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="58" cy="40" r="6" stroke="white" stroke-width="2.5" fill="none"/>
  <path d="M58 36 L58 44 M54 40 L62 40"
        stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
</svg>
```

**Description:** Pulse/heartbeat line (3 peaks) on the left, transitioning into a crosshair/target circle on the right. White on electric blue. Rounded square container.

### PWA Icons
- Generate icon-192.png and icon-512.png from the SVG
- favicon.svg = same SVG for browser tabs

---

## 11. Splash Screen

**Shown:** On app load, for 1.5 seconds, then fades out.

**Layout:**
- Centred vertically and horizontally
- Logo SVG at 80px with gentle pulse glow animation
- "Pulse Shift" in 28px, weight 800
- "Small shifts. Big change." in 14px, muted colour

**Animation:**
```css
@keyframes pulseGlow {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
```

---

## 12. Constants

### Feelings
| Value | Emoji | Label |
|-------|-------|-------|
| 1 | 💀 | Wrecked |
| 2 | 😮‍💨 | Rough |
| 3 | 😐 | Alright |
| 4 | 💪 | Good |
| 5 | 🔥 | Great |

### Meals
| ID | Label |
|----|-------|
| breakfast | Breakfast |
| lunch | Lunch |
| dinner | Dinner |

### Meal/Diet Ratings
| Value | Emoji | Label | Colour |
|-------|-------|-------|--------|
| good | ✅ | Good | var(--green) |
| okay | ⚠️ | Okay | var(--amber) |
| bad | ❌ | Bad | var(--red) |

### Treat Types
| ID | Emoji | Label |
|----|-------|-------|
| cake | 🍰 | Cake/Treats |
| beer | 🍺 | Beer |
| snacks | 🍿 | Snacks |
| chocolate | 🍫 | Chocolate |
| other | 🛒 | Other |

### Recovery Types
| ID | Emoji | Label |
|----|-------|-------|
| stretch | 🧘 | Stretching/Yoga |
| walk | 🚶 | Light walk |
| full_rest | 🛋️ | Full rest |
| foam_roll | 💆 | Massage/Foam roll |

### Injury Severities
| Value | Colour |
|-------|--------|
| mild | var(--amber-light) |
| moderate | var(--amber) |
| needs_attention | var(--red) |

---

## 13. Key Behaviours

### Check-in
- One check-in per day (keyed by date)
- Can be edited/updated same day (form repopulates from stored data)
- Weight and BF% are optional — some days you won't measure
- Trained and rest day are mutually exclusive (selecting one deselects the other)
- Diet ratings refer to *yesterday* (you're logging in the morning)

### Treats
- Two taps to log (prevents accidental logging)
- Beer on Friday–Sunday shows "WEEKEND OK" and is not counted as negative
- Beer on Monday–Thursday is counted and triggers nudge
- Each treat is timestamped
- Treats are shown in a list under the log buttons

### Rest & Recovery
- Consecutive training days = unbroken chain of days where `trained === true && restDay !== true`, counting backwards from today
- Rest day target = minimum 2 per week
- Injuries persist until manually cleared
- Active injuries increase urgency of rest nudges

### Dashboard
- Weight chart shows last 14 data points (not last 14 days — only days with weigh-ins)
- BF% chart same logic
- Diet bar heights: good = 100%, okay = 60%, bad = 30%, no data = 8%
- Meal dot grid: coloured by individual meal rating

### Settings
- All profile fields are editable
- Changing goal weight/BF% immediately updates dashboard calculations
- "Reset all data" clears all localStorage keys with confirmation ("This will delete all your data. Are you sure?")

---

## 14. Accessibility

- All interactive elements are `<button>` elements (not divs with click handlers)
- Colour is never the only indicator — always paired with emoji, text, or shape
- Touch targets minimum 44px
- Form inputs have associated labels
- Sufficient colour contrast on all text (WCAG AA minimum)

---

## 15. Deployment

### Static hosting (simplest)
- Upload all files to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages)
- No build step required
- HTTPS required for PWA/service worker

### Local development
- Any local server: `npx serve .` or `python -m http.server 8000`
- Open `http://localhost:8000`

---

## 16. Future Enhancements (v2+)

- Push notification reminders (morning check-in prompt)
- Monthly trends & insights ("Your diet is better on weekdays", "You tend to skip rest on Tuesdays")
- Body map for injury logging (visual tap-to-select)
- Photo progress tracking
- Data export (CSV/JSON)
- Multi-user support (profile switcher)
- Integration with Apple Health / Google Fit for step count
- Dark mode toggle
- Customisable treat categories
- Weekly email summary

---

## 17. Success Criteria

The app is working if:
- You (and your wife) open it every morning and complete the check-in in under 30 seconds
- You actually take 2+ rest days per week
- Clean eating streaks get longer over time
- Weight and/or BF% trend towards goals
- Fewer injuries from overtraining
- The treats log makes you think twice before grabbing a biscuit

---

*Ready to build when you are.*
