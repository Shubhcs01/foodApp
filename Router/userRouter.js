const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  updateProfileImage
} = require("../controller/userController");
const {
  getSignUp,
  postSignup,
  postLogin,
  isAuthorised,
  protectRoute,
  forgetPassword,
  resetPassword,
  getLogout,
} = require("../controller/authController");

const userRouter = express.Router();

// user's options
userRouter.route("/:id").patch(updateUser).delete(deleteUser);

//user authentication page
userRouter.route("/signup").get(getSignUp).post(postSignup);

userRouter.route("/login").post(postLogin);

userRouter.route("/logout").get(getLogout);

//Forget Password
userRouter.route("/forgetPassword").post(forgetPassword);

//Reset Password
userRouter.route("/resetPassword/:token").post(resetPassword);

// Multer for fileupload
//upload variable -> storage, filter
//(Refer Documentation of multer npm)

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(`${__dirname}/../public/images`))
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null,`user-${Date.now()}.jpEg`);
  },
});

const fileFilter = function (req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  if (file.mimetype.startsWith("image")) {
    // To accept the file pass `true`, like so:
    cb(null, true);
  } else {
    // You can always pass an error if something goes wrong:
    cb(new Error("Not an Image! Please upload an image"));
  }
//   // To reject this file pass `false`, like so:
//   cb(null, false);
};

//upload variable
const upload = multer({
  storage: multerStorage,
  filter: fileFilter,
});

userRouter.route('/ProfileImage')
.post(upload.single('avatar'),updateProfileImage)
.get((req,res)=>{
    res.sendFile("multer.html", { root: path.join(__dirname, "../public") });
})

// --> After Login <--

//profile page
userRouter.use(protectRoute)
userRouter.route("/userProfile")
.get(getUser);

//admin specific function
userRouter
  .use(isAuthorised(["admin"]))
  .route("/")
  .get(getAllUsers);

module.exports = userRouter;
