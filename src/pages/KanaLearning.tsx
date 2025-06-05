import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Award, TrendingUp, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserKanaProgress from '@/components/kana/UserKanaProgress';
import { useAuth } from '@/contexts/AuthContext';

const KanaLearning: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            <BookOpen className="mr-2 h-5 w-5 inline-block" />
            Kana Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <Tabs defaultvalue="hiragana" className="space-y-4">
              <TabsList>
                <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
                <TabsTrigger value="katakana">Katakana</TabsTrigger>
              </TabsList>
              <TabsContent value="hiragana">
                <UserKanaProgress kanaType="hiragana" />
              </TabsContent>
              <TabsContent value="katakana">
                <UserKanaProgress kanaType="katakana" />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">Please sign in to track your progress.</p>
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KanaLearning;
