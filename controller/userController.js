const userModel = require("../models/userModel");

//only by admin
module.exports.getAllUsers = async function getAllUsers(req, res) {
  try {
    let allUsers = await userModel.find();
    if (allUsers) {
      return res.json({
        message: "List of all Users from dB",
        data: allUsers,
      });
    } else {
      return res.json({
        message: "Empty dB",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

// by user
module.exports.getUser = async function getUser(req, res) {
  let id = req.id;
  let user = await userModel.findById(id);
  if (user) {
    return res.json(user);
  } else {
    return res.json({
      message: "user not found",
    });
  }
};

module.exports.updateUser = async function updateUser(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findById(id);
    if (user) {
      let newData = req.body;
      for (let key in newData) {
        user[key] = newData[key].toString();
      }
      const updatedData = await user.save({ validateBeforeSave: false }); //save document

      return res.json({
        message: "user info updated",
      });
    } else {
      return res.json({
        message: "user not found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.deleteUser = async function deleteUser(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findByIdAndDelete(id);
    if (user) {
      return res.json({
        message: "user successfully removed",
        data: user,
      });
    } else {
      return res.json({
        message: "user not found",
        data: user,
      });
    }
  } catch (error) {
    res.json({
      message: err.message,
    });
  }
};

// module.exports.postUser = async function postUser(req,res){
//     let user = await userModel.create(req.body);
//     res.json({
//         Message: "Data is received",
//         data: user
//     })
// }

module.exports.updateProfileImage = function updateProfileImage(req, res) {
  res.json({
    message: "File uploaded successfully",
  });
};
