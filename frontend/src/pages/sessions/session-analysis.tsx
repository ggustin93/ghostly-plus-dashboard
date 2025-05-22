import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RehabilitationSession, GameSession } from '@/types/session';
import { Patient } from '@/types/patient';
import { getSessionById } from '@/data/sessions-data';
import { mockPatients } from '@/data/patients-data';
import { generateGameSpecificEMGData } from '@/utils/emgDataGenerator';

import SessionAnalysisHeader from '@/components/sessions/session-analysis-header';
import GameSessionNavigator from '@/components/sessions/game-session-navigator';
import GameSessionTabs from '@/components/sessions/game-session-tabs';

export default function SessionAnalysis() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetGameSessionId = searchParams.get('gameSessionId');
  
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
          // If targetGameSessionId is provided, try to select that specific game session
          if (targetGameSessionId) {
            const targetGameSession = foundSession.gameSessions.find(
              gs => gs.id === targetGameSessionId
            );
            if (targetGameSession) {
              setSelectedGameSession(targetGameSession);
            } else {
              // If target game session not found, fall back to first session
              setSelectedGameSession(foundSession.gameSessions[0]);
              // Optionally clear the invalid gameSessionId from URL
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.delete('gameSessionId');
              setSearchParams(newSearchParams, { replace: true });
            }
          } else {
            // No target specified, select first game session
            setSelectedGameSession(foundSession.gameSessions[0]);
          }
        }
      } else {
        setPatient(null);
      }
    }
    setLoading(false);
  }, [sessionId, targetGameSessionId, searchParams, setSearchParams]);

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
    
    const newGameSession = session.gameSessions[newIndex];
    setSelectedGameSession(newGameSession);
    
    // Update URL to reflect the new selected game session
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('gameSessionId', newGameSession.id);
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleSelectGameSession = (gameSession: GameSession | null) => {
    setSelectedGameSession(gameSession);
    
    // Update URL to reflect the selected game session
    if (gameSession) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('gameSessionId', gameSession.id);
      setSearchParams(newSearchParams, { replace: true });
    } else {
      // If no game session selected, remove from URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('gameSessionId');
      setSearchParams(newSearchParams, { replace: true });
    }
  };

  // Returns conditionnels APRÈS tous les hooks
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading session analysis...</p>
        </div>
      </div>
    );
  }

  if (!session || !patient) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Session Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              The requested session could not be found. Please check the session ID and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mvcPercentage = selectedGameSession?.metrics?.peakContraction || 0;
  const symmetryScore = selectedGameSession?.metrics?.symmetryScore ? selectedGameSession.metrics.symmetryScore * 100 : 0;
  const engagementScore = selectedGameSession?.statistics?.engagementScore || 0;

  const handleExport = () => {
    // Placeholder for export functionality
    console.log(`Exporting data for session ${session?.id} of patient ${patient?.name}`);
    // Implement actual export logic here (e.g., generate PDF, CSV)
  };

  return (
    <div className="space-y-6">
      <SessionAnalysisHeader patient={patient} session={session} onExport={handleExport} />

      <GameSessionNavigator
        gameSessions={session.gameSessions}
        selectedGameSession={selectedGameSession}
        onSelectGameSession={handleSelectGameSession}
        onNavigateGameSession={navigateGameSession}
      />

      {selectedGameSession ? (
        <>
          <GameSessionTabs
            selectedGameSession={selectedGameSession}
            emgTimeSeriesData={emgTimeSeriesData}
            mvcPercentage={mvcPercentage}
            symmetryScore={symmetryScore}
            engagementScore={engagementScore}
          />
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Game Sessions Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This rehabilitation session does not have any game sessions recorded yet.
              {session.status === 'scheduled' && (
                <span className="block mt-2 text-sm">
                  This session is scheduled but has not been completed.
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}