module.exports = mongoose => {
  const UserData = mongoose.model(
    "UserData",
    mongoose.Schema(
      {
        _id: String,
        username: String,
        name_first: String,
        name_last: String,
        interface_lang: String,
        email: String,
        active: Boolean,
        icon_type: String,
        icon_url: String
      },
      { timestamps: true }
    )
  )
  return UserData
}