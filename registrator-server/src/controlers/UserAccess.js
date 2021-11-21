const db = require("../models")
// Create and Save a new UserAccess
exports.create = async (query) => {
  try{
    // Create a UserAccess
    const id = query.id
    const UserAccess = new db.UserAccess({
      _id: id,
      api_allowed: query.api_allowed
    })
    // Save UserAccess in the database
    const data = await UserAccess.save()
    if (!data) {
      return {
        error: "user_access_create_failure",
        data:[id]//`Cannot delete UserAccess with id=¤. Maybe UserAccess was not found!`
      }
    } else {
      return data
    }  

  }catch(err) {
    return {
      error: "user_access_create_error",
      data:[query.id,err.message]//`Error creating UserAccess with id=¤, ¤¤`
    }
  }
}

// Update a UserAccess by the id in the request
exports.update = async (query) => {
  try{
    if (!query) {
      return {
        error: "user_access_update_invalid_query",
        data:[query]//"Data to update can not be empty!"
      }
    }
    const id = query.id
    const data = await db.UserAccess.findByIdAndUpdate(id, query, { returnOriginal: false })
    if (!data) {
      return {
        error: "user_access_update_not_found",
        data:[id]//`Did not update UserAccess with id=¤. Maybe UserAccess was not found!`
      }
    } else {
      return data
    }  
  }catch(err) {
      return {
        error: "user_access_update_by_id_error",
        data:[id,err.message]//`Error updating UserAccess with id=¤, ¤¤`
      }
  }

}

// Retrieve all Users from the database.
exports.findByRegex = async (query) => {
  try{
    const filter = {};
    filter[Object.keys(query.filter)[0]]= new RegExp(query.filter[Object.keys(query.filter)[0]],"i")
    const data =  await db.UserAccess.find(filter)
    if (!data) {
      return {
        error: "user_access_retrieve_by_regex_not_found",
        data:[query.filter]//`Cannot find UserAccess with id=¤. Maybe UserAccess was not found!`
      }
    } else {
      return data
    }  

  }catch(err) {
      return {
        error: "user_access_retrieve_by_regex_error",
        data:[query.filter,err.message]//`Some error occurred while retrieving UserAccesses. query.filter=¤, ¤¤`
      }
  }
}

// Find a single UserAccess with an id
exports.findById = async (query) => {
  try{  
    const id = query.id;
    const data = await db.UserAccess.findById(id)
    if (!data) {
      return {
        error: "user_access_retrieve_by_id_failure",
        data:[id]//`Cannot find UserAccess with id=¤.`
      }
    } else {
      return data
    }  
  }catch(err) {
    return {
      error: "user_access_retrieve_by_id_error",
      data:[id,err.message]//`Error retrieving UserAccess with id=¤, ¤¤`
    }
  }
};

// Delete a UserAccess with the specified id in the request
exports.deleteById = async (query) => {
  try{
    const id = query.id
    const data = await db.UserAccess.findByIdAndRemove(id)
    if (!data) {
      return {
        error: "user_access_delete_not_found",
        data:[id]//`Cannot delete UserAccess with id=¤. Maybe UserAccess was not found!`
      }
    } else {
      return data
    }
  }catch(err) {
    return {
      error: "user_access_delete_error",
      data:[id,err.message]//`Could not delete UserAccess with id=¤, ¤¤`
    }
  }
}

// Delete all Users from the database.
// exports.deleteAll = (req, res) => {
//   UserAccess.deleteMany({})
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
//   UserAccess.find({ active: true })
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