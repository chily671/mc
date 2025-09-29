"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function WordsRandomPage() {
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [pool, setPool] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [finished, setFinished] = useState(false);

  const [mode, setMode] = useState("1"); // "1" = 1 từ, "2" = 2 từ

  const [time, setTime] = useState(30);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);

  const timerRef = useRef(null);

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
      stopTraining();
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
    stopTraining();
  }, [category, words]);

  // Random theo mode
  const randomWord = () => {
    if (pool.length === 0 || (mode === "2" && pool.length < 2)) {
      setFinished(true);
      setCurrentWord(null);
      return;
    }

    if (mode === "1") {
      const index = Math.floor(Math.random() * pool.length);
      const selected = pool[index];
      setCurrentWord([selected]);
      setPool(pool.filter((_, i) => i !== index));
    } else {
      // random 2 từ khác nhau
      const index1 = Math.floor(Math.random() * pool.length);
      let index2 = Math.floor(Math.random() * pool.length);
      while (index2 === index1) {
        index2 = Math.floor(Math.random() * pool.length);
      }

      const selected = [pool[index1], pool[index2]];
      setCurrentWord(selected);
      setPool(pool.filter((_, i) => i !== index1 && i !== index2));
    }
  };

  // Start luyện tập
  const startTraining = () => {
    if (pool.length === 0) {
      setFinished(true);
      return;
    }

    setRunning(true);
    randomWord();
    setTimer(time);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (pool.length > 0) {
            randomWord();
            return time;
          } else {
            setFinished(true);
            clearInterval(timerRef.current);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop luyện tập
  const stopTraining = () => {
    setRunning(false);
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ngẫu nhiên từ vựng</h1>

      {/* Chọn category */}
      <Select value={category} onValueChange={setCategory} disabled={running}>
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

      {/* Chọn chế độ 1 hay 2 từ */}
      <Select
        value={mode}
        onValueChange={setMode}
        disabled={running}
        className="mb-4"
      >
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Chọn số từ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 từ</SelectItem>
          <SelectItem value="2">2 từ</SelectItem>
        </SelectContent>
      </Select>

      {/* Chọn thời gian */}
      <div className="flex gap-2 mb-4">
        <Select
          onValueChange={(val) => setTime(Number(val))}
          defaultValue="30"
          disabled={running}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 giây</SelectItem>
            <SelectItem value="60">1 phút</SelectItem>
            <SelectItem value="120">2 phút</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Custom (giây)"
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          disabled={running}
        />
      </div>

      {/* Nút điều khiển */}
      {!running ? (
        <Button onClick={startTraining} className="w-full mb-6">
          {finished ? "Bắt đầu lại" : "Bắt đầu"}
        </Button>
      ) : (
        <Button
          onClick={stopTraining}
          variant="destructive"
          className="w-full mb-6"
        >
          Dừng lại
        </Button>
      )}

      {/* Timer */}
      {running && (
        <div className="text-center text-xl font-semibold text-red-600 mb-4">
          ⏱️ {timer}s
        </div>
      )}

      {/* Kết quả */}
      {currentWord && (
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center space-y-2">
            {currentWord.map((w) => (
              <div key={w._id}>
                <h2 className="text-xl font-semibold">{w.word}</h2>
                <p className="text-sm text-gray-500">{w.category}</p>
              </div>
            ))}
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
