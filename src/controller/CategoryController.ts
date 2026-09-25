import type { Request, Response } from "express";
import Category from "../model/Category";

async function getAll(req: Request, res: Response) {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.log("Erro ao buscar categorias: ", error);
        res.status(500).json({
            message: "Erro ao buscar categorias.",
        });
    }
}

async function getByKeyword(req: Request, res: Response) {}

    async function getById(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID da categoria não fornecido." });
        }

        try {
            const category = await Category.findById(id);

            res.status(200).json(category);
        } catch (error) {
            console.log("Erro ao buscar categoria: ", error);

            res.status(404).json({
                message: "Categoria não encontrada.",
            });
        }
    }

    async function create(req: Request, res: Response) {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "O nome da categoria é obrigatório." });
        }

        try {
            const category = await Category.create(req.body);
            res.status(201).json(category);
        } catch (error) {
            console.log("Erro ao criar categoria: ", error);
            res.status(500).json({
                message: "Erro ao criar categoria.",
            });
        }
    }

    async function update(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        const { name } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID da categoria não fornecido." });
        }

        if (!name) {
            return res.status(400).json({ message: "O nome da categoria é obrigatório." });
        }

        try {
            const category = await Category.update(id, req.body);
            res.status(200).json(category);
        } catch (error) {
            console.log("Erro ao atualizar categoria: ", error);
            res.status(404).json({
                message: "Categoria não encontrada.",
            });
        }
    }

    async function remove(req: Request, res: Response) {

        if (!id) {
            

                return res.status(404).json({
                    message: "ID do produto não fornecido."
                });
            }

            try {
                await Category.remove(req.params.id);

                res.status(200).json({
                    message: "Categoria removida com sucesso."
                })
            } catch (error) {
                console.log("Erro ao excluir categoria: ", error);

res.status(404).json({
                    message: "Categoria não encontrada."
                });
            }
} 

export default {
    getAll,
    getByKeyword,
    getById,
    create,
    update,
    remove
}