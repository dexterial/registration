<template>
  <!-- {{lang_id}} {{this.$store.state.lang_id}} -->
  <div class="w3-row">
    <div class="w3-col m1 l1 w3-hide-small">&nbsp;</div>
    <div class="w3-col m10 l10">
      <div class="w3-section">
        <h2>
          #Main Info Page
        </h2>
      </div>
      <div class="w3-section">
        <!-- <img class="w3-section" src='../assets/logo_linear.svg' alt='logo' style='width:100%;max-width:400px'> -->
      </div>
    </div>
   </div>
</template>

<script>

  //import userData from '../utilities/mixins/userData'
  export default {
    //mixins:[userData],

    computed: {
      //lang_id(){return this.$store.state.lang_id}
    },
    methods:{
      getLangEntry(strWhat){
        return this.$store.state.langs[strWhat][this.$store.state.lang_id]
      }
    }
  }
</script>
