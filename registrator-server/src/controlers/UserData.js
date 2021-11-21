const db = require("../models")
// Create and Save a new UserData
exports.create = async (query) => {
  try{
    // Validate request
    if (!query.email) {
      return {
        error: "user_data_create_missing_email",
        data:[query]//`Email can not be empty!`
      }
    }

    var out = {}
    // Create a UserData // TODO MOVE THIS IN MODEL DEFAULT ENTRIES
    const UserData = new db.UserData({
      _id: query.id,
      username: query.username,
      name_first: query.name_first,
      name_last: query.name_last,
      interface_lang: query.interface_lang,
      email: query.email,
      active: true,
      icon_type: query.icon_type,
      icon_url: query.icon_url
    })

    out.UserData = await UserData.save()
    if (!out.UserData) {
      return {
        error: "user_data_create_failure",
        data:[query.id]//`Did not create UserAccess with id=¤.`
      }
    }
    // Create a UserAccess
    const UserAccess = new db.UserAccess({
      _id:query.id,
      api_allowed:["UserData.update","UserData.getAllData"]
    })
    out.UserAccess = await UserAccess.save()
    if (!out.UserAccess) {
      return {
        error: "user_access_create_failure",
        data:[query.id]//`Did not create UserAccess with id=¤.`
      }
    }
    return out
    
  }catch(err) {
    return {
      error: "user_data_create_error",
      data:[query.id,err.message]//`Error creating UserAccess with id=¤, ¤¤`
    }
  }
}

// Update a UserData by the id in the request
exports.update = async (query) => {
  try{
    if (!query) {
      return {
        error: "user_data_update_invalid_query",
        data:[query]//"Data to update can not be empty!"
      }
    }
    const id = query.id
    const data = await db.UserData.findByIdAndUpdate(id, query, { returnOriginal: false })
    if (!data) {
      return {
        error: "user_data_update_failed",
        data:[id]//`Did not update UserData with id=¤. Maybe UserData was not found!`
      }
    } else {
      return data
    }   
  }catch(err) {
    return {
      error: "user_data_update_by_id_error",
      data:[id,err.message]//`Error updating UserData with id=¤, ¤¤`
    }
  }

}

// Retrieve all UserData from the database.
exports.findByRegex = async (query) => {
  try{
    const filter = {};
    filter[Object.keys(query.filter)[0]]= new RegExp(query.filter[Object.keys(query.filter)[0]],"i")
    const data =  await db.UserData.find(filter)
    if (!data) {
      return {
        error: "user_data_retrieve_by_regex_not_found",
        data:[query.filter]//`Cannot find UserData with id=¤. Maybe UserData was not found!`
      }
    } else {
      return data
    }  

  }catch(err) {
      return {
        error: "user_data_retrieve_by_regex_error",
        data:[query.filter,err.message]//`Some error occurred while retrieving UserData. query.filter=¤, ¤¤`
      }
  }
}

/// Find a single UserData with an id
exports.findById = async (query) => {
  try{  
    const id = query.id;
    const data = await db.UserData.findById(id)
    if (!data) {
      return {
        error: "user_data_retrieve_by_id_failure",
        data:[id]//`Cannot find UserData with id=¤.`
      }
    } else {
      return data
    }  
  }catch(err) {
    return {
      error: "user_data_retrieve_by_id_error",
      data:[id,err.message]//`Error retrieving UserData with id=¤, ¤¤`
    }
  }
};

// Delete a UserData with the specified id in the request
exports.deleteById = async (query) => {
  try{
    const id = query.id
    const data = await db.UserData.findByIdAndRemove(id)
    if (!data) {
      return {
        error: "user_data_delete_not_found",
        data:[id]//`Cannot delete UserData with id=¤. Maybe UserData was not found!`
      }
    } else { 
      return data
    }
  }catch(err) {
    return {
      error: "user_data_delete_error",
      data:[id,err.message]//`Could not delete UserData with id=¤, ¤¤`
    }
  }
}

