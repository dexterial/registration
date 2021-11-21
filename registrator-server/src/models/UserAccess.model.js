module.exports = mongoose => {
  const UserAccess = mongoose.model(
    "UserAccess",
    mongoose.Schema(
      {
        _id: String,
        api_allowed: Array
      },
      { timestamps: true }
    )
  )
  return UserAccess
}