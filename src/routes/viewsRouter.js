const { Router } = require("express");
const  CartManager  = require("../services/cartsServices");
const router = Router();
const manager = new CartManager()

router.get("/cart/:cid", async (req, res) => {
    ""
    // Buscar informacion para mandar a la vista
    const { cid } = req.params;
    const cart = await manager.getCart(cid)
    if (cart) {
        // console.log();
        // console.log(cart[0].products);
        const productosII = cart[0].products.map((pro) =>  [pro.product.name, pro.product.price, pro.product.descripcion ,pro.quantity]
        );
        // console.log(productosII);

        // const productos = {producots : cart[0].products}
        return res.render("cart", productosII)
    }
    console.log("11asda");
    res.json({holaa: "holaa"})
})



module.exports = router