import React, { useMemo } from 'react';
import { Question } from '../types';
import { ALL_QUESTIONS } from '../data/questions';

interface QuestionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQuestions: string[];
  onSave: (selectedIds: string[]) => void;
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({ isOpen, onClose, selectedQuestions, onSave }) => {
  const [currentSelection, setCurrentSelection] = React.useState<string[]>(selectedQuestions);

  React.useEffect(() => {
    setCurrentSelection(selectedQuestions);
  }, [selectedQuestions, isOpen]);

  const groupedQuestions = useMemo(() => {
    return ALL_QUESTIONS.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(question);
      return acc;
    }, {} as Record<string, Question[]>);
  }, []);

  const handleToggleQuestion = (questionId: string) => {
    setCurrentSelection(prev =>
      prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
    );
  };
  
  const handleSelectCategory = (category: string, select: boolean) => {
    const categoryQuestionIds = groupedQuestions[category].map(q => q.id);
    if (select) {
        setCurrentSelection(prev => [...new Set([...prev, ...categoryQuestionIds])]);
    } else {
        setCurrentSelection(prev => prev.filter(id => !categoryQuestionIds.includes(id)));
    }
  }

  const handleSave = () => {
    onSave(currentSelection);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">Selecionar Perguntas</h2>
          <p className="text-sm text-gray-500 mt-1">Escolha as perguntas a serem enviadas para este ponto focal.</p>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="space-y-6">
            {Object.entries(groupedQuestions).map(([category, questions]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-emerald-700">{category}</h3>
                    <div>
                        <button onClick={() => handleSelectCategory(category, true)} className="text-xs font-medium text-emerald-600 hover:underline mr-2">Selecionar todos</button>
                        <button onClick={() => handleSelectCategory(category, false)} className="text-xs font-medium text-red-600 hover:underline">Limpar</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  {questions.map(question => (
                    <label key={question.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentSelection.includes(question.id)}
                        onChange={() => handleToggleQuestion(question.id)}
                        className="h-5 w-5 mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">
                        <strong className="font-mono">{question.code}{question.number > 0 ? question.number : ''}:</strong> {question.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t flex justify-end space-x-3">
          <button onClick={onClose} className="px-6 py-2 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-6 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
            Salvar Seleção
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionSelector;