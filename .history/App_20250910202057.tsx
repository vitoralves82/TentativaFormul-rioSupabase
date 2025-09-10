import React, { useState } from 'react';
import { submitAnswers, type Answer } from './services/supabase';

// Function to extract submissionId from URL parameters
function getSubmissionIdFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('submissionId');
}

// Example component that uses the submitAnswers function
const AnswersForm: React.FC = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const submissionId = getSubmissionIdFromUrl();
    if (!submissionId) {
      setError('No submission ID found in URL');
      return;
    }

    if (answers.length === 0) {
      setError('Please provide at least one answer');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await submitAnswers(submissionId, answers);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answers');
    } finally {
      setLoading(false);
    }
  };

  const addAnswer = () => {
    setAnswers([...answers, { question: '', answer: '' }]);
  };

  const updateAnswer = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = answers.map((answer, i) => 
      i === index ? { ...answer, [field]: value } : answer
    );
    setAnswers(updated);
  };

  const removeAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Submit Your Answers</h2>
      
      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        <strong>Submission ID:</strong> {getSubmissionIdFromUrl() || 'Not found in URL'}
      </div>
      
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#fee', 
          padding: '10px', 
          border: '1px solid #fcc',
          borderRadius: '4px',
          marginBottom: '20px' 
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          color: 'green', 
          backgroundColor: '#efe', 
          padding: '10px', 
          border: '1px solid #cfc',
          borderRadius: '4px',
          marginBottom: '20px' 
        }}>
          <strong>Success!</strong> Answers submitted successfully!
        </div>
      )}
      
      {answers.map((answer, index) => (
        <div key={index} style={{ 
          marginBottom: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '6px',
          padding: '15px',
          backgroundColor: '#f9f9f9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0 }}>Question {index + 1}</h4>
            <button 
              onClick={() => removeAnswer(index)}
              style={{ 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Remove
            </button>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Question:</label>
            <input
              type="text"
              value={answer.question}
              onChange={(e) => updateAnswer(index, 'question', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              placeholder="Enter the question text"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Answer:</label>
            <textarea
              value={answer.answer}
              onChange={(e) => updateAnswer(index, 'answer', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                minHeight: '80px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              placeholder="Enter your answer"
            />
          </div>
        </div>
      ))}
      
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={addAnswer} 
          style={{ 
            marginRight: '10px', 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Add Question & Answer
        </button>
        
        <button 
          onClick={handleSubmit} 
          disabled={loading || answers.length === 0 || !getSubmissionIdFromUrl()}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: loading || answers.length === 0 || !getSubmissionIdFromUrl() ? '#6c757d' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading || answers.length === 0 || !getSubmissionIdFromUrl() ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Answers'}
        </button>
      </div>
      
      <div style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
        Note: Make sure to include a submissionId parameter in the URL (e.g., ?submissionId=123)
      </div>
    </div>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AnswersForm />
    </div>
  );
};

export default App;