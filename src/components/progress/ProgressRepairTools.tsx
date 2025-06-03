
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Wrench, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { kanaService } from '@/services/kanaService';
import { characterProgressService } from '@/services/characterProgressService';

interface ProgressRepairToolsProps {
  onRepairComplete?: () => void;
}

const ProgressRepairTools: React.FC<ProgressRepairToolsProps> = ({ onRepairComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRepairing, setIsRepairing] = useState(false);
  const [repairStatus, setRepairStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [repairDetails, setRepairDetails] = useState<string[]>([]);
  
  const handleRepairProgress = async () => {
    if (!user) return;
    
    setIsRepairing(true);
    setRepairStatus('running');
    setRepairDetails([]);
    
    try {
      addRepairDetail('Starting progress data repair...');
      
      // 1. Check for kana_learning_sessions
      const { data: sessions, error: sessionError } = await supabase
        .from('kana_learning_sessions')
        .select('id, completed')
        .eq('user_id', user.id);
        
      if (sessionError) {
        addRepairDetail('⚠️ Error checking learning sessions: ' + sessionError.message);
      } else {
        addRepairDetail(`Found ${sessions.length} learning sessions`);
        
        const completedSessions = sessions.filter(s => s.completed);
        addRepairDetail(`- ${completedSessions.length} completed sessions`);
        
        const incompleteSessions = sessions.filter(s => !s.completed);
        if (incompleteSessions.length > 0) {
          addRepairDetail(`- ${incompleteSessions.length} incomplete sessions - attempting to complete them`);
          
          for (const session of incompleteSessions) {
            // Complete any incomplete sessions
            await supabase
              .from('kana_learning_sessions')
              .update({ 
                completed: true,
                end_time: new Date().toISOString()
              })
              .eq('id', session.id);
          }
          
          addRepairDetail('✅ Marked incomplete sessions as completed');
        }
      }
      
      // 2. Check for user_kana_progress entries
      const { data: progressEntries, error: progressError } = await supabase
        .from('user_kana_progress')
        .select('id, proficiency, character_id')
        .eq('user_id', user.id);
        
      if (progressError) {
        addRepairDetail('⚠️ Error checking progress entries: ' + progressError.message);
      } else {
        addRepairDetail(`Found ${progressEntries.length} progress entries`);
        
        // Create missing progress entries for all characters
        const allCharacters = kanaService.getAllKana();
        let missingCount = 0;
        
        for (const character of allCharacters) {
          const hasProgress = progressEntries.some(p => p.character_id === character.id);
          
          if (!hasProgress) {
            await characterProgressService.updateCharacterProgress(user.id, character.id, false);
            missingCount++;
          }
        }
        
        if (missingCount > 0) {
          addRepairDetail(`✅ Created ${missingCount} missing progress entries`);
        } else {
          addRepairDetail('✅ All characters already have progress entries');
        }
      }
      
      addRepairDetail('✅ Repair process completed');
      setRepairStatus('completed');
      
      toast({
        title: "Progress data repaired",
        description: "Your progress data has been repaired. Please refresh the page to see the changes.",
        variant: "default",
      });
      
      // Notify parent component that repair is complete
      if (onRepairComplete) {
        onRepairComplete();
      }
    } catch (error) {
      console.error('Error in handleRepairProgress:', error);
      addRepairDetail(`❌ Error during repair: ${error}`);
      setRepairStatus('failed');
      
      toast({
        title: "Repair failed",
        description: "There was an error repairing your progress data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRepairing(false);
    }
  };
  
  const addRepairDetail = (detail: string) => {
    console.log(detail);
    setRepairDetails(prev => [...prev, detail]);
  };
  
  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-amber-800">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Progress Data Diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-amber-700 mb-4">
          <p>
            It appears your progress data may be incomplete or missing. This can happen if:
          </p>
          <ul className="list-disc pl-5 my-2 space-y-1">
            <li>You haven't completed any learning activities yet</li>
            <li>A previous activity wasn't properly recorded</li>
            <li>There was a database connectivity issue</li>
          </ul>
          <p>
            You can try the repair tool below to fix common issues with progress data.
          </p>
        </div>
        
        {repairStatus === 'idle' ? (
          <Button 
            onClick={handleRepairProgress}
            className="bg-amber-600 hover:bg-amber-700 text-white"
            disabled={isRepairing}
          >
            <Wrench className="mr-2 h-4 w-4" />
            Repair Progress Data
          </Button>
        ) : repairStatus === 'running' ? (
          <div className="space-y-4">
            <div className="flex items-center text-amber-800">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Repairing progress data...
            </div>
            <div className="bg-amber-100 p-3 rounded-md text-xs font-mono h-40 overflow-y-auto">
              {repairDetails.map((detail, index) => (
                <div key={index} className="py-0.5">{detail}</div>
              ))}
            </div>
          </div>
        ) : repairStatus === 'completed' ? (
          <div className="space-y-4">
            <div className="flex items-center text-green-600">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Repair completed successfully!
            </div>
            <div className="bg-amber-100 p-3 rounded-md text-xs font-mono h-40 overflow-y-auto">
              {repairDetails.map((detail, index) => (
                <div key={index} className="py-0.5">{detail}</div>
              ))}
            </div>
            <Button 
              onClick={onRepairComplete} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Repair failed
            </div>
            <div className="bg-amber-100 p-3 rounded-md text-xs font-mono h-40 overflow-y-auto text-red-800">
              {repairDetails.map((detail, index) => (
                <div key={index} className="py-0.5">{detail}</div>
              ))}
            </div>
            <Button 
              onClick={handleRepairProgress}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressRepairTools;
