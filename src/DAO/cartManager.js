import fs from "fs"

export default class cartManager {
  constructor(filePath) {
    this.carts = [];
    this.path = filePath;
  }

  async getCarts() {
    try {
      const fileData = await fs.promises.readFile(this.path, 'utf-8');
      const carts = JSON.parse(fileData);
      return carts;
    } catch (err) {
      console.error('Error al leer los carritos existentes en el archivo:', err);
      return [];
    }
  }

  async getCartById(cid) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id.toString() === cid.toString());
      return cart;
    } catch (err) {
      console.error('Error al obtener el carrito por ID:', err);
      return null;
    }
  }

  async addCart() {
    let existingCarts = [];
    try {
      const fileData = await fs.promises.readFile(this.path, 'utf-8');
      existingCarts = JSON.parse(fileData);
    } catch (err) {
      console.error('Error al leer los carritos existentes del archivo:', err);
    }

    let lastId = 0;

    //Manejo de ID de carritos
    if (existingCarts.length > 0) {
      lastId = existingCarts[existingCarts.length - 1].id;
    }

    const newCart = {
      id: lastId + 1,
      products: [] // Inicializo products como un arreglo vacío
    };

    existingCarts.push(newCart);

    try {
      await fs.promises.writeFile(this.path, JSON.stringify(existingCarts));
      console.log('Carrito agregado exitosamente');
    } catch (err) {
      console.error('Error al escribir los carritos en el archivo:', err);
    }

    return newCart;
  }


  //Escritura del archivo
  async saveCarts(carts) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      console.log('Carritos guardados exitosamente');
    } catch (err) {
      console.error('Error al escribir los carritos en el archivo:', err);
    }
  }

  //Agregar productos a carrito recibiendo el cid y el pid /api/carts/:cid/products/:pid
  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id.toString() === cid.toString());

      //Existencia de carrito
      if (cartIndex === -1) {
        throw new Error('Carrito no encontrado');
      }

      const cart = carts[cartIndex];

      if (!Array.isArray(cart.products)) {
        cart.products = [];
      }

      const productIndex = cart.products.findIndex((product) => product.id.toString() === pid.toString());

      // Veo si el producto existe, si no existe lo creo
      if (productIndex === -1) {
        const newProduct = { id: pid, quantity: 1 };
        cart.products.push(newProduct);
      } else {
        // Si el producto existe, solo aumento quantity
        const product = cart.products[productIndex];
        product.quantity = product.quantity + 1;
      }

      carts[cartIndex] = cart;
      await this.saveCarts(carts);

      return cart;
    } catch (err) {
      console.error('Error al agregar producto al carrito:', err);
      throw err;
    }
  }

}


