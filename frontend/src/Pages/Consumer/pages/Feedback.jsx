import React, { useState } from "react";
import { toast } from "react-toastify";
import "./feedback.css";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comments.trim()) {
      toast.error("Please provide a rating and comments");
      return;
    }

    try {
      // Simulate API call to submit feedback
      // Replace with actual API call: await fetch('/api/feedback', { method: 'POST', body: JSON.stringify({ rating, comments }) });

      // For now, just show success message
      toast.success("Feedback submitted successfully!");
      setRating(0);
      setComments("");
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div className="feedback">
      <h1>Feedback</h1>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="rating-section">
          <label>Rating</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? "star selected" : "star"}
                onClick={() => setRating(star)}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>

        <div className="comments-section">
          <label htmlFor="comments">Comment</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share your experience..."
            required
          />
        </div>
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default Feedback;
