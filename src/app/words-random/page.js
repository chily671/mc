"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function WordsRandomPage() {
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [pool, setPool] = useState([]); // danh sách word chưa random
  const [currentWord, setCurrentWord] = useState(null);
  const [finished, setFinished] = useState(false); // đã hết danh sách chưa
  // Load words
  useEffect(() => {
    fetch("/api/words")
      .then((res) => res.json())
      .then((data) => {
        setWords(data);
        const uniqueCategories = [
          ...new Set(data.map((w) => w.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      });
  }, []);

  useEffect(() => {
    if (finished) {
      toast.success("Đã hết danh sách từ trong danh mục này 🎉");
    }
  }, [finished]);

  // Reset pool khi đổi category
  useEffect(() => {
    if (category === "all") {
      setPool([...words]);
    } else {
      setPool(words.filter((w) => w.category === category));
    }
    setCurrentWord(null);
    setFinished(false);
  }, [category, words]);

  // Random không trùng
  const handleRandom = () => {
    if (finished) {
      // reset sau khi user bấm random lại
      if (category === "all") {
        setPool([...words]);
      } else {
        setPool(words.filter((w) => w.category === category));
      }
      setCurrentWord(null);
      setFinished(false);
      return;
    }

    if (pool.length === 0) {
      setFinished(true);
      setCurrentWord(null);
      return;
    }

    const index = Math.floor(Math.random() * pool.length);
    const selected = pool[index];

    setCurrentWord(selected);

    // bỏ từ vừa random ra khỏi pool
    setPool(pool.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ngẫu nhiên từ vựng</h1>

      {/* Chọn category */}
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Chọn danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {categories.map((cat, i) => (
            <SelectItem key={i} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleRandom} className="w-full mb-6">
        {finished ? "Bắt đầu lại" : "Radom"}
      </Button>

      {/* Kết quả */}
      {currentWord && (
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold">{currentWord.word}</h2>
            <p className="text-sm text-gray-500 mt-2">{currentWord.category}</p>
          </CardContent>
        </Card>
      )}

      {/* Thông báo hết danh sách */}
      {finished && (
        <div className="mt-4 text-center text-red-600 font-medium">
          Đã hết danh sách từ trong danh mục này 🎉
        </div>
      )}
    </div>
  );
}
