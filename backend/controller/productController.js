import {sql} from "../config/db.js";
//CRUD OPERATIONS DONE HERE
export const getAllProducts = async(req , res) =>{
    try {
        const products = await sql`
           SELECT * FROM products
           ORDER BY created_at DESC
        `;
        console.log("fetched product" , products);

        res.status(200).json({success : true , data : products});
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const createProducts = async(req , res) =>{
    const { name, price, image } = req.body;
    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const newProduct = await sql`
            INSERT INTO products (name, price, image)
            VALUES (${name}, ${price}, ${image})
            RETURNING *
        `;

        console.log("Product created:", newProduct);
        res.status(201).json({ success: true, data: newProduct[0] });
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const getProduct = async(req , res) =>{
    const { id } = req.params;
    try {
        const product = await sql`
          SELECT * FROM products
          WHERE id = ${id}
        `;
        if (product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.log("error in getProduct function" , error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const updateProduct = async(req , res) =>{
    const { id } = req.params;
    const { name, price, image } = req.body;
    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    try {
        const updatedProduct = await sql`
            UPDATE products
            SET name = ${name}, price = ${price}, image = ${image}
            WHERE id = ${id}
            RETURNING *
        `;

        if (updatedProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        console.log("Product updated:", updatedProduct[0]);
        res.status(200).json({ success: true, data: updatedProduct[0] });
    } catch (error) {
        console.error("❌ Error updating product:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const deleteProduct = async(req , res) =>{
 const {id} = req.params;
 try {
    const deletedProduct = await sql`
      DELETE FROM products
      WHERE id = ${id}
    `;

    if(deletedProduct.count === 0) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: deletedProduct[0]});
 } catch (error) {
    console.log("error fetching product" , error);
    res.status(500).json({ success: false, message: "Server error" });
 }
};