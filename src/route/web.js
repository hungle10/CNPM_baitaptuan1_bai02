import express from "express";
import homeController from "../controller/homeController.js"; // thêm .js vào cuối

const router = express.Router();

const initWebRoutes = (app) => {
  // Cách 1:
  router.get("/", (req, res) => {
    return res.send("Le Thai Hung");
  });

  // Cách 2: gọi hàm trong controller
  router.get("/home", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.getFindAllCrud);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  return app.use("/", router);
};

export default initWebRoutes; 