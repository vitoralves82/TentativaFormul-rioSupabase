import React, { useState } from 'react';
import { supabase } from './services/supabase';

// Função submitIntake para integração com Supabase
async function submitIntake(payload: {
  projectName: string;
  clientName: string;
  recipientName: string;
  role: string;
  email: string;
  selectedQuestions: string[];
}) {
  const { data, error } = await supabase.functions.invoke('submit-intake', {
    body: { mode: 'intake', ...payload },
  });
  if (error) throw error;
  return data.submissionId as string;
}

interface FormData {
  projectName: string;
  clientName: string;
  recipientName: string;
  role: string;
  email: string;
  selectedQuestions: string[];
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    clientName: '',
    recipientName: '',
    role: '',
    email: '',
    selectedQuestions: [],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [submissionId, setSubmissionId] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      selectedQuestions: checked
        ? [...prev.selectedQuestions, value]
        : prev.selectedQuestions.filter(q => q !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage('');
    setSubmissionId('');

    try {
      const result = await submitIntake({
        projectName: formData.projectName,
        clientName: formData.clientName,
        recipientName: formData.recipientName,
        role: formData.role,
        email: formData.email,
        selectedQuestions: formData.selectedQuestions,
      });
      
      setSubmissionId(result);
      setSubmissionMessage('Formulário enviado com sucesso!');
      
      // Resetar formulário após sucesso
      setFormData({
        projectName: '',
        clientName: '',
        recipientName: '',
        role: '',
        email: '',
        selectedQuestions: [],
      });
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmissionMessage('Erro ao enviar formulário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableQuestions = [
    'Qual é o objetivo principal do projeto?',
    'Qual é o público-alvo?',
    'Qual é o orçamento disponível?',
    'Qual é o prazo desejado?',
    'Há preferências de tecnologia específicas?',
    'Quais são os principais requisitos funcionais?',
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Formulário de Intake de Projeto</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="projectName" style={{ display: 'block', marginBottom: '5px' }}>
            Nome do Projeto:
          </label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="clientName" style={{ display: 'block', marginBottom: '5px' }}>
            Nome do Cliente:
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="recipientName" style={{ display: 'block', marginBottom: '5px' }}>
            Nome do Destinatário:
          </label>
          <input
            type="text"
            id="recipientName"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="role" style={{ display: 'block', marginBottom: '5px' }}>
            Função/Cargo:
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>Selecione as perguntas:</label>
          {availableQuestions.map((question, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  value={question}
                  checked={formData.selectedQuestions.includes(question)}
                  onChange={handleQuestionChange}
                  style={{ marginRight: '8px' }}
                />
                {question}
              </label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Formulário'}
        </button>
      </form>

      {submissionMessage && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: submissionMessage.includes('sucesso') ? '#d4edda' : '#f8d7da',
            color: submissionMessage.includes('sucesso') ? '#155724' : '#721c24',
            border: `1px solid ${
              submissionMessage.includes('sucesso') ? '#c3e6cb' : '#f5c6cb'
            }`,
            borderRadius: '4px',
          }}
        >
          {submissionMessage}
          {submissionId && (
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              ID da submissão: {submissionId}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;