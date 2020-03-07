<template>
  <div id="app">
    <Header msg="Welcome to Your Vue.js App"/>
    <ProductPage/>
    <Footer/>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import ProductPage from './components/ProductPage.vue'


export default {
  name: 'App',
  components: {
    Header,
    Footer,
    ProductPage
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background:#e6f500
}
</style>
