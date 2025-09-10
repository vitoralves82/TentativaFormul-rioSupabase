import React, { useState, useEffect } from 'react';
import { Recipient, Question, Answer } from '../types';
import { ALL_QUESTIONS } from '../data/questions';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { supabaseService } from '../services/supabaseService';
import { PaperClipIcon, CheckCircleIcon, TrashIcon } from './icons';

// Helpers para achar o submissionId em /?submissionId=... e também em #/?submissionId=...
function getSubmissionIdFromURL(): string {
  //const s1 = new URLSearchParams(window.location.search).get("submissionId");
  const [submissionId, setSubmissionId] = useState<string>(getSubmissionIdFromURL());



interface RespondentViewProps {
  respondentData?: {
    projectName: string;
    recipient: Recipient;
  }
}

const RespondentView: React.FC<RespondentViewProps> = ({ respondentData }) => {
  const respondentId = respondentData?.recipient.id || 'preview';
  const projectId = respondentData?.projectName || 'preview-project';
  const localStorageKey = `environpact-answers-${projectId}-${respondentId}`;

  const [answers, setAnswers] = useLocalStorage<{ [key: string]: Answer }>(localStorageKey, {});
  const [assignedQuestions, setAssignedQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (respondentData) {
      const questions = ALL_QUESTIONS.filter(q => respondentData.recipient.selectedQuestions.includes(q.id));
      setAssignedQuestions(questions);
    }
  }, [respondentData]);
  
  const handleAnswerChange = (questionId: string, value: string | File | null, type: 'text' | 'file') => {
    setAnswers(prev => {
      const newAnswer = { ...prev[questionId] };
      if (type === 'text') {
        newAnswer.text = value as string;
      } else if (type === 'file') {
        const file = value as File | null;
        newAnswer.file = file;
        newAnswer.fileName = file?.name;
      }
      return { ...prev, [questionId]: newAnswer };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionStatus('idle');
    try {
      await supabaseService.saveAnswers(respondentId, answers);
      setSubmissionStatus('success');
      // Limpa o local storage após o envio bem-sucedido
      localStorage.removeItem(localStorageKey);
    } catch (error) {
      console.error("Erro ao enviar respostas:", error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!respondentData) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-xl text-gray-600">Crie um projeto e adicione um destinatário na Visão do Administrador para visualizar o formulário.</h2>
        <p className="text-gray-500 mt-2">Nenhum dado de respondente encontrado para o preview.</p>
      </div>
    );
  }
  
  if (submissionStatus === 'success') {
     return (
        <div className="container mx-auto p-8 text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Formulário Enviado!</h2>
            <p className="text-gray-600 mt-2">Obrigado por suas respostas. Seus dados foram recebidos com sucesso.</p>
        </div>
     )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Formulário do Projeto: {respondentData.projectName}</h1>
          <p className="mt-2 text-lg text-gray-600">Olá, {respondentData.recipient.name}. Por favor, responda às perguntas abaixo.</p>
        </div>
        
        <div className="space-y-6">
          {assignedQuestions.map((question, index) => (
            <div key={question.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200/80">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 text-lg font-bold text-emerald-600 bg-emerald-100/70 rounded-full h-8 w-8 flex items-center justify-center">{index + 1}</span>
                <p className="text-lg font-medium text-gray-800 flex-grow pt-0.5">{question.text}</p>
              </div>
              
              <div className="mt-5 pl-12 space-y-4">
                <div>
                  <label htmlFor={`text-answer-${question.id}`} className="block text-sm font-medium text-gray-600 mb-2">Resposta em texto:</label>
                  <textarea
                    id={`text-answer-${question.id}`}
                    rows={4}
                    value={answers[question.id]?.text || ''}
                    onChange={e => handleAnswerChange(question.id, e.target.value, 'text')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition"
                    placeholder="Sua resposta..."
                  ></textarea>
                </div>
                
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Anexo (opcional):</label>
                  {answers[question.id]?.fileName ? (
                    <div className="p-3 rounded-md bg-gray-100 border flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <PaperClipIcon className="w-5 h-5 text-gray-500"/>
                        <span>{answers[question.id]?.fileName}</span>
                      </div>
                      <div className='flex items-center gap-4'>
                        <label htmlFor={`file-${question.id}`} className="text-sm font-medium text-emerald-600 hover:underline cursor-pointer">
                            Alterar
                            <input id={`file-${question.id}`} type="file" className="hidden" onChange={e => handleAnswerChange(question.id, e.target.files ? e.target.files[0] : null, 'file')}/>
                        </label>
                        <button onClick={() => handleAnswerChange(question.id, null, 'file')} className="text-red-500 hover:text-red-700">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor={`file-${question.id}`} className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-emerald-400 cursor-pointer transition">
                      <PaperClipIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm font-semibold text-gray-600">Anexar um arquivo</span>
                      <input id={`file-${question.id}`} type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => handleAnswerChange(question.id, e.target.files ? e.target.files[0] : null, 'file')}/>
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end items-center gap-4">
             {submissionStatus === 'error' && <div className="text-red-600">Ocorreu um erro ao enviar. Tente novamente.</div>}
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 text-base font-medium text-white bg-emerald-600 rounded-md shadow-sm hover:bg-emerald-700 disabled:bg-gray-400 flex items-center gap-2"
            >
                {isSubmitting ? 'Enviando...' : 'Concluir e Enviar'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default RespondentView;