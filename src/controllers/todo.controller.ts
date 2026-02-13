import { Request, Response } from "express";
import Todo from "../models/todo.model";

export const getTodos = async (req: Request, res: Response) => {
  try {
    const { search = "", priority = "" } = req.query as Record<string, string>;
    const filter: any = { user: req.user!.id };

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (priority) {
      filter.priority = priority;
    }

    const todos = await Todo.find(filter);
    res.json({ todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch todos", error });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  const todo = await Todo.create({
    title: req.body.title,
    priority: req.body.priority || "low",
    completed: false,
    user: req.user!.id,
  });

  res.status(201).json(todo);
};

export const updateTodo = async (req: Request, res: Response) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user!.id },
    req.body,
    { returnDocument: "after" },
  );

  if (!todo) return res.status(404).json({ message: "Todo not found" });

  res.json(todo);
};

export const deleteTodo = async (req: Request, res: Response) => {
  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
    user: req.user!.id,
  });

  if (!todo) return res.status(404).json({ message: "Todo not found" });

  res.json({ message: "Todo deleted" });
};
