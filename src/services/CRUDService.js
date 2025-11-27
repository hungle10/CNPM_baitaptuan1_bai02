import bcrypt from "bcryptjs"; 
import User from "../models/user.js"; // import model mongoose

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Mã hoá mật khẩu
      let hashPassword = await hashUserPassword(data.password);

      // Tạo document trong collection "users"
      await User.create({
        email: data.email,
        password: hashPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId || null,
        positionId: data.positionId || null,
        image: data.image || null,
      });

      resolve("✅ Created a new user successfully!");
    } catch (e) {
      reject(e);
    }
  });
};


let hashUserPassword = async (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hash = bcrypt.hashSync(password, salt);
      resolve(hash);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // `.lean()` giúp trả về object JS gốc (tương tự raw: true của Sequelize)
      let users = await User.find().lean();
      // Normalize id field for views (Mongoose returns _id)
      users = users.map((u) => ({ ...u, id: u._id ? u._id.toString() : u.id }));
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm 1 user theo _id
      let user = await User.findById(userId).lean(); // .lean() = trả về object JS gốc (như raw:true)

      if (user) {
        // provide `id` alias for templates
        user.id = user._id ? user._id.toString() : user.id;
        resolve(user);
      } else {
        resolve(null); // hoặc [] nếu bạn muốn giống logic cũ
      }
    } catch (e) {
      reject(e);
    }
  });
};
let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm user theo _id
      let user = await User.findById(data.id);

      if (user) {
        // Cập nhật các trường
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phonenumber = data.phonenumber;
        user.gender = data.gender === "1" ? true : false;
        user.roleId = data.roleId;
        user.positionId = data.positionId;

        if (data.image) {
          user.image = data.image;
        }

        // Lưu thay đổi vào MongoDB
        await user.save();

        // (Tuỳ chọn) Lấy lại danh sách tất cả user sau khi update
        let allUsers = await User.find().lean();

        resolve(allUsers);
      } else {
        resolve(null); // không tìm thấy user
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm user theo _id
      let user = await User.findById(userId);

      if (user) {
        await User.deleteOne({ _id: userId }); // hoặc user.deleteOne()
      }

      resolve(); // luôn resolve, giống bản gốc
    } catch (e) {
      reject(e);
    }
  });
};


export default {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUser,
  deleteUserById,
};
