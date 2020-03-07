<template>
  <b-container>
    <b-card>
      <b-col v-if="ProductFound == false">No product was found</b-col>
      <b-col v-if="productData" cols=12>
        <b-row class="mb-5"> 
          <b-col cols="12" class="text-left">
            <h1>{{productData.title}}</h1>
          </b-col>
          <b-col cols="12" class="text-left">
            <h3>{{productData.description}}</h3>
          </b-col>
        </b-row>
        <!-- Images -->
        <b-row> 
          <b-col cols=12>
            <b-card class="font">
              <!-- <b-card-header class="font-weight-bold border-bottom-0"></b-card-header> -->
              <h4>Images</h4>
              <b-card-body class="b-0">
              <b-row>
                <b-col v-bind:key="index" v-for="(picture, index) in productData.images">
                  <b-row>
                    <b-col><img width="50" :src="imager(picture.url)"></b-col>
                  </b-row>
                </b-col>
              </b-row>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
        <!-- Attributes Names -->
        <b-row class="mt-4 mb-4"> 
          <b-col cols=12>
            <b-card>
              <!-- <b-card-header class="font-weight-bold border-bottom-0">Attributes</b-card-header> -->
              <h4>Attributes</h4>
              <b-row>
                <b-col v-bind:key="attr.id" v-for="attr in productData.attributes">
                  <b-card  class="text-left font-weight-bold border-0" :title="attr.title">
                    <b-row v-bind:key="label.id" v-for="label in attr.labels">
                      <b-form-group>
                        <b-col class="font-weight-normal">
                        <!-- <input type="radio" :name="attr.id" v-on:click="chooseAttribute($event, attr.id,label.id, attr.title)"> -->
                          <b-form-radio :name="attr.id" :value="label.id" v-on:change="chooseAttribute($event, attr.id,label.id, attr.title)">{{label.title}}</b-form-radio>
                        </b-col>
                      </b-form-group>
                    </b-row>
                  </b-card>
                  
              </b-col>
            </b-row>
            </b-card>
          </b-col>
        </b-row>
        <!-- <b-row>
          <b-col>
            <button @click="showVariant()">Show Variants</button>
          </b-col>
        </b-row> -->

        <!-- Variants -->
        <b-row v-if="variants.length == 0" class="mt-4 mb-4">
          <b-col>
            <h1>No variant found</h1>
          </b-col>
        </b-row>
        <b-row v-if="variants.length > 0" class="mt-4 mb-4"> 
          <b-col cols="12">
            <b-card title="Variants">
              <b-row>
              <b-col class="col-12 col-sm-4 mb-3" :key="index" v-for="(variant, index) in variants">
                <!-- Variant title -->
                <b-row>
                  <b-col>{{variant.title}}</b-col>
                </b-row>
                <!-- Variant Image -->
                <b-row>
                  <b-col>
                    <img height="100" :src="imager(variant.image.url)">
                  </b-col>
                </b-row>
                <b-row>
                  <b-col class="text-center">
                    <button class="bg-primary" v-on:click="addToCart(variant.id, variant.title)">Add To Cart</button>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-toast id="addtocart-toast" title="Added product to cart" static no-auto-hide>
              Added to cart
            </b-toast>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-card>

  </b-container>
</template>

<script>
import Attribute from '../bo/Attributes'
import axios from 'axios'
export default {
  name: 'ProductPage',
  data() {
    return {
      productData: null,
      variants: new Array(),
      attributesToFilter: new Array(),
      Attributes: new Array(),
      ProductFound: false
    }
    
  },
  mounted() {
    var queryString = window.location.search.substring(1).split('&')
    var productID = queryString[0].split('=')[1]

    axios.get(`https://fedtest.monolith.co.il/api/Catalog/Get?id=${productID}`).then(product => {
      this.ProductFound = true
      this.productData = product.data.data

    }).catch(error => {
      var errorData = error.response.data
      if(errorData.code == "INVALID_PRODUCT_ID"){
          this.ProductFound = false
      }
    })
  },
  methods:{
    imager(url){
      return `https://fedtest.monolith.co.il/api/imager.php?url=${url}&type=fit&width=1000&height=1000&quality=70`
    },
    chooseAttribute(event, attrId, labelId, attrTitle){
      if(this.Attributes.length == 0)
      {
        this.AddToAttributeList(attrId, labelId, attrTitle)
        return
      }

      var labelChanged = false
      // if we find the attribute we want to change, change it and stop
      this.Attributes.forEach(x => {
        console.log(attrTitle)
        if(x.AttributeTitle == attrTitle)
        {
          x.LabelID = labelId
          this.CreateVariant()
          labelChanged = true
        }
      })
      if(labelChanged)
        return

      // if it's a new attribute
      var newAttributes = this.Attributes.filter(x => x.AttributeTitle != attrTitle); 

      // if it's new attribute which isn't on the list, add it
      if(newAttributes.length > 0) 
      {
        this.AddToAttributeList(attrId, labelId, attrTitle)
      }
    },
    AddToAttributeList(attrId, labelId, attrTitle){
        var attribute = new Attribute
        attribute.AttributeID = attrId
        attribute.LabelID = labelId
        attribute.AttributeTitle = attrTitle
        this.Attributes.push(attribute)
        this.CreateVariant()
    },
    CreateVariant(){
      this.variants = new Array()
      this.productData.variants.forEach(variant => {
        var count = 0
        this.Attributes.forEach(attr => {
          if(variant.labels.some(x => x.attribute_id == attr.AttributeID && x.label_id == attr.LabelID))
            count++
        })
        if(this.Attributes.length == count)
          this.variants.push(variant);
      })
    },
    addToCart(variantId, variantTitle){
      axios.get(`https://fedtest.monolith.co.il/api/Cart/Add?variant_id=${variantId}&quantity=2`).then(data => {
        this.$bvToast.toast('Added to cart', {
          title: variantTitle,
          variant: 'primary',
          toaster: 'b-toaster-top-center'
        })
        console.log(data)
      }).catch(error => {
        this.$bvToast.toast(`Error adding ${variantTitle} to cart`, {
          title: variantTitle,
          variant: 'primary',
          toaster: 'b-toaster-top-center'
        })
        console.log(error)
      })
    }
  }
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
