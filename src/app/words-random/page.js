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

  const [mode, setMode] = useState("preset"); // preset | custom
  const [time, setTime] = useState(30); // default preset
  const [customTime, setCustomTime] = useState("");
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

  // Random 1 từ
  const randomWord = () => {
    if (pool.length === 0) {
      setFinished(true);
      setCurrentWord(null);
      return;
    }
    const index = Math.floor(Math.random() * pool.length);
    const selected = pool[index];
    setCurrentWord(selected);
    setPool(pool.filter((_, i) => i !== index));
  };

  // Start luyện tập
  const startTraining = () => {
    if (pool.length === 0) {
      setFinished(true);
      return;
    }

    const duration = mode === "custom" ? Number(customTime) : time;
    if (!duration || duration <= 0) {
      toast.error("Vui lòng nhập thời gian hợp lệ");
      return;
    }

    setRunning(true);
    randomWord();
    setTimer(duration);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (pool.length > 0) {
            randomWord();
            return duration;
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

      {/* Chọn thời gian */}
      <div className="flex gap-2 mb-4">
        <Select
          value={mode === "preset" ? String(time) : "custom"}
          onValueChange={(val) => {
            if (val === "custom") {
              setMode("custom");
            } else {
              setMode("preset");
              setTime(Number(val));
            }
          }}
          disabled={running}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 giây</SelectItem>
            <SelectItem value="60">1 phút</SelectItem>
            <SelectItem value="120">2 phút</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>

        {mode === "custom" && (
          <Input
            type="number"
            placeholder="Custom (giây)"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            disabled={running}
          />
        )}
      </div>

      {/* Nút điều khiển */}
      {!running ? (
        <div className="flex gap-2 mb-6">
          <Button onClick={startTraining} className="flex-1">
            {finished ? "Bắt đầu lại" : "Bắt đầu"}
          </Button>
          <Button
            variant="outline"
            onClick={randomWord}
            className="flex-1"
            disabled={pool.length === 0}
          >
            Random từ mới
          </Button>
        </div>
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