// Find a single UserData with an id
exports.getAllData = async (query) => {
  try{  
    const user_id = query.id
    const out={}
    const data = await db.UserData.findById(user_id)
    
    if (!data) {
      return {
        error: "user_data_retrieve_by_id_failure",
        data:[id]//`Cannot find UserData with id=¤.`
      }
    } else {
      out["UserData"]=data
    }  

    // out["LUsersBookmarks"] = await db.LUsersBookmarks.find({user_id:user_id})
    // out["AppBookmarks"]=[]
    // for (i in out["LUsersBookmarks"]) {
    //   const element = out["LUsersBookmarks"][i]
    //   const data = await db.AppBookmarks.findById(element.bookmark_id)
    //   out["AppBookmarks"].push(data)
    // }

    // out["LUsersEdits"] = await db.LUsersEdits.find({user_id:user_id})
    // out["AppEdits"]=[]
    // for (i in out["LUsersEdits"]) {
    //   const element = out["LUsersEdits"][i]
    //   const data = await db.AppEdits.findById(element.edit_id)
    //   out["AppEdits"].push(data)
    // }
    
    // out["LUsersLibs"] = await db.LUsersLibs.find({user_id:user_id})
    // out["AppLibs"]=[]

    // out["LLibsBooks"]=[]
    // for (i in out["LUsersLibs"]) {
    //   const lib = out["LUsersLibs"][i]
    //   const data = await db.AppLibs.findById(lib.lib_id)
    //   out["AppLibs"].push(data)
    //   const data2 = await db.LLibsBooks.find({lib_id:lib.lib_id})
    //   data2.forEach(element =>{
    //     out["LLibsBooks"].push(element)
    //   })
    // }
    // // add unique books
    // out["AppBooks"]=[]
    // out["LBooksLines"]=[]
    // out["AppLines"]=[]

    // for (i in out["LLibsBooks"]) {
    //   const book = out["LLibsBooks"][i]
    //   const dataExists = out["AppBooks"].find(element => element._id.toString() === book.book_id)
    //   //console.log("search for",book.book_id,dataExists,out["AppBooks"])
    //   if(!dataExists){
    //     const bookData = await db.AppBooks.findById(book.book_id)
    //     out["AppBooks"].push(bookData)
    //     // add LBookLines and all other lines
    //     const bookLBooksLines= await db.LBooksLines.find({book_hash:bookData.book_hash})
    //     //console.log(bookData.book_hash,bookLBooksLines)
    //     for (j in bookLBooksLines) {
    //       var bookLine= bookLBooksLines[j]
    //       //console.log(bookLine)
    //       if(!out["LBooksLines"].find(element => element._id.toString() === bookLine._id.toString())){
    //         out["LBooksLines"].push(bookLine)
    //         //finally add lang lines
    //         if(!out["AppLines"].find(element => element._id.toString() === bookLine.l_id)){
    //           const appLine = await db.AppLines.findById(bookLine.l_id)
    //           out["AppLines"].push(appLine)
    //         }
    //       }
    //     }
    //   }
    // }
    //out["LUsersSearches"] = await db.LUsersSearches.findByKeys({user_id:user_id})
    return out
  }catch(err) {
    return {
      error: "user_data_retrieve_full_error",
      data:[id,err.message]//`Could not delete UserData with id=¤, ¤¤`
    }
  }
}

// Delete a UserData with the specified id in the request
exports.deleteById = async (query) => {
  try{
    const id = query.id
    const data = await db.UserData.findByIdAndRemove(id)
    if (!data) {
      return {
        error: "user_data_delete_not_found",
        data:[id]//`Cannot delete UserData with id=¤. Maybe UserAccess was not found!`
      }
    } else {
      return data
    }
  }catch(err) {
    return {
      error: "user_data_delete_error",
      data:[id,err.message]//`Could not delete UserData with id=¤, ¤¤`
    }
  }
}

// Delete all Users from the database.
// exports.deleteAll = (req, res) => {
//   UserData.deleteMany({})
//     .then(data => {
//       res.send({
//         message: `${data.deletedCount} Users were deleted successfully!`
//       });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all Users."
//       });
//     });
// };

// Find all published Users
// exports.findAllPublished = (req, res) => {
//   UserData.find({ active: true })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Users."
//       });
//     });
// };