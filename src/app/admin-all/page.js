"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminPage() {
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ word: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState("");

  // Load data
  useEffect(() => {
    fetch("/api/words")
      .then((res) => res.json())
      .then((data) => {
        setWords(data);
        // lấy unique category
        const uniqueCategories = [
          ...new Set(data.map((w) => w.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      });
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save word (add / edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...formData, _id: editingId } : formData;

    await fetch("/api/words", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setFormData({ word: "", category: "" });
    setEditingId(null);
    setNewCategory("");

    // Refresh
    fetch("/api/words")
      .then((res) => res.json())
      .then((data) => {
        setWords(data);
        const uniqueCategories = [
          ...new Set(data.map((w) => w.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      });
  };

  // Edit word
  const handleEdit = (word) => {
    setFormData({
      word: word.word || "",
      category: word.category || "",
    });
    setEditingId(word._id);
  };

  // Delete word
  const handleDelete = async (id) => {
    await fetch(`/api/words?id=${id}`, { method: "DELETE" });
    setWords((prev) => prev.filter((w) => w._id !== id));
  };

  // Add new category
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
      setFormData((prev) => ({ ...prev, category: newCategory }));
      setNewCategory("");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin - Manage Words</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <Input
          placeholder="Word"
          name="word"
          value={formData.word}
          onChange={handleChange}
        />

        {/* Category Select */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
          <option value="__new">+ Add New Category</option>
        </select>

        {/* Input add new category */}
        {formData.category === "__new" && (
          <div className="flex gap-2">
            <Input
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button type="button" onClick={handleAddCategory}>
              Add
            </Button>
          </div>
        )}

        <Button type="submit">
          {editingId ? "Update Word" : "Add Word"}
        </Button>
      </form>

      {/* List */}
      <div className="space-y-3">
        {words.map((w) => (
          <div
            key={w._id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div>
              <p className="font-semibold">{w.word}</p>
              <p className="text-xs text-blue-500">{w.category}</p>
            </div>
            <div className="space-x-2">
              <Button size="sm" onClick={() => handleEdit(w)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(w._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
