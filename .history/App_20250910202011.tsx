// Type definition for Answer
type Answer = {
  question: string;
  answer: string;
};

// Import supabase client - assume it's available from services
import { supabase } from './services/supabase';

// Async function to submit answers using Supabase Functions
async function submitAnswers(submissionId: string, answers: Answer[]) {
  const { data, error } = await supabase.functions.invoke('submit-intake', {
    body: { mode: 'answers', submissionId, answers },
  });
  if (error) throw error;
  return data;
}

// Example usage function to extract submissionId from URL
function getSubmissionIdFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('submissionId');
}

// Example component that uses the submitAnswers function
const AnswersForm: React.FC = () => {
  const [answers, setAnswers] = React.useState<Answer[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

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

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Submit Your Answers</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          Answers submitted successfully!
        </div>
      )}
      
      {answers.map((answer, index) => (
        <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Question:</label>
            <input
              type="text"
              value={answer.question}
              onChange={(e) => updateAnswer(index, 'question', e.target.value)}
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
              placeholder="Enter the question"
            />
          </div>
          <div>
            <label>Answer:</label>
            <textarea
              value={answer.answer}
              onChange={(e) => updateAnswer(index, 'answer', e.target.value)}
              style={{ width: '100%', padding: '5px', marginTop: '5px', minHeight: '60px' }}
              placeholder="Enter your answer"
            />
          </div>
        </div>
      ))}
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={addAnswer} style={{ marginRight: '10px', padding: '10px' }}>
          Add Answer
        </button>
        
        <button 
          onClick={handleSubmit} 
          disabled={loading || answers.length === 0}
          style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Submitting...' : 'Submit Answers'}
        </button>
      </div>
      
      <div style={{ fontSize: '12px', color: '#666' }}>
        Submission ID from URL: {getSubmissionIdFromUrl() || 'Not found'}
      </div>
    </div>
  );
};

