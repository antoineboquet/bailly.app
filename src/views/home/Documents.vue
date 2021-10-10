<template>
  <div class="home-documents hero is-fullheight-with-navbar">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column is-one-third is-one-fifth-fullhd">
            <a :href="`${publicPath}pdf/préface-anatole-bailly.pdf`" target="_blank" class="card">
              <div class="card-image is-hidden-mobile">
                <figure class="image is-3by2">
                  <img :src="`${publicPath}img/préface-anatole-bailly.jpg`" alt="Aperçu du fichier">
                </figure>
              </div>
              <div class="card-content">
                <p class="title is-5">Préface d'Anatole&nbsp;Bailly</p>
              </div>
            </a>
          </div>

          <div class="column is-one-third is-one-fifth-fullhd">
            <a :href="`${publicPath}pdf/notice-édition-2020.pdf`" target="_blank" class="card">
              <div class="card-image is-hidden-mobile">
                <figure class="image is-3by2">
                  <img :src="`${publicPath}img/notice-édition-2020.jpg`" alt="Aperçu du fichier">
                </figure>
              </div>
              <div class="card-content">
                <p class="title is-5">Notice du Bailly 2020 Hugo&nbsp;Chávez</p>
              </div>
            </a>
          </div>

          <div class="column is-one-third is-one-fifth-fullhd">
            <a :href="`${publicPath}pdf/liste-auteurs-ouvrages.pdf`" target="_blank" class="card">
              <div class="card-image is-hidden-mobile">
                <figure class="image is-3by2">
                  <img :src="`${publicPath}img/liste-auteurs-ouvrages.jpg`" alt="Aperçu du fichier">
                </figure>
              </div>
              <div class="card-content">
                <p class="title is-5">Liste des auteurs et des ouvrages</p>
              </div>
            </a>
          </div>

          <div class="column is-one-third is-one-fifth-fullhd">
            <a :href="`${publicPath}pdf/abréviations-signes-usuels.pdf`" target="_blank" class="card">
              <div class="card-image is-hidden-mobile">
                <figure class="image is-3by2">
                  <img :src="`${publicPath}img/abréviations-signes-usuels.jpg`" alt="Aperçu du fichier">
                </figure>
              </div>
              <div class="card-content">
                <p class="title is-5">Abréviations et signes usuels</p>
              </div>
            </a>
          </div>

          <div class="column is-one-third is-one-fifth-fullhd">
            <a :href="`${publicPath}pdf/mesures.pdf`" target="_blank" class="card">
              <div class="card-image is-hidden-mobile">
                <figure class="image is-3by2">
                  <img :src="`${publicPath}img/mesures.jpg`" alt="Aperçu du fichier">
                </figure>
              </div>
              <div class="card-content">
                <p class="title is-5">Tables des mesures</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeDocuments',

  data () {
    return {
      publicPath: process.env.BASE_URL
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  display: block;
  height: 100%;

  @media screen and (min-width: $tablet) {
    background: $grey-lighter;
  }

  @media screen and (min-width: $desktop) {
    transition: transform 0.125s;

    &:hover {
      z-index: 1;
      transform: scale(1.1);
    }
  }

  .card-image {
    filter: invert(1) sepia(0.3) opacity(0.6);
  }
}

.hero-body {
  align-items: flex-start !important;

  @media screen and (min-width: $desktop) {
    align-items: center !important;
    padding-top: 0;
  }
}
</style>
