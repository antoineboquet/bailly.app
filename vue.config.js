module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/variables.scss";`
        //prependData: `@import "@/styles/variables.scss";`
      }
    }
  },

  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      }
    }
  },

  pwa: {
    name: 'Bailly',
    themeColor: '#EB5E55',
    msTileColor: '#EB5E55',
    manifestOptions: {
      start_url: '/',
      background_color: '#FAF9F7'
    }
  }
}
