import fs from 'fs';

export default class ProductManager {
  constructor(filePath = './src/productos.json') {
    this.path = filePath;
    this.products = this.loadProducts();
  }

  loadProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const fileContent = fs.readFileSync(this.path, 'utf-8');
        return JSON.parse(fileContent);
      } else {
        fs.writeFileSync(this.path, '[]');
        return [];
      }
    } catch (error) {
      console.log('Error al cargar los productos:', error);
      return [];
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products));
    } catch (error) {
      console.log('Error al guardar los productos:', error);
    }
  }

  addProduct(title, description, price, thumbnails, code, stock, status, category) {
    const existingProduct = this.products.find((product) => product.code === code);
    if (existingProduct) {
      return 'El código de producto ya está en uso.';
    }

    const newProduct = {
      id: this.generateId(),
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status,
      category,
    };

    this.products.push(newProduct);
    this.saveProducts();

    return newProduct;
  }

  generateId() {
    let maxId = 0;
    for (const product of this.products) {
      if (product.id > maxId) {
        maxId = product.id;
      }
    }
    return maxId + 1;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
      return `Producto con ID ${id} no encontrado.`;
    }
  }

  updateProduct(id, updatedFields) {
    const product = this.getProductById(id);
    if (product) {
      Object.assign(product, updatedFields);
      this.saveProducts();
      return product;
    } else {
      return `Producto con ID ${id} no encontrado.`;
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      return this.products;
    } else {
      return `Producto con ID ${id} no encontrado, no se puede eliminar.`;
    }
  }
}
