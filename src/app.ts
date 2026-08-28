import express from "express";
import { randomUUID } from "node:crypto";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Restaurant Ordering System - API",
        version: "1.0.0",
    });
});


const pizzaCategoryId = randomUUID();
const drinksCategoryId = randomUUID();


// Categories
const categories = [
    {
        "id": pizzaCategoryId,
        "name": "Pizzas",
        "description": "Pizzas salgadas com sabores tradicionais, especiais e opções personalizadas."
    },
    {
        "id": drinksCategoryId,
        "name": "Bebidas",
        "description": "Bebidas para acompanhar a refeição, incluindo refrigerantes, sucos, águas e outras opções."
    },
    {
        "id": randomUUID(),
        "name": "Sobremesas",
        "description": "Opções doces para finalizar o pedido, como pizzas doces, brownies, sorvetes e outras sobremesas."
    }
];

const products = [
    {
        "id": randomUUID(),
        "categoryId": pizzaCategoryId,
        "name": "Pizza Calabresa",
        "description": "Pizza com molho de tomate, mussarela, calabresa fatiada, cebola e orégano.",
        "price": 49.90
    },
    {
        "id": randomUUID(),
        "categoryId": drinksCategoryId,
        "name": "Coca-Cola 2L",
        "description": "Refrigerante Coca-Cola de 2 litros, ideal para acompanhar a pizza.",
        "price": 12.90
    },
    {
        "id": randomUUID(),
        "categoryId": 3,
        "name": "Pizza de Chocolate",
        "description": "Pizza doce com cobertura cremosa de chocolate e granulado.",
        "price": 39.90
    }
];

app.get("/categories", (req, res) => {
    res.status(200).json(categories);
});

app.get("/categories/:id", (req, res) => {
    const category = categories.find((category) => {
        return category.id == req.params.id
    });

    if (!category) {
        return res.status(404).json({
            message: "Categoria não encontrada.",
        });
    }

    res.status(200).json(category);
});


//post categories
app.post("/categories/", (req, res) => {
   const category = {
        id: randomUUID(),
        ...req.body
   };

   categories.push(category);

    res.status(201).json(category);
});


app.put("/categories/:id", (req, res) => {
    const category = categories.find((category) => {
        return category.id == req.params.id
    });

    if (!category) {
        return res.status(404).json({
            message: "Categoria não encontrada.",
        });
    }

category.name = req.body.name;
category.description = req.body.description;

    res.status(200).json(category);
});

app.delete("/categories/:id", (req, res) => {
    const category = categories.find((category) => {
        return category.id == req.params.id
    });

    if (!category) {
        return res.status(404).json({
            message: "Categoria não encontrada.",
        });
    }

const incdex = categories.indexOf(category);
categories.splice(incdex, 1);

    res.status(200).json({
        message: "Categoria deletada com sucesso."
    });
});


// Products    
app.get("/products", (req, res) => {
    res.status(200).json(products);
});

app.get("/products/:id", (req, res) => {
    const product = products.find((product) => {
        return product.id == req.params.id
    });

    if (!product) {
        return res.status(404).json({
            message: "Produto não encontrado.",
        });
    }

    res.status(200).json(product);
});

app.post("/products", (req, res) => {
    const product = {
        id: randomUUID(),
        ...req.body
    };

    products.push(product);


    res.status(200).json(product);
});

app.put("/products/:id", (req, res) => {
    const product = products.find((product) => {
        return product.id == req.params.id
    });

    if (!product) {
        return res.status(404).json({
            message: "Produto não encontrado.",
        });
    }

product.name = req.body.name;
product.description = req.body.description;

    res.status(200).json(product);
});

app.delete("/products/:id", (req, res) => {
    const product = products.find((product) => {
        return product.id == req.params.id
    });

    if (!product) {
        return res.status(404).json({
            message: "Produto não encontrado.",
        });
    }

const index = products.indexOf(product);
products.splice(index, 1);

    res.status(200).json({
        message: "Produto deletado com sucesso."
    });
});
export default app;