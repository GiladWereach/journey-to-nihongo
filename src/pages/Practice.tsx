import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { characterProgressService } from '@/services/characterProgressService';
import { practicePageViewed } from '@/lib/analytics-generated';

// Track practice_page_viewed
practicePageViewed();
const Practice = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('writing');

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to access practice modes.",
      });
    }
  }, [user, toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Practice Modes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="writing" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="writing">Writing Practice</TabsTrigger>
              <TabsTrigger value="recognition">Recognition Practice</TabsTrigger>
            </TabsList>
            <TabsContent value="writing">
              <div>
                <h2 className="text-xl font-semibold mb-4">Writing Practice</h2>
                <p>Improve your ability to write kana characters from memory.</p>
                <Button>Start Writing Practice</Button>
              </div>
            </TabsContent>
            <TabsContent value="recognition">
              <div>
                <h2 className="text-xl font-semibold mb-4">Recognition Practice</h2>
                <p>Test your ability to recognize kana characters.</p>
                <Button>Start Recognition Practice</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Practice;
