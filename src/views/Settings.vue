<template>
  <section class="settings hero is-fullheight-with-navbar">
    <!--<h1 class="title is-1 is-size-2-mobile mb-6 has-text-centered">Préférences</h1>-->
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-half">
            <div class="card">
              <div class="card-content">
                <!--<a
                  class="button help-button"
                  :class="{ 'is-primary': toggleInputModeHelp }"
                  @click="toggleInputModeHelp = !toggleInputModeHelp"
                >
                  <span class="icon">
                    <ion-icon
                      class="ion-ionic"
                      name="help-circle-outline"
                      size="large"
                    >
                      <span>?</span>
                    </ion-icon>
                  </span>
                </a>-->

                <div class="field">
                  <label class="label is-horizontal">
                    <span class="icon">
                      <ion-icon
                        class="ion-ionic"
                        name="repeat-outline"
                        size="large">
                      </ion-icon>
                    </span>
                    Mode de saisie
                  </label>
                  <div class="select is-rounded">
                    <select v-model="selectedinputModeOption">
                      <option
                        v-for="option in inputModeOptions"
                        v-bind:key="option.value"
                        v-bind:value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>
                <article class="message">
                  <div class="message-body">
                    Tapez <code>{{ selectedinputModeOption === 0 ? 'anqrwpos' : 'anthrôpos' }}</code>
                    ({{ selectedinputModeOption === 0 ? 'q = θ, w = ω' : 'th = θ, ô = ω' }})
                    pour trouver le mot «&nbsp;<span class="greek">ἄνθρωπος</span>&nbsp;».
                  </div>
                </article>
              </div>
              <footer class="card-footer is-block content"> <!-- v-if="toggleInputModeHelp" -->
                <p>
                  Pour saisir des caractères grecs à partir d'un clavier latin (AZERTY), deux méthodes
                  sont proposées :
                </p>

                <ol>
                  <li>Le <mark>beta code</mark> non accentué, qui instaure une équivalence
                  arbitraire entre les lettres latines et grecques. Essayez-le, et vous serez
                  rapidement en mesure d'obtenir les lettres que vous désirez.</li>

                  <li>La notation <mark>translittérée</mark> (ou scientifique), utilisée par les
                  éditeurs pour noter du grec à destination d'un public non helléniste. Retenez que
                  le circonflexe <code>^</code> permet de noter les voyelles longues.</li>
                </ol>
                <p>
                  Qu'importe le mode de saisie actif, vous pouvez également utiliser une
                  <mark>disposition de clavier</mark> grecque au niveau de votre système.
                </p>
              </footer>
            </div>
          </div>

          <div class="column">
            <div class="card">
              <div class="card-content">
                <!--<a
                  class="button help-button"
                  :class="{ 'is-primary': toggleCaseSensitivityHelp }"
                  @click="toggleCaseSensitivityHelp = !toggleCaseSensitivityHelp"
                >
                  <span class="icon">
                    <ion-icon
                      class="ion-ionic"
                      name="help-circle-outline"
                      size="large"
                    >
                      <span>?</span>
                    </ion-icon>
                  </span>
                </a>-->

                <div class="field">
                  <label class="label is-horizontal">
                    <span class="icon">
                      <ion-icon
                        class="ion-ionic"
                        name="text-outline"
                        size="large">
                    </ion-icon>
                    </span>
                    Sensibilité à la casse
                  </label>
                  <div class="select is-rounded">
                    <select v-model="selectedCaseSensitivityOption">
                      <option
                        v-for="option in caseSensitivityOptions"
                        v-bind:key="option.value"
                        v-bind:value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <footer class="card-footer"> <!-- v-if="toggleCaseSensitivityHelp" -->
                <p>
                  L'activation de la sensibilité à la casse permet notamment d'effectuer des
                  recherches rapides sur les noms propres.
                </p>
              </footer>
            </div>

            <div class="card">
              <div class="card-content">
                <!--<a
                  class="button help-button"
                  :class="{ 'is-primary': toggleDisplayOptionHelp }"
                  @click="toggleDisplayOptionHelp = !toggleDisplayOptionHelp"
                >
                  <span class="icon">
                    <ion-icon
                      class="ion-ionic"
                      name="help-circle-outline"
                      size="large"
                    >
                      <span>?</span>
                    </ion-icon>
                  </span>
                </a>-->

                <div class="field">
                  <label class="label is-horizontal">
                    <span class="icon">
                      <ion-icon
                        class="ion-ionic"
                        name="grid-outline"
                        size="large">
                    </ion-icon>
                    </span>
                    Présentation des résultats
                  </label>
                  <div class="select is-rounded">
                    <select v-model="selectedDisplayOption">
                      <option
                        v-for="option in displayOptions"
                        v-bind:key="option.value"
                        v-bind:value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <footer class="card-footer"> <!-- v-if="toggleDisplayOptionHelp" -->
                <p>
                  L'affichage en <mark>tuiles</mark> donne un aperçu des définitions
                  permettant d'accélerer les recherches. L'affichage sous forme de
                  <mark>liste</mark> offre les meilleures performances et peut notamment
                  être recommandé pour les appareils les plus anciens.
                </p>
              </footer>
            </div>

            <!--<div class="card">
              <div class="card-content">
                <div class="field">
                  <label class="label is-horizontal">Thème de l'application</label>
                  <div class="select is-rounded">
                    <select>
                      <option selected>Clair (par défaut)</option>
                      <option>Sombre</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>-->

            <!--<div class="card">
              <div class="card-content">
                <div class="field">
                  <label class="label is-horizontal">Fonte grecque</label>
                  <div class="select is-rounded">
                    <select>
                      <option>GFS Artemisia</option>
                      <option selected>GFS Didot</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>-->
          </div>
        </div>

        <div class="field has-text-centered">
          <button class="button is-primary is-outlined is-rounded has-text-weight-bold" @click="resetSettings">
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { displayMode, inputMode } from '@/enums'

