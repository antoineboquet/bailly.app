<template>
  <div class="about">
    <section class="hero is-fullheight-with-navbar">
      <div class="hero-body">
        <div class="container is-max-desktop box is-shadowless has-text-centered">
            <h1 class="title is-1 is-size-2-mobile">
              À propos
            </h1>

            <h2 class="subtitle is-2 is-size-4-mobile">
              d'un dictionnaire de référence numérisé
            </h2>

            <!--<p class="content is-size-4 is-size-5-mobile mt-6">
              Cette application permet de consulter le dictionnaire grec&ndash;français
              d'Anatole Bailly. Elle entend rendre plus accessible la langue grecque,
              tant par ses fonctionnalités et son ergonomie que par sa gratuité.
            </p>-->
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column is-12 is-4-desktop is-offset-1-widescreen mb-4">
            <div class="card">
              <div class="card-content">
                <h3 class="title">Mentions</h3>

                <p class="mb-3">
                  <strong><span class="gradient">Application «&nbsp;Bailly&nbsp;»</span></strong> Antoine Boquet &amp;
                  Benjamin Georges / Licence <em>GNU Affero General Public License</em>
                  &mdash; «&nbsp;AGPL-3.0-or-later&nbsp;»
                  (<a href="COPYING" target="_blank" rel="noopener">texte&nbsp;intégral</a>)
                  / Consulter le <a target="_blank" rel="noopener" href="https://github.com/antoineboquet/bailly.app">code&nbsp;source</a>.
                </p>

                <p>
                  <strong><span class="gradient">Bailly 2020 Hugo Chávez</span></strong> Gérard Gréco,
                  André Charbonnet, Mark De Wilde, Bernard Maréchal &amp;
                  <a v-if="!toggleContributors" @click="toggleContributors = !toggleContributors">contributeurs</a>
                  <span v-if="toggleContributors">contributeurs ({{ contributors.join(', ') }}
                  <a @click="toggleContributors = !toggleContributors">[masquer]</a>)</span>
                  / Licence <em>Creative Commons Attribution - Pas d'Utilisation
                  Commerciale - Pas de Modification</em> &mdash; «&nbsp;CC&nbsp;BY-NC-ND&nbsp;4.0&nbsp;»
                  (<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.fr" target="_blank" rel="noopener">résumé</a>&nbsp;|&nbsp;<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.fr" target="_blank" rel="noopener">texte&nbsp;intégral</a>)
                  / Consulter la <a href="http://gerardgreco.free.fr/spip.php?article52" target="_blank" rel="noopener">source</a>.
                </p>
                <pre class="mt-5 px-3 py-2">Version des données&nbsp;: 28 février 2023</pre>
              </div>

              <footer class="card-footer" style="flex-direction: column;">
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=HFBZZVKRBE7HY&amp;locale.x=fr_FR"
                  target="_blank"
                  rel="noopener"
                  class="card-footer-item has-text-weight-bold"
                  style="border: 0; border-bottom: 1px solid #ededed;"
                >
                  <span class="icon mr-2">
                    <ion-icon class="ion-ionic" name="heart-outline" size="large">
                      <span>&#10084;</span>
                    </ion-icon>
                  </span>
                  <span>Faire un don</span>
                </a>

                <span v-if="showAddress" class="card-footer-item">
                  {{ emailAddress }}
                </span>

                <a
                  v-else
                  class="card-footer-item has-text-weight-bold"
                  :href="`mailto:${emailAddress}?subject=${emailSubject}`"
                  @click="showAddress = true"
                >
                  <span class="icon mr-2">
                    <ion-icon class="ion-ionic" name="mail-outline" size="large">
                      <span>&#128231;</span>
                    </ion-icon>
                  </span>
                  <span>Nous contacter</span>
                </a>
              </footer>
            </div>
          </div>

          <div class="column is-8-desktop is-6-widescreen">
            <div class="content has-text-justified is-size-5 is-family-secondary">
              <p>
                <strong>Le «&nbsp;Bailly.&nbsp;»</strong> Le dictionnaire
                d'Anatole Bailly est un ouvrage de référence incontournable pour
                les hellénistes francophones. Depuis sa parution initiale, en 1894,
                le «&nbsp;Bailly&nbsp;» a connu de nombreuses rééditions témoignant
                de son succès. Le texte que nous proposons est fondé sur la Quatrième
                édition (1935), aujourd'hui passée dans le domaine public. Celui-ci a
                fait l'objet de révisions substantielles, que nous détaillons ci-dessous.
              </p>

              <p>
                <strong>Numérisation et révision.</strong> Cette application a été rendue
                possible par le travail préalable de Gérard Gréco et de son équipe. En effet,
                le <em>«&nbsp;Bailly 2020 Hugo Chávez&nbsp;»</em>, que nous mettons à votre
                disposition, est le résultat d'une entreprise de numérisation et de révision
                sans précédent du dictionnaire d'Anatole Bailly. Il aura d'abord fallu procéder
                à la numérisation du texte (procédé de reconnaissance optique des caractères ou
                <em>océrisation</em>), puis à une fastidieuse étape de correction manuelle.
                Le texte de 1935 n'étant pas exempt d'erreurs, un travail de correction,
                effectué à partir d'ouvrages de référence, a ensuite été nécessaire.
                Enfin, l'équipe de M. Gréco a procédé à une mise à jour des étymologies et de
                la toponymie, ainsi qu'à la normalisation des références.
                Pour plus de détails concernant cette édition numérique, nous vous conseillons
                de vous reporter à sa <a :href="`${publicPath}pdf/notice-édition-2020.pdf`" target="_blank">notice</a>.
              </p>

              <p>
                <strong>Autres éditions numériques.</strong> Vous trouverez
                sur la page du projet de numérisation du «&nbsp;Bailly&nbsp;» une
                <a href="http://gerardgreco.free.fr/spip.php?article52" target="_blank" rel="noopener">édition PDF</a>
                proposant une mise en page similaire à celle de l'ouvrage d'origine.
                Le <a href="https://archive.org/details/BaillyDictionnaireGrecFrancais">fac-similé</a>
                de l'édition de 1935 est par ailleurs disponible sur l'<em>Internet Archive</em>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'About',

  data () {
    return {
      contributors: [
        'José Antonio Artés',
        'Anne Bargibant',
        'Jérôme Bastick',
        'Adrienne Bernardi',
        'Adrien Bresson',
        'Jean Pierre Brèthes',
        'Hélène Chaillot',
        'Isabelle Chouinard',
        'Marine Chovin',
        'Florent Cistac',
        'Guillaume Crocquevieille',
        'Élisa Cuvillier',
        'Alexia Dedieu',
        'Blandine Demotz',
        'Aurélien Dollard',
        'Thomas Frétard',
        'Yvon Gicquel',
        'Stéphanie GRoulard',
        'Stéphane Itic',
        'Laurence Jénoc',
        'Annick Judas',
        'Franck Kempf',
        'Charlotte Labro',
        'Xavier Lafontaine',
        'Sylvie Launay',
        'Isabelle Le Bris-Leleux',
        'Annabelle Maniez',
        'Jean-Baptiste Navlet',
        'Joseph Ozelz Owono',
        'Émilie Picard',
        'Jérémie Pinguet',
        'Lucas Rascle',
        'Benjamin Sevestre',
        'Bernard Simon',
        'Marie-Dominique Simon',
        'Anne-Laure Viger',
        'Christine Vulliard'
      ],
      emailAddress: 'contact@bailly.app',
      emailSubject: '[bailly.app]',
      showAddress: false,
      toggleContributors: false,
      publicPath: process.env.BASE_URL
    }
  }
}
</script>

<style lang="scss" scoped>
@media only screen and (min-width: $desktop) {
  .card {
    margin-bottom: $gap;
  }
}

@media only screen and (min-width: $widescreen) {
  .card {
    margin-top: 60px;
    margin-right: $gap;
  }
}

.hero {
  background: url('~@/assets/img/bailly-illustration.jpg') center no-repeat;
  background-size: cover;
  box-shadow: 0 1px 0 0 $border-light,
              inset 0 -150px 150px -100px rgba(black, 0.35);
}

.hero-body {
  background: rgba($warning, .15);
}

.hero-body .box {
  background: rgba($white, 0.99);
  backdrop-filter: blur(3px);
}
</style>
