
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface StudySession {
  id: string;
  user_id: string;
  module: string;
  topics: string[];
  duration_minutes: number;
  session_date: string;
  completed: boolean;
  performance_score?: number;
  created_at?: string;
}

interface StudySessionsListProps {
  studySessions: StudySession[];
  loading: boolean;
}

const StudySessionsList: React.FC<StudySessionsListProps> = ({
  studySessions,
  loading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Study History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo"></div>
          </div>
        ) : studySessions.length > 0 ? (
          <div className="space-y-4">
            {studySessions.map(session => (
              <div key={session.id} className="border-b pb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{session.module}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(session.created_at || '').toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {session.topics.join(', ')}
                  </span>
                  <span className="text-sm">{session.duration_minutes} minutes</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No study sessions recorded yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudySessionsList;
