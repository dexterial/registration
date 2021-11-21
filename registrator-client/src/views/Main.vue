<template>
  <LoginBar />
</template>

<script>
  import store from '../store/index'
  import LoginBar from '../components/LoginBar.vue'

  export default {
    name: 'Main',
    components: {
      LoginBar
    },
    mounted() {
      document.title = this.$store.state.langs["title"][this.$store.state.lang_id]
      store.commit('getUserData',this.$auth)
    }
  }
</script>