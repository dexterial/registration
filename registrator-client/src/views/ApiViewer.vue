<template>
    <LoginBar />
    <div>
        <div class="w3-content">
            <h2 class="w3-left-align">#API playground</h2>
            <div class="w3-row w3-theme-gray-d2">
                <div class=" w3-left w3-container w3-padding">
                    #API Calls Samples
                </div>
                <span v-for="(sample,index) in samples" :key="index" class="w3-button w3-tiny w3-left w3-margin-left" :class="sample.type==='public'?'w3-blue':'w3-green'" @click="clearPayload(index)">
                    {{sample.what}}
                </span>
                

                <button class="w3-btn w3-pale-red w3-right" @click="clearPayload">
                    #clear
                </button>
            </div>

            <textarea class="w3-input w3-border" style="resize:none" rows=10 v-model="apiPayload"></textarea>
           
            <div class="w3-row w3-theme-gray-d4">
                <div class=" w3-left w3-container w3-padding">
                    #API Calls Results
                </div>
                <button class="w3-btn w3-blue w3-left" @click="callApiEndpoint()">
                    #Make Api Call
                </button>
                <button class="w3-btn w3-pale-red w3-right" @click="clearLog">
                    #clear
                </button>
            </div>
            <div v-for="log in logs.slice().reverse()" :key="log.timestamp" >
                <div class="w3-row w3-block w3-left-align" :class="log['style']">
                    <span class="w3-margin-left w3-small">{{log["timestamp"].toISOString()}}</span>
                    
                    <span class="w3-margin-left" >{{log["text"]}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { server_url } from '../auth_config.json'
    import samples from '../assets/api_samples.json'
    import LoginBar from '../components/LoginBar.vue'
    import store from '../store/index'
    export default {
        name: 'ApiViewer',
        components: {
            LoginBar
        },
        data() {
            return {
                logs:[{
                    type:"line-blue",
                    text:"sample line-blue",
                    style:"w3-pale-blue",
                    timestamp:new Date()
                    },{
                    type:"header-red",
                    text:"sample header-red",
                    style:"w3-pale-red w3-border-top",
                    timestamp:new Date()
                    },{
                    type:"header-green",
                    text:"sample header-green",
                    style:"w3-pale-green w3-border-top",
                    timestamp:new Date()
                    },{
                    type:"error",
                    text:"sample error",
                    style:"w3-red",
                    timestamp:new Date()
                    }],
                apiResponse: null,
                apiQuerySent: null,
                apiPayload :JSON.stringify({test:'blabla'}),
                apiQueryReceived: null,
                samples: samples
            }
        },
        methods: {
            clearPayload(type){
                this.apiPayload =JSON.stringify(samples[type])
            },
            clearLog(){
                this.logs =[] 
            },
            logMe(msg,type,clear){
                if(clear)this.logs=[]
                var style
                switch(type){
                    case "header-red":
                        style = "w3-pale-red w3-border-top"
                        break;
                    case "header-blue":
                        style = "w3-theme-blue-d2 w3-border-top"
                        break;
                    case "header-green":
                        style = "w3-theme-lime-d2 w3-border-top"
                        break;
                    case "line-blue":
                        style = "w3-theme-blue-l3"
                        break;
                    case "line-green":
                        style = "w3-theme-lime-l3"
                        break;
                    case "error":
                        style = "w3-red"
                        break;
                    default:
                        style = "w3-light-grey"
                }
                this.logs.push(
                    {
                        type:type,
                        style:style,
                        text:JSON.stringify(msg, null, 2),
                        timestamp:new Date()
                    }
                )
            },
            callApiEndpoint() {
                var apiPayload = JSON.parse(this.apiPayload)
                this.callApi(apiPayload)
            },
            async callApi(payload) {
                try {
                    
                    this.apiQuerySent = payload
                    
                    const accessHeaders={
                        "Content-Type": `application/json`
                    }
                    let style1="header-blue"
                    let style2="line-blue"
                    if(payload["type"]==="auth"){
                        const accessToken = await this.$auth.getTokenSilently()
                        accessHeaders["Authorization"]=`Bearer ${accessToken}`
                        style1="header-green"
                        style2="line-green"
                    }
                    this.logMe(this.apiQuerySent,style1)
                    const url=`${server_url}/api/messages/`+ payload["type"]
                    //console.log(payload)
                    const response = await fetch(
                        url
                        ,{
                            method: "POST",
                            headers: accessHeaders,
                            body: JSON.stringify(payload)
                        }
                    )
                    
                    const json = await response.json()
                    
                    this.apiResponse = json.response
                    this.logMe(this.apiResponse,json.response.error?"error":style2)
                    this.apiQueryReceived = json.query
                    //this.logMe(this.apiQueryReceived,style1)
                    
                } catch (e) {
                    this.logMe(e.message,"error")
                }
            }
        },
        mounted() {
            document.title = this.$store.state.langs["title"][this.$store.state.lang_id]
            
            store.commit('getUserData',this.$auth)
        }
    }
</script>