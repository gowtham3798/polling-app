// app/admin/page.tsx
'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: [''] },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: [''] }]);
  };

  const handleQuestionChange = (qIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const addOption = (qIdx: number) => {
    const updated = [...questions];
    updated[qIdx].options.push('');
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    const formatted = {
      title,
      questions: questions.map((q) => ({
        questionText: q.questionText,
        options: q.options.map((opt) => ({ text: opt })),
      })),
    };

    const res = await fetch('/api/polls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formatted),
    });

    if (res.ok) {
      alert('Poll created!');
      setTitle('');
      setQuestions([{ questionText: '', options: [''] }]);
    } else {
      alert('Error creating poll.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin: Create a Poll</h1>

      <label className="block mb-2">
        <span className="font-semibold">Poll Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter poll title"
        />
      </label>

      {questions.map((q, qIdx) => (
        <div key={qIdx} className="mt-4 border p-4">
          <label className="block mb-2">
            <span className="font-semibold">Question {qIdx + 1}</span>
            <input
              type="text"
              value={q.questionText}
              onChange={(e) =>
                handleQuestionChange(qIdx, e.target.value)
              }
              className="border p-2 w-full"
              placeholder="Enter question text"
            />
          </label>

          {q.options.map((opt, oIdx) => (
            <label key={oIdx} className="block mb-1">
              <span className="text-sm">Option {oIdx + 1}</span>
              <input
                type="text"
                value={opt}
                onChange={(e) =>
                  handleOptionChange(qIdx, oIdx, e.target.value)
                }
                className="border p-2 w-full"
                placeholder="Enter option text"
              />
            </label>
          ))}

          <button
            type="button"
            onClick={() => addOption(qIdx)}
            className="mt-2 px-2 py-1 bg-gray-300 rounded"
          >
            ➕ Add Option
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        ➕ Add Question
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        ✅ Create Poll
      </button>
    </div>
  );
}
