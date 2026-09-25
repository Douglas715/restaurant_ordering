import express from "express";
import Category from "./model/Category.js";
import Product from "./model/Product.js";
import categoryRoutes from './routes/categoryRoutes';

const app = express();
app.use(express.json());

// =====================
// Root
// =====================
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Restaurant Ordering System - API",
        version: "1.0.0",
    });
});

// =====================
// Categories
// =====================

app.get("/categories/search/:keyword", async (req, res) => {
    try {
        const categories = await Category.searchByKeyword(
            req.params.keyword,
        );

        res.status(200).json(categories);
    } catch (error) {
        console.log("Erro ao buscar categorias: ", error);

        res.status(500).json({
            message: "Erro ao buscar categorias."
        });
    }
});



app.get("/categories", async (req, res) => {

});

app.get("/categories/search/:keyword", async (req, res) => {});

app.get("/categories/:id", async (req, res) => {
});

app.post("/categories", async (req, res) => {});

app.put("/categories/:id", async (req, res) => {});

app.delete("/categories/:id", async (req, res) => {});

// =====================
// Products
// =====================
app.get("/products", async (req, res) => {
    try {
        const products = await Product.findAll();

        res.status(200).json(products)
    } catch (error) {
        console.log("Erro ao buscar produtos: ", error);

        res.status(500).json({
            message: "Erro ao buscar produtos."
        });
    }
});



app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        res.status(200).json(product)
    } catch (error) {
        console.log("Erro ao buscar produto: ", error);

        res.status(404).json({
            message: "Produto não encontrado."
        });
    }
});

app.post("/products", async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json(product)
    } catch (error) {
        console.log("Erro ao criar produto: ", error);

        res.status(500).json({
            message: "Erro ao criar produto."
        });
    }
});

app.put("/products/:id", async (req, res) => {
    try {
        const product = await Product.update(
            req.params.id,
            req.body
        );

        res.status(200).json(product)
    } catch (error) {
        console.log("Erro ao atualizar produto: ", error);

        res.status(404).json({
            message: "Produto não encontrado."
        });
    }
});

app.delete("/products/:id", async (req, res) => {
    try {
        await Product.remove(req.params.id);

        res.status(200).json({
            message: "Produto removido com sucesso."
        })
    } catch (error) {
        console.log("Erro ao excluir produto: ", error);

        res.status(404).json({
            message: "Produto não encontrado."
        });
    }
});

export default app;