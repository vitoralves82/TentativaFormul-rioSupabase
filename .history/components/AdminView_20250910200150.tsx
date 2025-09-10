import React, { useState, useCallback } from 'react';
import { Recipient } from '../types';
import QuestionSelector from './QuestionSelector';
import { supabaseService } from '../services/supabaseService';
import { UserPlusIcon, TrashIcon, PencilSquareIcon, CheckCircleIcon } from './icons';

interface AdminViewProps {
    onProjectCreate: (data: { projectName: string, clientName: string, recipients: Recipient[] }) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onProjectCreate }) => {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [editingRecipientId, setEditingRecipientId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const addRecipient = () => {
    setRecipients([
      ...recipients,
      { id: Date.now().toString(), name: '', role: '', email: '', selectedQuestions: [] },
    ]);
  };

  const updateRecipient = (id: string, field: keyof Recipient, value: any) => {
    setRecipients(
      recipients.map(r => (r.id === id ? { ...r, [field]: value } : r))
    );
  };
  
  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const openQuestionSelector = (id: string) => {
    setEditingRecipientId(id);
    setIsSelectorOpen(true);
  };
  
  const handleSaveQuestions = (selectedIds: string[]) => {
    if (editingRecipientId) {
      updateRecipient(editingRecipientId, 'selectedQuestions', selectedIds);
    }
  };

  const handleSaveAndSend = async () => {
      setIsSubmitting(true);
      setSubmissionStatus('idle');
      try {
          await supabaseService.saveProjectData({ projectName, clientName, recipients });

          recipients.forEach(recipient => {
              const subject = `Formulário do Projeto: ${projectName}`;
              const body = `Olá ${recipient.name},\n\nPor favor, preencha o formulário para o projeto "${projectName}".\n\nAcesse o link abaixo para responder às perguntas designadas a você:\n${window.location.origin}/#/?respondentId=${recipient.id}\n\nObrigado,\nEquipe EnvironPact`;
              const mailtoLink = `mailto:${recipient.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              window.open(mailtoLink, '_self');
          });

          onProjectCreate({ projectName, clientName, recipients });
          setSubmissionStatus('success');
          
      } catch (error) {
          console.error("Erro ao salvar e enviar:", error);
          setSubmissionStatus('error');
      } finally {
          setIsSubmitting(false);
      }
  };


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Etapa 1: Definição do Projeto */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">Etapa 1: Definição do projeto e dos pontos focais</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Nome do projeto</label>
              <input type="text" id="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"/>
            </div>
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Nome do cliente</label>
              <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"/>
            </div>
          </div>
        </div>

        {/* Etapa 2: Pontos Focais e Perguntas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">Etapa 2: Pontos Focais (Destinatários) e Perguntas</h2>
                <button onClick={addRecipient} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                    <UserPlusIcon className="w-5 h-5" />
                    Adicionar Ponto Focal
                </button>
            </div>
          
            <div className="mt-6 space-y-4">
            {recipients.map((recipient) => (
              <div key={recipient.id} className="p-5 border-2 border-dashed rounded-lg bg-gray-50/70">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  <div>
                    <label htmlFor={`recipient-name-${recipient.id}`} className="block text-sm font-medium text-gray-700 mb-1">Nome do Ponto Focal</label>
                    <input type="text" id={`recipient-name-${recipient.id}`} placeholder="Nome completo" value={recipient.name} onChange={e => updateRecipient(recipient.id, 'name', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"/>
                  </div>
                  <div>
                    <label htmlFor={`recipient-role-${recipient.id}`} className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                    <input type="text" id={`recipient-role-${recipient.id}`} placeholder="Cargo do ponto focal" value={recipient.role} onChange={e => updateRecipient(recipient.id, 'role', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"/>
                  </div>
                  <div>
                    <label htmlFor={`recipient-email-${recipient.id}`} className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input type="email" id={`recipient-email-${recipient.id}`} placeholder="email@cliente.com" value={recipient.email} onChange={e => updateRecipient(recipient.id, 'email', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"/>
                  </div>
                </div>
                <div className="mt-5 flex justify-between items-center">
                    <button onClick={() => openQuestionSelector(recipient.id)} className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900">
                        <PencilSquareIcon className="w-5 h-5" />
                        Selecionar Perguntas ({recipient.selectedQuestions.length} selecionadas)
                    </button>
                    <button onClick={() => removeRecipient(recipient.id)} className="text-red-600 hover:text-red-800">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
              </div>
            ))}
            {recipients.length === 0 && (
                <div className="text-center text-gray-500 py-6 border-2 border-dashed rounded-lg">
                    <p>Nenhum ponto focal adicionado.</p>
                    <p className="text-sm mt-1">Clique em "Adicionar Ponto Focal" para começar.</p>
                </div>
            )}
          </div>
        </div>
        
        {/* Ação Final */}
        <div className="flex justify-end items-center gap-4">
            {submissionStatus === 'success' && <div className="text-green-600 flex items-center gap-2"><CheckCircleIcon className="w-5 h-5"/> E-mails gerados e dados salvos!</div>}
            {submissionStatus === 'error' && <div className="text-red-600">Ocorreu um erro.</div>}
            <button
                onClick={handleSaveAndSend}
                disabled={!projectName || !clientName || recipients.length === 0 || recipients.some(r => !r.name || !r.email) || isSubmitting}
                className="px-6 py-3 text-base font-medium text-white bg-emerald-600 rounded-md shadow-sm hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {isSubmitting ? 'Salvando...' : 'Salvar e Enviar E-mails'}
            </button>
        </div>
      </div>

      {editingRecipientId && (
        <QuestionSelector
          isOpen={isSelectorOpen}
          onClose={() => setIsSelectorOpen(false)}
          selectedQuestions={recipients.find(r => r.id === editingRecipientId)?.selectedQuestions || []}
          onSave={handleSaveQuestions}
        />
      )}
    </div>
  );
};

export default AdminView;