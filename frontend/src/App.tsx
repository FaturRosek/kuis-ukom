import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SoloSetupView } from './components/SoloSetupView';
import { SoloGameView } from './components/SoloGameView';
import { SoloResultView } from './components/SoloResultView';
import { SoloReviewView } from './components/SoloReviewView';
import { MultiplayerView } from './components/MultiplayerView';
import { QuestionBankView } from './components/QuestionBankView';
import { ImportView } from './components/ImportView';
import { HistoryView } from './components/HistoryView';
import { api } from './services/api';
import { SoloSession, SoloQuestionClientView, SessionResultSummary } from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');

  
  const [activeSoloSession, setActiveSoloSession] = useState<SoloSession | null>(null);
  const [firstQuestion, setFirstQuestion] = useState<SoloQuestionClientView | null>(null);
  const [currentPlayerName, setCurrentPlayerName] = useState<string>('Peserta');
  const [sessionSummary, setSessionSummary] = useState<SessionResultSummary | null>(null);
  const [reviewSessionId, setReviewSessionId] = useState<string | null>(null);

  
  const handleStartSoloSession = async (
    questionSetId: string,
    durationSeconds: number,
    playerName: string
  ) => {
    try {
      const { session, firstQuestion } = await api.startSoloSession(
        questionSetId,
        durationSeconds,
        playerName
      );
      setActiveSoloSession(session);
      setFirstQuestion(firstQuestion);
      setCurrentPlayerName(playerName);
      setCurrentTab('solo-play');
    } catch (err: any) {
      alert(`Gagal memulai sesi: ${err.message}`);
    }
  };

  // Finish solo session
  const handleFinishSoloSession = async (sessionId: string) => {
    try {
      const summary = await api.finishSoloSession(sessionId, currentPlayerName);
      setSessionSummary(summary);
      setCurrentTab('solo-result');
    } catch (err: any) {
      alert(`Gagal menyelesaikan sesi: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      <Navbar currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />

      <main className="main-content">
        {currentTab === 'home' && (
          <SoloSetupView
            onStartSession={handleStartSoloSession}
            onGoToMultiplayer={() => setCurrentTab('multiplayer')}
          />
        )}

        {currentTab === 'solo-play' && activeSoloSession && firstQuestion && (
          <SoloGameView
            session={activeSoloSession}
            initialQuestion={firstQuestion}
            playerName={currentPlayerName}
            onFinish={handleFinishSoloSession}
            onQuit={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'solo-result' && sessionSummary && (
          <SoloResultView
            summary={sessionSummary}
            onReview={() => {
              setReviewSessionId(sessionSummary.sessionId);
              setCurrentTab('solo-review');
            }}
            onRetry={() => setCurrentTab('home')}
            onHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'solo-review' && reviewSessionId && (
          <SoloReviewView
            sessionId={reviewSessionId}
            onBack={() => setCurrentTab(sessionSummary ? 'solo-result' : 'history')}
          />
        )}

        {currentTab === 'multiplayer' && (
          <MultiplayerView onHome={() => setCurrentTab('home')} />
        )}

        {currentTab === 'bank-soal' && <QuestionBankView />}

        {currentTab === 'import' && (
          <ImportView onSuccess={() => setCurrentTab('bank-soal')} />
        )}

        {currentTab === 'history' && (
          <HistoryView
            onReviewSession={(sid) => {
              setReviewSessionId(sid);
              setCurrentTab('solo-review');
            }}
          />
        )}
      </main>
    </div>
  );
};

export default App;
