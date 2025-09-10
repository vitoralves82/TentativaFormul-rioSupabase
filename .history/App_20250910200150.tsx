import React, { useState } from 'react';
import Header from './components/Header';
import AdminView from './components/AdminView';
import RespondentView from './components/RespondentView';
import { ViewMode, Recipient } from './types';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('admin');
  const [projectDataForPreview, setProjectDataForPreview] = useState<{
      projectName: string;
      clientName: string;
      recipients: Recipient[];
  } | null>(null);

  const handleProjectCreate = (data: { projectName: string, clientName: string, recipients: Recipient[] }) => {
    setProjectDataForPreview(data);
  };
  
  const respondentPreviewData = projectDataForPreview && projectDataForPreview.recipients.length > 0
    ? {
        projectName: projectDataForPreview.projectName,
        recipient: projectDataForPreview.recipients[0],
      }
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        viewMode={viewMode} 
        onViewChange={setViewMode} 
        isRespondentPreviewable={!!respondentPreviewData}
      />
      <main>
        {viewMode === 'admin' ? (
          <AdminView onProjectCreate={handleProjectCreate} />
        ) : (
          <RespondentView respondentData={respondentPreviewData} />
        )}
      </main>
    </div>
  );
};

export default App;