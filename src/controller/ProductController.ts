import type { Request, Response } from "express";
import Product from "../model/Product";

async function getAll(req: Request, res: Response) {
    try {
        const products = await Product.findAll();

        res.status(200).json(products);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);

        res.status(500).json({ message: "Erro ao buscar produtos." });
    }
}

async function getByKeyword(req: Request, res: Response) {}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ message: "ID do produto não fornecido." });
        return;
    }

    try {
        const product = await Product.findById(id);

        res.status(200).json(product);
    } catch (error) {
        console.error("Erro ao buscar produto:", error);

        res.status(404).json({ message: "Produto não encontrado." });
    }
}

async function create(req: Request, res: Response) {
    const { title, price } = req.body;

    if (!title) {
        res.status(400).json({ message: "O título do produto é obrigatório." });
        return;
    }

    if (!price) {
        res.status(400).json({ message: "O preço do produto é obrigatório." });
        return;
    }

    try {
        const product = await Product.create(req.body);

        res.status(201).json(product);
    } catch (error) {
        console.error("Erro ao criar produto:", error);

        res.status(500).json({ message: "Erro ao criar produto." });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const { title } = req.body;

    if (!id) {
        res.status(400).json({ message: "ID do produto não fornecido." });
        return;
    }

    if (!title) {
        res.status(400).json({ message: "O título do produto é obrigatório." });
        return;
    }

    try {
        const product = await Product.update(id, req.body);

        res.status(200).json(product);
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);

        res.status(404).json({ message: "Produto não encontrado." });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ message: "ID do produto não fornecido." });
        return;
    }

    try {
        await Product.remove(id);

        res.status(200).json({ message: "Produto removido com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir produto:", error);

        res.status(404).json({ message: "Produto não encontrado." });
    }
}

export default {
    getAll,
    getByKeyword,
    getById,
    create,
    update,
    remove
};