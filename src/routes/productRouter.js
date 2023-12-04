import { Router } from "express";
import ProductManager from "../primer_entrega.js";

const router = Router();

const productManager = new ProductManager('./src/productos.json');
productManager.init()

router.get("/", (req, res) => {
  const {limit} = req.query;
  const product = productManager.getProducts();
  console.log(product);

  if(limit > product.length){
    return res.json({ message :"El limite ingresado es mayor a la cantidad de productos" })
  }

  if (limit){
    const limioptions = product.slice(0,limit);
    return res.status(200).json(limioptions);
  }
  return res.status(200).json(product);
});

router.get("/:id",(req,res)=>{
  const {id} = req.params;
  try{
    const product = productManager.getProductById(Number(id));
    return res.status(200).json(product);
  }catch(error){
    return res.status(404).json({ message: error.message });
  }
})

router.post("/", async (req, res) => {
  const productData = req.body;

  if (!productData.title || !productData.descripcion || !productData.price || !productData.code || !productData.stock) {
    return res.status(400).json({ message: "Todos los campos, excepto thumbnail, deben estar completos" });
  }
  
  productData.id = productManager.getNextId();

  const result = await productManager.addProduct(productData);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  return res.status(201).json({ message: result.success, product: result.product });
});

router.put("/:id",(req,res)=>{
 const {id} = req.params;
 const updatedproductdata = req.body;

 try{
  const existingproduct = productManager.getProductById(Number(id));

  if(!existingproduct){
    return res.status(404).json({message:"El producto con el id especificado no existe"});
  }
  delete updatedproductdata.id;

  const updatedproduct = {...existingproduct, ...updatedproductdata};
  
  productManager.updateProduct(Number(id), updatedproduct);
  return res.status(200).json(updatedproduct);
 } catch(error){
    return res.status(500).json({message:"Error interno del servidor",error: error.message});
 }
});

router.delete("/:id",(req,res)=>{
  const {id} = req.params;

  try{
    const existingproduct = productManager.getProductById(Number(id));

    if(!existingproduct){
      return res.status(404).json({message:"El producto con el id especificado no existe"});
    }

    productManager.deleteProduct(Number(id))
    return res.status(200).json({message:"Se ha eliminado el producto correctamente"});

  }catch(error){
    return res.status(500).json({message:"Error interno del servidor",error: error.message});
  }
  
});

export default router;