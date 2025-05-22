import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GameSession } from '@/types/session';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect } from 'react';

interface GameSessionNavigatorProps {
  gameSessions: GameSession[];
  selectedGameSession: GameSession | null;
  onSelectGameSession: (gameSession: GameSession | null) => void;
  onNavigateGameSession: (direction: 'prev' | 'next') => void;
}

export default function GameSessionNavigator({
  gameSessions,
  selectedGameSession,
  onSelectGameSession,
  onNavigateGameSession,
}: GameSessionNavigatorProps) {
  
  // Helper function to get current session position
  const getCurrentSessionInfo = () => {
    if (!selectedGameSession) return null;
    
    const currentIndex = gameSessions.findIndex(gs => gs.id === selectedGameSession.id);
    if (currentIndex === -1) return null;
    
    return {
      position: currentIndex + 1,
      total: gameSessions.length,
      isFirst: currentIndex === 0,
      isLast: currentIndex === gameSessions.length - 1
    };
  };

  const currentInfo = getCurrentSessionInfo();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameSessions.length <= 1) return;

      if (event.key === 'ArrowLeft') {
        if (currentInfo && !currentInfo.isFirst) {
          onNavigateGameSession('prev');
        }
      } else if (event.key === 'ArrowRight') {
        if (currentInfo && !currentInfo.isLast) {
          onNavigateGameSession('next');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNavigateGameSession, gameSessions.length, currentInfo]);

  if (gameSessions.length === 0) {
    return null;
  }
  
  // Format session display text
  const formatSessionText = (gs: GameSession, index: number) => {
    return `Round ${index + 1} - ${gs.gameType}`;
  };

  return (
    <Card tabIndex={0} aria-label="Game Session Navigator">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-medium">Game Sessions</CardTitle>
            {currentInfo && (
              <Badge variant="outline" className="text-xs bg-blue-100 text-gray-800">
                {currentInfo.position} of {currentInfo.total} rounds
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigateGameSession('prev')}
            disabled={gameSessions.length <= 1 || !!currentInfo?.isFirst}
            title={currentInfo?.isFirst ? "Already at first session" : "Previous session"}
          >
            <span className="inline-flex items-center justify-center">
              <ChevronLeft className="h-5 w-5" />
            </span>
          </Button>

          <div className="flex-1 mx-4">
            <Select
              value={selectedGameSession?.id}
              onValueChange={(value) => {
                const gs = gameSessions.find((g) => g.id === value);
                if (gs) onSelectGameSession(gs);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select game session" />
              </SelectTrigger>
              <SelectContent>
                {gameSessions.map((gs, index) => (
                  <SelectItem key={gs.id} value={gs.id}>
                    {formatSessionText(gs, index)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigateGameSession('next')}
            disabled={gameSessions.length <= 1 || !!currentInfo?.isLast}
            title={currentInfo?.isLast ? "Already at last session" : "Next session"}
          >
            <span className="inline-flex items-center justify-center">
              <ChevronRight className="h-5 w-5" />
            </span>
          </Button>
        </div>
       
      </CardContent>
    </Card>
  );
}