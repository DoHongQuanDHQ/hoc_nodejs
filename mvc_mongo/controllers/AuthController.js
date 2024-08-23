const User = require("../models/User");

exports.register = async (req, res) => {
  //Lấy thông tin mới người dùng gửi lên
  const { email, username, password } = req.body;

  const existedEmail = await User.findOne({ email });
  const existedUsername = await User.findOne({ username });
  if (existedEmail || existedUsername) {
    return res.status(400).json({
      success: false,
      message: "Email hoặc username đã tồn tại",
    });
  }
  // mã hóa pass
  var hashedPassword = await bcrypt.hash(password, 10);
  //Tạo user
  const user = new User({
    email,
    username,
    password: hashedPassword,
  });
  //Lưu thông tin tài khoản trên db
};
