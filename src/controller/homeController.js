import User from "../models/user.js";              // model Mongoose
import CRUDService from "../services/CRUDService.js"; // service đã viết lại bằng MongoDB

// Trang chủ
let getHomePage = async (req, res) => {
  try {
    let data = await User.find().lean(); // lấy toàn bộ user
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal Server Error");
  }
};

// Trang About
let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

// Hiển thị form tạo user
let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

// Xử lý tạo user
let postCRUD = async (req, res) => {
  try {
    await CRUDService.createNewUser(req.body);
    return res.redirect("/get-crud");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Error creating user");
  }
};

// Hiển thị danh sách user
let getFindAllCrud = async (req, res) => {
  try {
    let data = await CRUDService.getAllUser();
    return res.render("displayCRUD.ejs", { dataTable: data });
  } catch (e) {
    console.error(e);
    return res.status(500).send("Error fetching user list");
  }
};

// Lấy thông tin user để sửa
let getEditCRUD = async (req, res) => {
  try {
    let userId = req.query.id;
    if (!userId) return res.send("User not found!");

    let user = await CRUDService.getUserInfoById(userId);
    if (user) {
      return res.render("editCRUD.ejs", { user });
    }
    return res.send("User not found!");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Error fetching user info");
  }
};

// Cập nhật user
let putCRUD = async (req, res) => {
  try {
    await CRUDService.updateUser(req.body);
    return res.redirect("/get-crud");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Error updating user");
  }
};

// Xóa user
let deleteCRUD = async (req, res) => {
  try {
    let userId = req.query.id;
    if (userId) {
      await CRUDService.deleteUserById(userId);
      return res.redirect("/get-crud");
    }
    return res.send("User not found!");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Error deleting user");
  }
};


export default {
  getHomePage,
  getAboutPage,
  getCRUD,
  postCRUD,
  getFindAllCrud,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};