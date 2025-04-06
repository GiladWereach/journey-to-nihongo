
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { progressTrackingService } from '@/services/progressTrackingService';
import { RefreshCw, Wrench, AlertTriangle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgressRepairToolsProps {
  onRepairComplete: () => void;
}

const ProgressRepairTools: React.FC<ProgressRepairToolsProps> = ({ onRepairComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [repairing, setRepairing] = useState(false);
  
  const handleRepairProgress = async () => {
    if (!user) return;
    
    setRepairing(true);
    toast({
      title: "Repairing progress data",
      description: "This may take a moment...",
    });
    
    try {
      // Repair streak data
      const repairResult = await progressTrackingService.repairUserStreakData(user.id);
      
      if (repairResult) {
        toast({
          title: "Progress data repaired",
          description: "Your learning data has been repaired successfully. Please refresh the page to see the updates.",
          variant: "default",
        });
      } else {
        toast({
          title: "Repair incomplete",
          description: "Not all data could be repaired. Please try again.",
          variant: "destructive",
        });
      }
      
      // Notify parent to refresh data
      onRepairComplete();
    } catch (error) {
      console.error('Error repairing progress data:', error);
      toast({
        title: "Error repairing data",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRepairing(false);
    }
  };
  
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-orange-700">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Progress Data Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-orange-700 mb-4">
          If your progress data doesn't seem to be updating correctly, you can use this tool to repair your learning history.
        </p>
        <Button 
          onClick={handleRepairProgress}
          disabled={repairing}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
        >
          {repairing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Repairing...
            </>
          ) : (
            <>
              <Wrench className="mr-2 h-4 w-4" />
              Repair Progress Data
            </>
          )}
        </Button>
        <p className="text-xs text-orange-600 mt-2">
          This will analyze your study sessions and rebuild your progress statistics.
        </p>
      </CardContent>
    </Card>
  );
};

export default ProgressRepairTools;
