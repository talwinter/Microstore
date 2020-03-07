<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <b-card>
            <b-col>
              <img src="../assets/logo.png">
            </b-col>
            <b-col class="mt-3">
              <h1>E-Commerce Micro Storefront</h1>
            </b-col>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
  
</template>

<script>
export default {
  name: 'Header',
  // props: {
  //   msg: String
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