export default {
  name: 'Settings',

  data () {
    return {
      caseSensitivityOptions: [
        { text: 'Activée', value: true },
        { text: 'Désactivée', value: false }
      ],

      displayOptions: [
        { text: 'Tuiles', value: displayMode.TILES },
        { text: 'Liste', value: displayMode.LIST }
      ],

      inputModeOptions: [
        { text: 'Beta code', value: inputMode.BETA_CODE },
        { text: 'Translittération', value: inputMode.TRANSLITERATION }
      ],

      //toggleCaseSensitivityHelp: true,
      //toggleDisplayOptionHelp: true,
      //toggleInputModeHelp: true
    }
  },

  computed: {
    selectedCaseSensitivityOption: {
      get () {
        return this.$store.state.settings.search.caseSensitive
      },

      set (value) {
        this.$store.commit('caseSensitivitySetting', value)
      }
    },

    selectedDisplayOption: {
      get () {
        return this.$store.state.settings.display
      },

      set (value) {
        this.$store.commit('displaySetting', value)
      }
    },

    selectedinputModeOption: {
      get () {
        return this.$store.state.settings.search.inputMode
      },

      set (value) {
        this.$store.commit('inputModeSetting', value)
      }
    }
  },

  methods: {
    resetSettings () {
      this.$store.dispatch('resetSettings')
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: $block-spacing;
}

.card-content {
  user-select: none;
}

label > .icon {
  vertical-align: middle;
  margin-top: -0.4rem;
  margin-right: 0.25rem;
  color: $primary;
}

/*.help-button {
  float: right;
}*/

.card-footer {
  padding: $block-spacing;
  background-color: $grey-lighter;
  border-bottom-left-radius: $radius-large;
  border-bottom-right-radius: $radius-large;
  font-weight: 700;
}

@media only screen and (min-width: $tablet) {
  label.is-horizontal {
    display: inline-block !important;
    margin-right: 1.5em;
    margin-bottom: 0 !important;
    line-height: 2.5em;
  }
}

@media only screen and (max-width: $tablet) {
  .column:not(:last-of-type) {
    padding-bottom: 0;
  }

  .column:not(:first-of-type) {
    padding-top: 0;
  }

  select, .select {
    width: 100%;
  }

  /*.help-button {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: $radius-large;
    border-top-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top: 0;
    border-right: 0;
  }*/
}
</style>
