import { createStore } from 'vuex'
//import langTools from '../utilities/mixins/langTools'
import langsJson from "../assets/langs.json"
//import librariesJson from "../assets/libraries.json"
import { server_url } from '../auth_config.json'

export default createStore({
  //mixins:[langTools],
  state () {
    return {
      lang_id:"en",
      langs:langsJson,
      UserData:{}
    }
  },
  mutations: {
    async setUserData (state,auth) {
      var data = await makeUser(state,auth)
      state.UserData = data
      console.log("UserData.create",data)
    },

    async getUserData (state,auth) {
      if(!auth.user.value)return{error:"user_authorization_failure"}
      const user_auth = auth.user.value
      var payload ={
        type:'auth',
        what:'UserData.getAllData',
          query:{
              id: user_auth.sub,
          }
      }
      const accessToken = await auth.getTokenSilently()
      // make new user in the database here
      const data = await callApi(payload,accessToken)
      if(data.error){
        if(data.error==="user_access_retrieve_by_id_failure"){
          
          var data2 = await makeUser(state,auth)
          state.UserData = data2.UserData
          //state.UserData = data.UserData
        }else{
          state.UserData = {}
        }
      }else{
        state.UserData = data.UserData
      }
      //console.log("retrieve",state.UserData)
      
      console.log("UserData.getAllData",state.UserData)
    },
    changeMode(state,strTo){
      state.user_mode =strTo
      switch(strTo){
          case "library":
              state.user_mode_theme ="blue"
          break
          case "editor":
              state.user_mode_theme ="lime"
          break
          case "books":
              state.user_mode_theme ="gray"
          break
      }
    },
    changeContext(state,strTo){
        state.user_context =strTo
        switch(strTo){
            case "mine":
                state.user_context_theme ="4"
            break
            case "others":
                state.user_context_theme ="2"
            break
        }
    },
    // setLibTitles(state,titles){
    //   state.libTitles =titles
    //   state.lib_preload_view="w3-show"
    // },
    langChange (state,lang_id_new,boolForce) {
      if(!localStorage.lang_id){
          if(!lang_id_new)lang_id_new="en"
          localStorage.lang_id = lang_id_new
          boolForce = true
      }else{
          if(!lang_id_new)lang_id_new=localStorage.lang_id
      }
      if(state.lang_id !== lang_id_new || boolForce){
          state.lang_id= lang_id_new
          localStorage.lang_id = lang_id_new
      }
    },
    addBooksToLibCancel(state,boolDestroy){
        state.lib_preload_view = "w3-hide"
        if(boolDestroy){
          state.preloadedBooks = {}
          state.preloadedTitles = []
        }
    }
  },
  getters: {
    

  },
  actions: {
    changeLibrarySelected({ state },indexes){
      //let preloadedTitles = state.preloadedTitles
      //console.log(state.preloadedTitles[indexes[0]].titles[indexes[1]])
      state.preloadedTitles[indexes[0]].titles[indexes[1]].selected = state.preloadedTitles[indexes[0]].titles[indexes[1]].selected==='yes'?'no':'yes'
      //state.preloadedTitles = preloadedTitles
    },
    preLoadBooks:async function({ state },payload) {
      
      let file = payload.files[0];
      if(!file || file.type !== 'application/json') return
      // Credit: https://stackoverflow.com/a/754398/52160
      let reader = new FileReader();
      reader.onload = evt => {
        let text = evt.target.result
        //console.log(libraries)
        var data =JSON.parse(text)
        state.preloadedBooks = data
        //console.log(state.preloadedBooks)
        //this.library = libraries
        const wwLibraryPreload =new Worker('webworkers/libraryPreload.js')
        wwLibraryPreload.onmessage = function(e){
          
          state.preloadedTitles = e.data
          state.lib_preload_view="w3-show"
          state.lib_preload_view_id=payload.lib_id

          //console.log(e.data)
          //commit('setLibTitles',e.data)
        }
        wwLibraryPreload.postMessage(data)
      }
      reader.onerror = evt => {
        console.log(evt)
      }
      reader.readAsText(file, "UTF-8")
      //reader.readAsText(file, "UTF-8")
    },
    addBooksToLibDo:async function({ state },auth){
      //state.lib_preload_view = "w3-hide"
      const wwLibraryPreloadGetSelected =new Worker('webworkers/libraryPreloadGetSelected.js')
      wwLibraryPreloadGetSelected.onmessage = async function(e){
        // console.log(e.data)
        // console.log(auth)
        var payload ={
          type:'auth',
          what:'AppBooks.addBooksToLib',
          query:e.data
        }
        const accessToken = await auth.getTokenSilently()
        // TODO MAKE api.js file and call it there
        const data = await callApi(payload,accessToken)
        if(data.error){
          console.error(data)
        }
        console.log(data)
      }
      const data = {
        preloadedTitles : JSON.stringify(state.preloadedTitles),
        preloadedBooks : JSON.stringify(state.preloadedBooks),
        lib_preload_view_id:JSON.stringify(state.lib_preload_view_id)
      }
      //console.log(data)
      wwLibraryPreloadGetSelected.postMessage(data)
    },
    addLib:async function({ state },auth){
      //const user_auth = auth.user.value
      var payload ={
        type:'auth',
        what:'AppLibs.addLibToUser',
          query:{
            type:"private",
            title:"Test Lib",
            icon_url:"temp_assets/lib_placeholder.svg"
          }
      }
      const accessToken = await auth.getTokenSilently()
      // TODO MAKE api.js file and call it there
      const data = await callApi(payload,accessToken)
      if(!data.error){
        state.AppLibs.push(data.AppLibs)
        state.LUsersLibs.push(data.LUsersLibs)
      }else{
        console.error(data)
      }
    },
    toogleLibExpand:async function({ state },userlib){
      //console.log(userlib)
      var act = state.LUsersLibs.find(x => x["_id"] === userlib._id)
      act.expanded = act.expanded?false:true
      var payload ={
        type:'auth',
        what:'LUsersLibs.update',
          query:{
            _id:userlib._id,
            expanded:act.expanded
          }
      }
      const accessToken = await userlib.auth.getTokenSilently()
      // TODO MAKE api.js file and call it there
      const data = await callApi(payload,accessToken)
      if(data.error){
        console.error(data)
      }
    }
  },
  modules: {
  }
})

async function callApi(payload,accessToken) {
  try {
    //console.log(payload)
    const accessHeaders={
        "Content-Type": `application/json`
    }
    if(payload["type"]==="auth"){
        
        accessHeaders["Authorization"]=`Bearer ${accessToken}`
    }
    const url=`${server_url}/api/messages/`+ payload["type"]
    const response = await fetch(
        url
        ,{
            method: "POST",
            headers: accessHeaders,
            body: JSON.stringify(payload)
        }
    )
    const json = await response.json()
    return json.response
  } catch (e) {
      return {"error":e.message}
  }
}
async function makeUser(state,auth) {
  try {
    const user_auth = auth.user.value
      var payload ={
        type:'auth',
        what:'UserData.create',
          query:{
              id: user_auth.sub,
              username: user_auth.nickname,
              name_first: user_auth.name,
              name_last: user_auth.name,
              interface_lang:  state.lang_id,
              email: user_auth.email,
              active: true,
              icon_type: "google",
              icon_url: user_auth.picture
          }
      }
      const accessToken = await auth.getTokenSilently()
      // TODO MAKE api.js file and call it there
      const data = await callApi(payload,accessToken)
      return data//
  } catch (e) {
      return {"error":e.message}
  }
}
