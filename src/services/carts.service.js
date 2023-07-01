import { CartsModel } from '../DAO/models/carts.model.js';
import { ProductsModel } from '../DAO/models/products.model.js';

class CartService {
  validateId(id) {
    if (!id) {
      console.log('validation error: please provide an ID.');
      throw 'VALIDATION ERROR';
    }
  }

  validateProductId(pid) {
    if (!pid) {
      console.log('validation error: please provide a product ID.');
      throw 'VALIDATION ERROR';
    }
  }

  async validateProductInCart(cid, pid) {
    this.validateId(cid);
    this.validateProductId(pid);
    const cart = await this.getCart(cid);
    if (!cart.products.find(p => p.id.toString() === pid.toString())) {
      console.log('Validation error: Product ID is not valid');
      throw 'VALIDATION ERROR';
    }
  }

  async getAllCarts() {
    const carts = await CartsModel.find({});
    return carts;
  }

  async getCart(id) {
    this.validateId(id);
    const cart = await CartsModel.findOne({ _id: id }).populate({
      path: 'products',
      populate: {
        path: 'id',
        model: ProductsModel,
      },
    });
    return cart;
  }

  async createCart() {
    const cart = await CartsModel.create({ products: [] });
    return cart;
  }

  async updateCart(id, products) {
    this.validateId(id);
    const cart = await CartsModel.findByIdAndUpdate(id, { products }, { new: true });
    return cart;
  }

  async updateCantProd(cid, pid, quantity) {
    this.validateProductInCart(cid, pid);
    const cart = await this.getCart(cid);
    const productIndex = cart.products.findIndex(prod => prod.id.toString() === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
      await cart.save();
    }
    return cart;
  }

  async deleteCart(id) {
    this.validateId(id);
    const deleted = await CartsModel.deleteOne({ _id: id });
    return deleted;
  }

  async addProductToCart(cid, pid) {
    this.validateId(cid);
    this.validateProductId(pid);
    const cart = await this.getCart(cid);
    const existingProduct = cart.products.find(p => p.id.toString() === pid.toString());
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      const product = await ProductsModel.findById(pid);
      if (!product) {
        console.log('Product not found');
        throw 'VALIDATION ERROR';
      }
      const newProduct = {
        id: product._id.toString(),
        quantity: 1,
      };
      cart.products.push(newProduct);
    }

    await cart.save();

    return cart;
  }

  async deleteProductInCart(cid, pid) {
    this.validateProductInCart(cid, pid);
    const cart = await this.getCart(cid);
    const newProducts = cart.products.filter(p => p.id.toString() !== pid);
    await this.updateCart(cid, newProducts);
    return cart;
  }
}

export const cartService = new CartService();
