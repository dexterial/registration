<template>
  <LoginBar />
  <Landing />
</template>

<script>
import store from '../store/index'
import LoginBar from '../components/LoginBar.vue';
import Landing from '../components/Landing.vue';

export default {
  name: 'Home',
  components: {
    LoginBar,
    Landing
  },
  mounted() {
    document.title = this.$store.state.langs["title"][this.$store.state.lang_id]
    store.commit('getUserData',this.$auth)
  }
}
</script>
