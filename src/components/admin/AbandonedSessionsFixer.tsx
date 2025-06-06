
import React, { useState } from 'react';
import { quizSessionService } from '@/services/quizSessionService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Check } from 'lucide-react';

export const AbandonedSessionsFixer = () => {
  const { toast } = useToast();
  const [isFixing, setIsFixing] = useState(false);
  const [fixCount, setFixCount] = useState(0);
  const [lastFixed, setLastFixed] = useState<Date | null>(null);
  
  const handleFixSessions = async () => {
    setIsFixing(true);
    try {
      const count = await quizSessionService.runDataFixForAbandonedSessions();
      setFixCount(prevCount => prevCount + count);
      setLastFixed(new Date());
      
      toast({
        title: count > 0 ? 'Sessions fixed successfully' : 'No abandoned sessions found',
        description: count > 0 
          ? `Fixed ${count} abandoned quiz sessions` 
          : 'All sessions are already properly marked as completed',
        variant: count > 0 ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error fixing sessions:', error);
      toast({
        title: 'Error fixing sessions',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Abandoned Quiz Sessions Fixer</CardTitle>
        <CardDescription>
          Fix quiz sessions that were never properly completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This utility will mark all abandoned quiz sessions older than 24 hours as completed.
          This ensures that your progress statistics are accurate.
        </p>
        
        {fixCount > 0 && (
          <div className="p-3 bg-muted/50 rounded-md mb-4">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">
                {fixCount} sessions have been fixed
              </span>
            </div>
            {lastFixed && (
              <div className="text-xs text-muted-foreground mt-1">
                Last fix: {lastFixed.toLocaleString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleFixSessions} 
          disabled={isFixing}
          className="w-full"
        >
          {isFixing ? 'Fixing...' : 'Fix Abandoned Sessions'}
          {!isFixing && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AbandonedSessionsFixer;
