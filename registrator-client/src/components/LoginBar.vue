<template>
  <div class="w3-row">
    <div class="w3-col m1 l1 w3-hide-small">&nbsp;</div>
    <div class="w3-col m10 l10">
      <!-- LOGO -->
      <div class="w3-left w3-button w3-hover-lime">
        <img id="logo" class="w3-image w3-left" alt="Librisium logo" src="./../assets/logo_linear.svg" />
      </div>
      <!-- LANG SELECTOR -->
      <div class="w3-right">
        <button class="w3-button w3-hover-lime" @click='langToggle(true)' :title="getLangEntry('lang_name')">
          <i class="material-icons btn1" style="font-size:1.5em">language</i>
        </button>
        <div id="lang_selector" class="w3-modal w3-bar-block" tabindex="0" v-on:keyup.esc='langToggle(false)'>
          <div class="w3-modal-content w3-card-4">
            <div class="w3-row">
              <h3 class="w3-left w3-margin-left">{{getLangEntry('lang_header')}}</h3>
              <button class="w3-button w3-right btn2" @click='langToggle(false)'>
                <i class="material-icons" style="font-size:1.5em">highlight_off</i>
              </button>
            </div>
            <div class="w3-bar-item" v-for="(val,index) in this.$store.state.langs['lang_name']" v-bind:key="index"   >
              <button v-if="index!==this.$store.state.lang_id" :id="'lang_'+index" class="w3-button" @click='langChange(index,false)'> {{val}} </button>
              <button v-if="index===this.$store.state.lang_id" :id="'lang_'+index" class="w3-button w3-lime" @click='langChange(index,false)'> {{val}} </button>
            </div>
          </div>
        </div >
      </div >
      <!-- LOGIN STATS -->
      <div class="w3-right">
        <div v-if="!$auth.loading.value">
          <div v-if="!$auth.isAuthenticated.value">
            
            <button class="w3-button w3-hover-lime" @click='login' :title="getLangEntry('login')">
              <i class="material-icons btn1" style="font-size:1.5em">login</i>
            </button>
          </div>
        </div>
      </div>
      <div class="w3-right">
        <div v-if="!$auth.loading.value">
          <div v-if="$auth.isAuthenticated.value">
            <div class=" w3-tiny w3-left" >
              <div class="w3-left-align w3-margin-left">
                <p>{{getLangEntry('user_signed_in')}}<br>
                <span  class="w3-text-light-blue" >{{this.$store.state.UserData.email}}</span>
                </p>
              </div>
            </div>
            <button class="w3-button w3-hover-lime"  @click='userPrefsToggle(true)' :title="getLangEntry('user_prefs_button')">
              <i class="material-icons btn1" style="font-size:1.5em">manage_accounts</i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="w3-right">
        <div id="user_prefs_selector" class="w3-modal w3-bar-block" tabindex="1" v-on:keyup.esc='userPrefsToggle(false)'>
          <div class="w3-modal-content w3-card-4">
            <div class="w3-row">
              <h3 class="w3-left w3-margin-left">{{getLangEntry('user_prefs_header')}}</h3>
              <button class="w3-button w3-right btn2" @click='userPrefsToggle(false)'>
                <i class="material-icons" style="font-size:1.5em">highlight_off</i>
              </button>
            </div>
            <div class="w3-row" >
              <button class="w3-left w3-margin w3-button w3-red w3-left" @click='logout' :title="getLangEntry('logout')">
                <div class="w3-large w3-left">{{getLangEntry('logout')}}</div>
                <i class="material-icons material-offset" style="font-size:1.5em">logout</i>
              </button>
            </div>
          </div>
        </div >
      </div>
    </div>
   </div>
</template>

<script>
  import store from '../store/index'
  export default {
    methods:{
      
      userPrefsToggle(boolShow){
        if(boolShow){
            document.getElementById('user_prefs_selector').style.display='block';
            document.getElementById('user_prefs_selector').focus();
        }else{
            document.getElementById('user_prefs_selector').style.display='none';
        }
      },
      langChange(lang_id,boolBorce) {
        store.commit('langChange',lang_id,boolBorce)
        document.title = this.$store.state.langs["title"][this.$store.state.lang_id]
        document.getElementById('lang_selector').style.display='none'
      },
      langToggle(boolShow){
        if(boolShow){
            document.getElementById('lang_selector').style.display='block'
            document.getElementById('lang_selector').focus();
        }else{
            document.getElementById('lang_selector').style.display='none'
        }
      },
      getLangEntry(strWhat){
        return this.$store.state.langs[strWhat][this.$store.state.lang_id]
      },
      login() {
        this.$auth.loginWithRedirect()
      },
      // Log the user out
      logout() {
        this.$auth.logout({
          returnTo: window.location.origin
        });
      }
    },
    mounted() {
      //console.log(this.$auth.user.value)
    }
  }
</script>
