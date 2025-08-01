// app/polls/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function PollsListPage() {
  const [polls, setPolls] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/polls')
      .then((res) => res.json())
      .then(setPolls);
  }, []);

  const handleCopy = (id: string) => {
    const url = `${window.location.origin}/polls/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Poll link copied to clipboard!');
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Polls</h1>

      {polls.length === 0 && <p>No polls found.</p>}

      <ul className="space-y-4">
        {polls.map((poll) => (
          <li key={poll._id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{poll.title}</p>
              <a href={`/polls/${poll._id}`} className="text-blue-600 underline text-sm">
                View Poll
              </a>
            </div>
            <button
              onClick={() => handleCopy(poll._id)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              📋 Copy Link
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
