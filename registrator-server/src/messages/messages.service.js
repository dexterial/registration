/**
 * Service Methods
 */
//import langsJson from "../fixed_assets/langs.json"
const UserData = require("../controlers/UserData")
const UserAccess = require("../controlers/UserAccess")
//const UserAccess = require("../controlers/")

const getPublicMessage = async (req) => {
  var out={query:req.body.query}
  //console.log(req.body)
  switch(req.body.what){
    case "interface.getLang":
      const fs = require('fs')
      const langLoc = global.appRoot+"/fixed_assets/langs.json";
      try {
        out["response"] = JSON.parse(fs.readFileSync(langLoc, 'utf8'))
      } catch (err) {
        out["response"] = {error:err.message}
      }
    break;
    default:
      out["response"] = {error:"Missing or invalid what:<<"+req.body.what+">> parameter in your type:<<"+req.body.type+">> query"}
    }
  return out
};

const getProtectedMessage = async (req) =>  { 
  var out={query:req.body.query}
  // check first rule
  if(!req.body.what||!req.body.type||!req.body.query){
    out["response"] = {error:"api_bad_call",data:[]}//error:"Bad call",
    return out
  }
  // check api authorizations for all actions except create user, i guess that one needs to be set first
  if(req.body.what!=="UserData.create"){
    // look for authorization
    var myroles = await UserAccess.findById({id:req.user.sub})
    if(myroles["error"]){
      out["response"] = myroles
      return out
    }

    //user_access_retrieve_by_id_failure

    if(myroles.api_allowed.indexOf(req.body.what)===-1){
      out["response"] = {error:"api_no_permission",data:[req.body.what]}//error:"UserData does not have permission to call this API point:<<<¤>>>",
      return out
    }
  }
  const query = req.body.query
  query.user_id = req.user.sub

  switch(req.body.what){
    case "UserAccess.create":
      out["response"] = await UserAccess.create(query)
    break
    case "UserAccess.update":
      out["response"] = await UserAccess.update(query)
    break
    case "UserAccess.findById":
      out["response"] = await UserAccess.findById(query)
    break
    case "UserAccess.findByRegex":
      out["response"] = await UserAccess.findByRegex(query)
    break
    
    case "UserData.getAllData":
      out["response"] = await UserData.getAllData(query)
    break
    case "UserData.create":
      out["response"] = await UserData.create(query)
    break
    case "UserData.update":
      out["response"] = await UserData.update(query)
    break
    case "UserData.findById":
      out["response"] = await UserData.findById(query)
    break
    case "UserData.findByRegex":
      out["response"] = await UserData.findByRegex(query)
    break
    case "UserData.deleteById":
      out["response"] = await UserData.deleteById(query)
    break
    default:
      out["response"] = {error:"Missing or invalid what:<<"+req.body.what+">> parameter in your type:<<"+req.body.type+">> query"}
    }
  return out
};

module.exports = {
  getPublicMessage,
  getProtectedMessage,
};
