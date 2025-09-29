"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function WordsPage() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetch("/api/words")
      .then((res) => res.json())
      .then((data) => setWords(data));
  }, []);

  // Group theo category
  const groupedWords = words.reduce((acc, word) => {
    if (!acc[word.category]) acc[word.category] = [];
    acc[word.category].push(word);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📚 Words by Category</h1>

      <div className="space-y-8">
        {Object.keys(groupedWords).map((category) => (
          <Card key={category} className="shadow-lg border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {category}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {groupedWords[category].map((w) => (
                  <span
                    key={w._id}
                    className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium shadow-sm hover:bg-blue-200 transition cursor-pointer"
                  >
                    {w.word}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-10" />

      {Object.keys(groupedWords).length === 0 && (
        <p className="text-center text-gray-500">Chưa có từ nào trong database.</p>
      )}
    </div>
  );
}
