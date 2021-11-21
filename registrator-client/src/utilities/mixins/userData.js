export default {
    data(){
        return{
            user:this.$auth.user.value
        }
    },
    methods:{
        getUserData(){
            //this.user = this.$auth.user.value
            this.user.user_context ="others"
            this.user.user_context_theme ="4"
            this.user.user_mode ="editor"
            this.user.user_mode_theme ="lime"

            //console.log(this.user)
        },
        userPrefsToggle(boolShow){
            if(boolShow){
                document.getElementById('user_prefs_selector').style.display='block';
                document.getElementById('user_prefs_selector').focus();
            }else{
                document.getElementById('user_prefs_selector').style.display='none';
            }
        },
        changeMode(strTo){
            this.user.user_mode =strTo
            switch(strTo){
                case "workspace":
                    this.user.user_mode_theme ="blue"
                break
                case "editor":
                    this.user.user_mode_theme ="lime"
                break
                case "books":
                    this.user.user_mode_theme ="gray"
                break
            }
        },
        changeContext(strTo){
            this.user.user_context =strTo
            switch(strTo){
                case "mine":
                    this.user.user_context_theme ="4"
                break
                case "others":
                    this.user.user_context_theme ="2"
                break
            }
        }
    }
}