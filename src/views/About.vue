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
                  <mark>Application «&nbsp;Bailly&nbsp;»</mark> Antoine Boquet &amp;
                  Benjamin Georges / Licence <em>GNU Affero General Public License</em>
                  &mdash; «&nbsp;AGPL-3.0-or-later&nbsp;»
                  (<a href="COPYING" target="_blank" rel="noopener">texte&nbsp;intégral</a>)
                  / Consulter le <a href="#">code&nbsp;source</a>.
                  <!--/ Le grec est rendu par les jolies fontes de la
                  <a href="https://greekfontsociety-gfs.gr/" target="_blank" rel="noopener">Greek&nbsp;Font&nbsp;Society</a>
                  (sous <a href="http://scripts.sil.org/OFL" target="_blank" rel="noopener">licence&nbsp;OFL</a>)-->
                </p>

                <p>
                  <mark>Bailly 2020 Hugo Chávez</mark> Gérard Gréco,
                  André Charbonnet, Mark De Wilde, Bernard Maréchal &amp;
                  <a v-if="!toggleContributors" @click="toggleContributors = !toggleContributors">contributeurs</a>
                  <span v-if="toggleContributors">contributeurs ({{ contributors.join(', ') }}
                  <a @click="toggleContributors = !toggleContributors">[masquer]</a>)</span>
                  / Licence <em>Creative Commons Attribution - Pas d'Utilisation
                  Commerciale - Pas de Modification</em> &mdash; «&nbsp;CC&nbsp;BY-NC-ND&nbsp;4.0&nbsp;»
                  (<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.fr" target="_blank" rel="noopener">résumé</a>&nbsp;|&nbsp;<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.fr" target="_blank" rel="noopener">texte&nbsp;intégral</a>)
                  / Consulter la <a href="http://gerardgreco.free.fr/spip.php?article52" target="_blank" rel="noopener">source</a>.
                </p>
              </div>

              <footer class="card-footer">
                <span v-if="showAddress" class="card-footer-item has-text-weight-bold">{{ emailAddress }}</span>

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
                  <span>Contact</span>
                </a>
              </footer>
            </div>
          </div>

          <div class="column is-8-desktop is-6-widescreen">
            <div class="content has-text-justified is-size-5 is-family-secondary">
              <p>
                <strong>Le «&nbsp;Bailly.&nbsp;»</strong> Le dictionnaire d'Anatole Bailly
                est un ouvrage de référence incontournable pour les hellénistes francophones.
                Depuis sa parution initiale, en 1894, le «&nbsp;Bailly&nbsp;» a connu de nombreuses rééditions
                témoignant de son succès. Le texte que nous proposons est fondé sur la Quatrième
                édition (1935), aujourd'hui passée dans le domaine public. Celui-ci a fait l'objet
                de révisions substantielles, que nous détaillons ci-dessous.
              </p>

              <p>
                <strong>Numérisation et révision.</strong> C'est à Gérard Gréco
                et aux personnes qui ont œuvré à ses côtés qu'il faut rendre
                hommage pour cette édition du «&nbsp;Bailly.&nbsp;» Celle-ci
                repose sur un important travail de numérisation et de révision
                entrepris à partir de l'édition de 1935. Ce travail de révision
                relève d'abord de la revue et de la correction de la numérisation
                automatique du texte (procédé de reconnaissance optique de caractères
                ou <em>océrisation</em>). Il relève par ailleurs de la correction
                des erreurs notables du texte de 1935 et de la normalisation des
                entrées. C'est pourquoi l'édition numérique qui vous est ici
                présentée s'intitule, à bon droit, <em>«&nbsp;Bailly 2020 Hugo Chávez.&nbsp;»</em>
              </p>

              <p>
                <strong>Autres éditions numériques.</strong> Vous trouverez
                sur la page du projet de numérisation du «&nbsp;Bailly&nbsp;» une
                <a href="http://gerardgreco.free.fr/spip.php?article52" target="_blank" rel="noopener">édition PDF</a>
                reproduisant la mise en page d'origine. Le <a href="https://archive.org/details/BaillyDictionnaireGrecFrancais">fac-similé</a>
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
      toggleContributors: false
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
