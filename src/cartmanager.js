import fs from "fs";

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async init() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
    } catch {
      this.carts = [];
    }
  }

  async createCart() {
    const newCart = {
      id: this.getNextId(),
      products: [],
    };

    this.carts.push(newCart);
    await this.saveCartsToFile();

    return newCart;
  }


  async getCartById(cartId) {
    try {
      const cart = this.carts.find(existingCart => existingCart.id === cartId);
      if (cart) {
        return cart;
      } else {
        throw new Error('El carrito con el ID especificado no existe');
      }
    } catch (error) {
      throw error;
    }
  }

  getAllCarts() {
    return this.carts;
  }
  
  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await this.getCartById(cartId);

    if (!cart) {
      console.log('El carrito con el ID especificado no existe');
      return null;
    }

    const existingProduct = cart.products.find(product => product.id === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      const productToAdd = {
        id: productId,
        quantity: quantity,
      };
      cart.products.push(productToAdd);
    }

    await this.saveCartsToFile();

    return cart.products;;
  }

  async saveCartsToFile() {
    const cartsJSON = JSON.stringify(this.carts, null, 2);
    try {
      await fs.promises.writeFile(this.path, cartsJSON);
    } catch (error) {
      console.log('Error al guardar los carritos en el archivo:', error);
    }
  }

  getNextId() {
    const maxId = this.carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);
    return maxId + 1;
  }
}

export default CartManager;
