import express from "express";
import {getAllProducts , createProducts , getProduct ,updateProduct , deleteProduct} from "../controller/productController.js";

const router = express.Router();
router.get("/" , getAllProducts);
router.get("/:id" , getProduct);
router.post("/" , createProducts);
router.put("/:id" , updateProduct);
router.delete("/:id" , deleteProduct);
export default router;

