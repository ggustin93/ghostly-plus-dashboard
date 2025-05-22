import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RehabilitationSession, GameSession } from '@/types/session';
import { Patient } from '@/types/patient';
import { getSessionById } from '@/data/sessions-data';
import { mockPatients } from '@/data/patients-data';
import { generateGameSpecificEMGData } from '@/utils/emgDataGenerator'; // Import sans .ts

import SessionAnalysisHeader from '@/components/sessions/session-analysis-header';
import GameSessionNavigator from '@/components/sessions/game-session-navigator';
import GameSessionTabs from '@/components/sessions/game-session-tabs';

export default function SessionAnalysis() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<RehabilitationSession | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [selectedGameSession, setSelectedGameSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Tous les hooks doivent être appelés AVANT les returns conditionnels
  const emgTimeSeriesData = useMemo(() => {
    if (selectedGameSession) {
      return generateGameSpecificEMGData(selectedGameSession.gameType);
    }
    return [];
  }, [selectedGameSession?.id]); // Se régénère seulement quand la session change

  useEffect(() => {
    if (sessionId) {
      const foundSession = getSessionById(sessionId) || null;
      setSession(foundSession);
      
      if (foundSession) {
        const foundPatient = mockPatients.find(p => p.id === foundSession.patientId) || null;
        setPatient(foundPatient);
        
        if (foundSession.gameSessions.length > 0) {
          setSelectedGameSession(foundSession.gameSessions[0]);
        }
      } else {
        setPatient(null);
      }
    }
    setLoading(false);
  }, [sessionId]);

  const navigateGameSession = (direction: 'prev' | 'next') => {
    if (!session || !selectedGameSession || session.gameSessions.length <= 1) return;
    
    const currentIndex = session.gameSessions.findIndex(gs => gs.id === selectedGameSession.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? session.gameSessions.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === session.gameSessions.length - 1 ? 0 : currentIndex + 1;
    }
    setSelectedGameSession(session.gameSessions[newIndex]);
  };

  const handleSelectGameSession = (gameSession: GameSession | null) => {
    setSelectedGameSession(gameSession);
  };

  // Returns conditionnels APRÈS tous les hooks
  if (loading) {
    return <div>Loading session analysis...</div>;
  }

  if (!session || !patient) {
    return <div>Session or patient not found</div>;
  }

  const mvcPercentage = selectedGameSession?.metrics?.peakContraction || 0;
  const symmetryScore = selectedGameSession?.metrics?.symmetryScore ? selectedGameSession.metrics.symmetryScore * 100 : 0;
  const engagementScore = selectedGameSession?.statistics?.engagementScore || 0;

  return (
    <div className="space-y-6">
      <SessionAnalysisHeader patient={patient} session={session} />

      <GameSessionNavigator
        gameSessions={session.gameSessions}
        selectedGameSession={selectedGameSession}
        onSelectGameSession={handleSelectGameSession}
        onNavigateGameSession={navigateGameSession}
      />

      {selectedGameSession ? (
        <GameSessionTabs
          selectedGameSession={selectedGameSession}
          emgTimeSeriesData={emgTimeSeriesData}
          mvcPercentage={mvcPercentage}
          symmetryScore={symmetryScore}
          engagementScore={engagementScore}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Game Sessions Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This rehabilitation session does not have any game sessions recorded yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}