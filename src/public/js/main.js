const socket = io()

const form = document.querySelector("form");

form.addEventListener("submit",(e)=>{
  e.preventDefault()

  const formData = new FormData(form)

  const post = {
    title: formData.get("title"),
    descripcion: formData.get("descripcion"),
    price: Number(formData.get("price")),
    thumbnail: formData.get("thumbnail"),
    code: formData.get("code"),
    stock: Number(formData.get("stock")),
  };
  socket.emit("post_send",post);
  form.reset()
});

socket.on("products",(data)=>{
  const products = document.querySelector("#products")

  products.innerHTML="";
  data.forEach((post)=>{
    console.log(post)
    const p = document.createElement("p")
    p.innerText = `Id: ${post.id}-${post.title}-${post.descripcion}-${post.price}-${post.thumbnail}-${post.code}-${post.stock}`
    products.appendChild(p);
  })
})


const button =document.querySelector("#eliminar");

button.addEventListener("click",(e)=>{
  e.preventDefault()
})