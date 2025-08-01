// app/polls/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function PollPage({ params }: any) {
  const [poll, setPoll] = useState<any>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetch(`/api/polls/${params.id}`)
      .then(res => res.json())
      .then(setPoll);

    fetch(`/api/comments?pollId=${params.id}`)
      .then(res => res.json())
      .then(setComments);
  }, [params.id]);

  console.log('Poll data:', poll);
  console.log('Comments:', comments);
  const handleVote = async () => {
    const res = await fetch(`/api/polls/${params.id}`, {
      method: 'POST',
      body: JSON.stringify({ answers, email }),
    });

    if (res.ok) {
      const updatedPoll = await res.json();
      setPoll(updatedPoll);
      setShowResults(true);
    } else {
      alert('Error submitting vote');
    }
  };

  const handleComment = async () => {
    await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify({
        pollId: params.id,
        email,
        text: comment,
        parentId: null,
      }),
    });
    setComment('');
    // Refresh comments
    const updated = await fetch(`/api/comments?pollId=${params.id}`).then((res) => res.json());
    setComments(updated);
  };

  const handleReply = async (parentId: string) => {
    await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify({
        pollId: params.id,
        email,
        text: replyText,
        parentId,
      }),
    });
    setReplyText('');
    setReplyingTo(null);
    const updated = await fetch(`/api/comments?pollId=${params.id}`).then((res) => res.json());
    setComments(updated);
  };

  const calculatePercentage = (votes: number, totalVotes: number) => {
    return totalVotes === 0 ? 0 : ((votes / totalVotes) * 100).toFixed(1);
  };

  const renderComments = (parentId: string | null) => {
    return comments
      .filter((c) => String(c.parentId) === String(parentId))
      .map((c) => (
        <div key={c._id} className="border-l pl-4 my-2">
          <p className="text-sm">
            <strong>{c.email}:</strong> {c.text}
          </p>
          <button
            onClick={() => handleReply(c._id)}
            disabled={!email.trim() || !replyText.trim()}
            className={`mt-1 px-3 py-1 text-sm rounded ${!email.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          >
            Reply
          </button>

          {replyingTo === c._id && (
            <div className="mt-2">
              <textarea
                className="border w-full p-2"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
              />
              <button
                onClick={() => handleReply(c._id)}
                className="mt-1 px-3 py-1 bg-blue-500 text-white text-sm rounded"
              >
                Reply
              </button>
            </div>
          )}

          {renderComments(c._id)}
        </div>
      ));
  };

  if (!poll) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{poll.title}</h1>

      <label className="block mb-4">
        <span>Email:</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 ml-2 w-full"
        />
      </label>

      {poll.questions.map((q: any, qIdx: number) => {
        const totalVotes = q.options.reduce(
          (acc: number, opt: any) => acc + opt.votes,
          0
        );

        return (
          <div key={qIdx} className="mt-4 border p-4 rounded">
            <p className="font-semibold mb-2">{q.questionText}</p>

            {q.options.map((opt: any, oIdx: number) => (
              <label key={oIdx} className="block mb-1">
                <input
                  type="radio"
                  name={`q${qIdx}`}
                  disabled={showResults}
                  checked={answers[qIdx] === oIdx}
                  onChange={() => {
                    const newAnswers = [...answers];
                    newAnswers[qIdx] = oIdx;
                    setAnswers(newAnswers);
                  }}
                />{' '}
                {opt.text}

                {showResults && (
                  <span className="ml-2 text-sm text-gray-700">
                    — {calculatePercentage(opt.votes, totalVotes)}% 
                    {/* ({opt.votes} votes) */}
                  </span>
                )}
              </label>
            ))}
          </div>
        );
      })}

      {!showResults && (
        <button
          onClick={handleVote}
          disabled={!email.trim()}
          className={`mt-4 px-4 py-2 rounded ${!email.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
        >
          ✅ Submit Vote
        </button>
      )}

      <div className="mt-8">
        <h2 className="text-xl mb-2">Comments</h2>

        <textarea
          className="border w-full p-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
        />
        <button
          onClick={handleComment}
          disabled={!email.trim() || !comment.trim()}
          className={`mt-2 px-4 py-2 rounded ${!email.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 text-white'}`}
        >
          💬 Add Comment
        </button>

        <div className="mt-4">{renderComments(null)}</div>
      </div>
    </div>
  );
}
