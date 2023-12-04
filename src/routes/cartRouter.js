import { Router } from "express";
import CartManager from "../cartmanager.js";

const router = Router();

const cartManager = new CartManager("./src/carts.json");
cartManager.init();


router.get("/", (req, res) => {
  try {
    const allCarts = cartManager.getAllCarts();
    return res.status(200).json(allCarts);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    return res.status(201).json(newCart);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const productAdded = await cartManager.addProductToCart(Number(cid), Number(pid), quantity);
    if (productAdded) {
      return res.status(201).json(productAdded);
    } else {
      return res.status(404).json({ message: "El carrito o el producto con los IDs especificados no existe" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
});

router.get("/:cid", async (req,res)=>{
  const {cid} = req.params;
  try{
    const cart = await cartManager.getCartById(Number(cid));
    return res.status(200).json(cart);
  }catch(error){
    return res.status(404).json({ message: error.message });
  }
})

export default router;