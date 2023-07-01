import express from "express";
import {productService} from "../services/products.service.js";

export const routerVistaProductos = express.Router();
routerVistaProductos.get("/", async (req, res) => {
  return res.render("home", {
    titulo: "Productos",
    productos: await productService.getAllProducts(),
  });

});