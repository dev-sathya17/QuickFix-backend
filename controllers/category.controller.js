const Category = require("../models/categories");
const categoryController = {
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const newCategory = await Category.create({ name });
      res
        .status(201)
        .json({ message: "Category created successfully", newCategory });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({});
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      await Category.findByIdAndDelete(id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = categoryController;
