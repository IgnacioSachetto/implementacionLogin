import express from "express";
import { cartService } from '../services/carts.service.js';

export const routerCarts = express.Router();

routerCarts.get('/', async (req, res) => {
  try {
    const carts = await cartService.getAllCarts();
    const limit = req.query.limit || -1;
    if (limit == -1 && carts.length > 0) {
      return res.status(200).json({
        status: "success",
        msg: "Found all carts",
        data: carts,
      });
    } else if (limit != -1 && carts.length > 0) {
      return res.status(200).json({
        status: "success",
        msg: "Found " + limit + " carts",
        data: carts.slice(0, limit),
      });
    } else {
      return res.status(404).json({
        status: "Error",
        msg: "Carts not found",
        data: carts.slice(0, limit),
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerCarts.get('/:id', async (req, res) => {
  try {
    const cart = await cartService.getCart(req.params.id);
    if (cart) {
      return res.status(200).json({
        status: "success",
        msg: "Cart found",
        data: cart,
      });
    } else {
      return res.status(404).json({
        status: "Error",
        msg: "Cart with id " + req.params.id + " not found",
        data: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerCarts.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await cartService.updateCart(cid, products);
    return res.status(200).json({
      status: 'success',
      msg: 'product in cart updated',
      data: cart,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerCarts.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateCantProd(cid, pid, quantity);
    if (Object.keys(cart).length !== 0) {
      return res.status(200).json({
        status: 'success',
        msg: 'product quantity updated',
        data: cart,
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        msg: 'bad cart id or product id',
        data: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerCarts.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.deleteProductInCart(cid, pid);
    return res.status(200).json({
      status: 'success',
      msg: 'product deleted in cart',
      data: cart,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerCarts.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = [];
    const cart = await cartService.updateCart(cid, products);
    return res.status(200).json({
      status: 'success',
      msg: 'products deleted in cart',
      data: cart,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerCarts.post("/", async (req, res) => {
  try {
    const cartCreated = await cartService.createCart();
    return res.status(201).json({
      status: 'success',
      msg: 'cart created',
      data: cartCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerCarts.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cartUpdated = await cartService.addProductToCart(cid, pid);
    if (Object.keys(cartUpdated).length !== 0) {
      return res.status(200).json({
        status: "success",
        msg: "Product added",
        data: cartUpdated,
      });
    } else {
      return res.status(404).json({
        status: "Error",
        msg: "Error adding product: " + pid + " to cart: " + cid,
        data: { cartUpdated },
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});
