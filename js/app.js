// Pulse Shift — App initialisation
const { createApp, ref, computed, onMounted } = Vue;

const app = createApp({
  components: {
    AppHeader: Header,
    TabBar,
    SetupWizard,
    CheckinScreen,
    DietScreen,
    InjuriesScreen,
    DashboardScreen,
    SettingsScreen
  },
  setup() {
    const showSplash = ref(true);
    const currentScreen = ref('checkin');
    const setupComplete = ref(Store.isSetupComplete());

    const showSettings = computed(() => currentScreen.value === 'settings');

    onMounted(() => {
      setTimeout(() => {
        showSplash.value = false;
      }, 1500);
    });

    function navigate(screen) {
      currentScreen.value = screen;
    }

    function openSettings() {
      currentScreen.value = 'settings';
    }

    function closeSettings() {
      currentScreen.value = 'checkin';
    }

    function onSetupComplete() {
      setupComplete.value = true;
      currentScreen.value = 'checkin';
    }

    function onReset() {
      setupComplete.value = false;
      currentScreen.value = 'checkin';
    }

    return {
      showSplash,
      currentScreen,
      setupComplete,
      showSettings,
      navigate,
      openSettings,
      closeSettings,
      onSetupComplete,
      onReset
    };
  },
  template: `
    <!-- Splash -->
    <div class="splash" :class="{ 'fade-out': !showSplash }">
      <img src="/icons/logo.svg" alt="Pulse Shift" class="splash-logo">
      <div class="splash-title">Pulse Shift</div>
      <div class="splash-tagline">Small shifts. Big change.</div>
    </div>

    <!-- Setup wizard -->
    <template v-if="!setupComplete">
      <setup-wizard @complete="onSetupComplete" />
    </template>

    <!-- Main app -->
    <template v-else>
      <app-header @settings="openSettings" :show-settings="currentScreen !== 'settings'" />

      <checkin-screen v-if="currentScreen === 'checkin'" />
      <diet-screen v-if="currentScreen === 'diet'" />
      <injuries-screen v-if="currentScreen === 'injuries'" />
      <dashboard-screen v-if="currentScreen === 'dashboard'" />
      <settings-screen
        v-if="currentScreen === 'settings'"
        @back="closeSettings"
        @reset="onReset"
      />

      <tab-bar
        v-if="currentScreen !== 'settings'"
        :active="currentScreen"
        @navigate="navigate"
      />
    </template>
  `
});

app.mount('#app');
