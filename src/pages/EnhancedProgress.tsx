import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trophy, 
  Target, 
  Clock, 
  Brain, 
  Star,
  Zap,
  Award,
  BarChart3,
  Home,
  Play,
  ArrowLeft,
  Timer,
  HelpCircle
} from 'lucide-react';
import { enhancedCharacterProgressService, EnhancedUserKanaProgress, MasteryStats } from '@/services/enhancedCharacterProgressService';
import { characterProgressService } from '@/services/characterProgressService';
import { supabase } from '@/integrations/supabase/client';
import { hiraganaCharacters } from '@/data/hiraganaData';
import { katakanaCharacters } from '@/data/katakanaData';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

interface DatabaseCharacter {
  id: string;
  character: string;
  romaji: string;
  type: string;
  stroke_count: number;
  stroke_order: string[];
  mnemonic?: string;
  examples?: any;
}

const EnhancedProgress: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [progressData, setProgressData] = useState<EnhancedUserKanaProgress[]>([]);
  const [hiraganaStats, setHiraganaStats] = useState<MasteryStats | null>(null);
  const [katakanaStats, setKatakanaStats] = useState<MasteryStats | null>(null);
  const [overallStats, setOverallStats] = useState<MasteryStats | null>(null);
  const [dbCharacters, setDbCharacters] = useState<DatabaseCharacter[]>([]);

  useEffect(() => {
    if (user) {
      loadProgressData();
      loadDatabaseCharacters();
    }
  }, [user]);

  const loadDatabaseCharacters = async () => {
    try {
      const { data: characters, error } = await supabase
        .from('kana_characters')
        .select('*')
        .order('type', { ascending: true });

      if (error) {
        console.error('Error loading database characters:', error);
        return;
      }

      if (characters) {
        setDbCharacters(characters);
      }
    } catch (error) {
      console.error('Error loading database characters:', error);
    }
  };

  const loadProgressData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get basic progress data and transform it to enhanced format
      const basicProgress = await characterProgressService.getCharacterProgress(user.id);
      
      // Transform UserKanaProgress to EnhancedUserKanaProgress
      const enhancedProgress: EnhancedUserKanaProgress[] = basicProgress.map(progress => ({
        ...progress,
        confidence_score: progress.proficiency || 0,
        average_response_time: 2000, // Default response time in ms
        sessions_practiced: Math.max(1, progress.total_practice_count),
        first_seen_at: new Date(progress.created_at || new Date()),
        graduation_date: progress.proficiency >= 90 ? new Date() : null,
        last_mistake_date: progress.mistake_count > 0 ? new Date(progress.updated_at || new Date()) : null,
        similar_character_confusions: {}
      }));
      
      setProgressData(enhancedProgress);

      const hiragana = await enhancedCharacterProgressService.calculateMasteryStats(user.id, 'hiragana');
      const katakana = await enhancedCharacterProgressService.calculateMasteryStats(user.id, 'katakana');
      const overall = await enhancedCharacterProgressService.calculateMasteryStats(user.id);

      setHiraganaStats(hiragana);
      setKatakanaStats(katakana);
      setOverallStats(overall);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMasteryStageColor = (stage: number): string => {
    switch (stage) {
      case 0: return 'bg-green-200'; // Light green
      case 1: return 'bg-gray-300'; // Greyish
      case 2: return 'bg-pink-200'; // Pink
      case 3: return 'bg-blue-200'; // Blueish
      case 4: return 'bg-amber-200'; // Light brown
      case 5: return 'bg-gray-800'; // Black
      default: return 'bg-gray-200';
    }
  };

  const getMasteryStageTextColor = (stage: number): string => {
    switch (stage) {
      case 0: return 'text-green-800';
      case 1: return 'text-gray-700';
      case 2: return 'text-pink-800';
      case 3: return 'text-blue-800';
      case 4: return 'text-amber-800';
      case 5: return 'text-white';
      default: return 'text-gray-700';
    }
  };

  const getMasteryStageLabel = (stage: number): string => {
    switch (stage) {
      case 0: return 'New';
      case 1: return 'Learning';
      case 2: return 'Familiar';
      case 3: return 'Practiced';
      case 4: return 'Reliable';
      case 5: return 'Mastered';
      default: return 'Unknown';
    }
  };

  const getMasteryStageDescription = (stage: number): string => {
    switch (stage) {
      case 0: return 'Character has not been practiced yet or has very limited exposure';
      case 1: return 'Character is being learned with frequent mistakes and slow recognition';
      case 2: return 'Character is somewhat recognized but still requires conscious effort';
      case 3: return 'Character is recognized consistently with occasional hesitation';
      case 4: return 'Character is recognized quickly and accurately most of the time';
      case 5: return 'Character is completely mastered with instant recognition';
      default: return 'Unknown mastery level';
    }
  };

  const getCharacterProgress = (characterId: string): EnhancedUserKanaProgress | null => {
    return progressData.find(p => p.character_id === characterId) || null;
  };

  const getTopPerformers = (): EnhancedUserKanaProgress[] => {
    return [...progressData]
      .filter(p => p.confidence_score > 0)
      .sort((a, b) => b.confidence_score - a.confidence_score)
      .slice(0, 5);
  };

  const getChallengingCharacters = (): EnhancedUserKanaProgress[] => {
    return [...progressData]
      .filter(p => p.total_practice_count > 2 && p.confidence_score < 70)
      .sort((a, b) => a.confidence_score - b.confidence_score)
      .slice(0, 5);
  };

  const getRecentlyPracticed = (): EnhancedUserKanaProgress[] => {
    return [...progressData]
      .sort((a, b) => new Date(b.last_practiced).getTime() - new Date(a.last_practiced).getTime())
      .slice(0, 8);
  };

  const calculateTotalTime = (): number => {
    return progressData.reduce((total, progress) => {
      return total + (progress.average_response_time * progress.total_practice_count);
    }, 0);
  };

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const getCharactersByType = (type: 'hiragana' | 'katakana') => {
    // Combine local data with database characters for comprehensive coverage
    const localCharacters = type === 'hiragana' ? hiraganaCharacters : katakanaCharacters;
    const dbCharsOfType = dbCharacters.filter(char => char.type === type);
    
    // Create a comprehensive character map
    const characterMap = new Map();
    
    // Add all database characters first (they have the authoritative IDs)
    dbCharsOfType.forEach(char => {
      characterMap.set(char.character, {
        id: char.id,
        character: char.character,
        romaji: char.romaji,
        type: char.type,
        source: 'database'
      });
    });
    
    // Add any local characters that might not be in the database yet
    localCharacters.forEach(char => {
      if (!characterMap.has(char.character)) {
        characterMap.set(char.character, {
          id: char.id,
          character: char.character,
          romaji: char.romaji,
          type: char.type,
          source: 'local'
        });
      }
    });
    
    return Array.from(characterMap.values());
  };

  const groupCharactersByType = (characters: any[], type: 'hiragana' | 'katakana') => {
    const groups: {[key: string]: any[]} = {};
    
    characters.forEach(character => {
      let group = 'basic';
      
      // Determine group based on romaji
      if (character.romaji) {
        const romaji = character.romaji.toLowerCase();
        if (['a', 'i', 'u', 'e', 'o'].includes(romaji)) {
          group = 'vowels';
        } else if (romaji.startsWith('k')) {
          group = 'k';
        } else if (romaji.startsWith('s')) {
          group = 's';
        } else if (romaji.startsWith('t')) {
          group = 't';
        } else if (romaji.startsWith('n')) {
          group = 'n';
        } else if (romaji.startsWith('h')) {
          group = 'h';
        } else if (romaji.startsWith('m')) {
          group = 'm';
        } else if (romaji.startsWith('y')) {
          group = 'y';
        } else if (romaji.startsWith('r')) {
          group = 'r';
        } else if (romaji.startsWith('w')) {
          group = 'w';
        } else if (romaji.startsWith('g')) {
          group = 'g';
        } else if (romaji.startsWith('z')) {
          group = 'z';
        } else if (romaji.startsWith('d')) {
          group = 'd';
        } else if (romaji.startsWith('b')) {
          group = 'b';
        } else if (romaji.startsWith('p')) {
          group = 'p';
        } else if (romaji.length > 2) {
          group = 'combinations';
        }
      }
      
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(character);
    });
    
    return groups;
  };

  const getGroupDisplayName = (groupKey: string): string => {
    const groupNames: {[key: string]: string} = {
      'vowels': 'Vowels (あいうえお)',
      'k': 'K-row (かきくけこ)',
      's': 'S-row (さしすせそ)',
      't': 'T-row (たちつてと)',
      'n': 'N-row (なにぬねの)',
      'h': 'H-row (はひふへほ)',
      'm': 'M-row (まみむめも)',
      'y': 'Y-row (やゆよ)',
      'r': 'R-row (らりるれろ)',
      'w': 'W-row (わを)',
      'g': 'G-row (がぎぐげご)',
      'z': 'Z-row (ざじずぜぞ)',
      'd': 'D-row (だぢづでど)',
      'b': 'B-row (ばびぶべぼ)',
      'p': 'P-row (ぱぴぷぺぽ)',
      'combinations': 'Combinations',
      'basic': 'Basic Characters'
    };
    
    return groupNames[groupKey] || groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
  };

  const findProgressForCharacter = (character: any): any => {
    // Try to find progress by database ID first (most reliable)
    const dbProgress = progressData.find(p => p.character_id === character.id);
    if (dbProgress) return dbProgress;
    
    // Fallback: try to match by character content
    return progressData.find(p => {
      const dbChar = dbCharacters.find(db => db.id === p.character_id);
      return dbChar && dbChar.character === character.character;
    });
  };

  const renderCharacterGrid = (characters: any[], type: 'hiragana' | 'katakana') => {
    const groupedCharacters = groupCharactersByType(characters, type);
    const groupOrder = ['vowels', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'g', 'z', 'd', 'b', 'p', 'combinations', 'basic'];
    
    // Filter out groups that have no characters
    const availableGroups = groupOrder.filter(groupKey => 
      groupedCharacters[groupKey] && groupedCharacters[groupKey].length > 0
    );
    
    return (
      <div className="space-y-8">
        {availableGroups.map(groupKey => {
          const groupCharacters = groupedCharacters[groupKey];
          
          return (
            <div key={groupKey} className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  {getGroupDisplayName(groupKey)}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {groupCharacters.length} characters
                </Badge>
              </div>
              
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
                {groupCharacters.map(character => {
                  const progress = findProgressForCharacter(character);
                  const masteryLevel = progress?.mastery_level || 0;
                  const confidenceScore = progress?.confidence_score || progress?.proficiency || 0;
                  const practiceCount = progress?.total_practice_count || 0;
                  
                  return (
                    <div key={`${character.id}-${character.character}`} className="group">
                      <div className="bg-white border-2 rounded-xl p-3 hover:shadow-lg transition-all duration-200 cursor-pointer aspect-square flex flex-col items-center justify-center relative">
                        <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                          {character.character}
                        </div>
                        <div className="text-xs text-gray-500 mb-2 text-center">
                          {character.romaji}
                        </div>
                        
                        {/* Practice count indicator */}
                        {practiceCount > 0 && (
                          <div className="absolute top-1 right-1 text-xs bg-blue-100 text-blue-600 rounded-full px-1">
                            {practiceCount}
                          </div>
                        )}
                        
                        <div className="w-full mb-1">
                          <ProgressIndicator
                            progress={confidenceScore}
                            size="sm"
                            masteryLevel={masteryLevel}
                            showPercentage={false}
                          />
                        </div>
                        
                        <Badge 
                          variant="secondary" 
                          className={`text-xs px-1 py-0 ${getMasteryStageColor(masteryLevel)} ${getMasteryStageTextColor(masteryLevel)}`}
                        >
                          {getMasteryStageLabel(masteryLevel)}
                        </Badge>
                        
                        {/* Confidence score */}
                        {confidenceScore > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {confidenceScore}%
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-softgray via-white to-indigo/5">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5 text-indigo" />
                <span className="text-xl font-montserrat font-bold text-indigo">
                  Nihongo Journey
                </span>
              </Link>
              <Link to="/auth">
                <Button className="bg-indigo hover:bg-indigo/90">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Brain className="mx-auto h-16 w-16 text-indigo mb-4" />
              <h2 className="text-2xl font-bold mb-4">Track Your Progress</h2>
              <p className="text-gray-600 mb-6">
                Sign in to see detailed insights about your Japanese learning journey.
              </p>
              <Link to="/auth">
                <Button className="bg-indigo hover:bg-indigo/90 w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-softgray via-white to-indigo/5">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5 text-indigo" />
                <span className="text-xl font-montserrat font-bold text-indigo">
                  Nihongo Journey
                </span>
              </Link>
              <div className="flex items-center space-x-2">
                <Link to="/quiz">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-1" />
                    Quiz
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <Home className="h-4 w-4 mr-1" />
                    Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your progress...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalTime = calculateTotalTime();
  const totalCharactersPracticed = progressData.filter(p => p.total_practice_count > 0).length;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo/5">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5 text-indigo" />
                <span className="text-xl font-montserrat font-bold text-indigo">
                  Nihongo Journey
                </span>
              </Link>
              <div className="flex items-center space-x-2">
                <Link to="/quiz">
                  <Button variant="outline" size="sm" className="bg-indigo/10 text-indigo border-indigo/20 hover:bg-indigo/20">
                    <Play className="h-4 w-4 mr-1" />
                    Continue Quiz
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <Home className="h-4 w-4 mr-1" />
                    Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo mb-2">Learning Progress</h1>
            <p className="text-lg text-gray-600">Track your Japanese character mastery journey</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-white shadow-sm">
                <TabsTrigger value="overview" className="text-sm font-medium">Overview</TabsTrigger>
                <TabsTrigger value="hiragana" className="text-sm font-medium">Hiragana</TabsTrigger>
                <TabsTrigger value="katakana" className="text-sm font-medium">Katakana</TabsTrigger>
                <TabsTrigger value="insights" className="text-sm font-medium">Insights</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-8">
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Characters</p>
                        <p className="text-3xl font-bold text-blue-900">{overallStats?.total || 0}</p>
                      </div>
                      <Brain className="h-10 w-10 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Mastered</p>
                        <p className="text-3xl font-bold text-green-900">{overallStats?.mastered || 0}</p>
                      </div>
                      <Trophy className="h-10 w-10 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">Confidence</p>
                        <p className="text-3xl font-bold text-purple-900">{overallStats?.averageConfidence || 0}%</p>
                      </div>
                      <Target className="h-10 w-10 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-700">Practice</p>
                        <p className="text-3xl font-bold text-orange-900">
                          {progressData.reduce((sum, p) => sum + p.total_practice_count, 0)}
                        </p>
                      </div>
                      <BarChart3 className="h-10 w-10 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-700">Total Time</p>
                        <p className="text-2xl font-bold text-indigo-900">{formatTime(totalTime)}</p>
                      </div>
                      <Timer className="h-10 w-10 text-indigo-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Session Summary */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Clock className="h-6 w-6 text-indigo" />
                    Practice Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{totalCharactersPracticed}</div>
                    <div className="text-sm text-gray-600">Characters Practiced</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{formatTime(totalTime)}</div>
                    <div className="text-sm text-gray-600">Total Practice Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {totalCharactersPracticed > 0 ? formatTime(totalTime / totalCharactersPracticed) : '0s'}
                    </div>
                    <div className="text-sm text-gray-600">Average Time per Character</div>
                  </div>
                </CardContent>
              </Card>

              {/* Mastery Distribution */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Award className="h-6 w-6 text-indigo" />
                    Mastery Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { stage: 0, label: 'New', count: overallStats?.new || 0, color: 'bg-green-200' },
                    { stage: 1, label: 'Learning', count: overallStats?.learning || 0, color: 'bg-gray-300' },
                    { stage: 2, label: 'Familiar', count: overallStats?.familiar || 0, color: 'bg-pink-200' },
                    { stage: 3, label: 'Practiced', count: overallStats?.practiced || 0, color: 'bg-blue-200' },
                    { stage: 4, label: 'Reliable', count: overallStats?.reliable || 0, color: 'bg-amber-200' },
                    { stage: 5, label: 'Mastered', count: overallStats?.mastered || 0, color: 'bg-gray-800' },
                  ].map(({ stage, label, count, color }) => {
                    const percentage = (count / Math.max(1, overallStats?.total || 1)) * 100;
                    return (
                      <div key={stage} className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 min-w-[140px]">
                          <div className={`w-4 h-4 rounded-full ${color}`}></div>
                          <span className="font-medium text-sm">{label}</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{getMasteryStageDescription(stage)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="flex-1">
                          <Progress value={percentage} className="h-3" />
                        </div>
                        <div className="text-right min-w-[80px]">
                          <span className="font-bold text-lg">{count}</span>
                          <span className="text-sm text-gray-500 ml-1">({Math.round(percentage)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hiragana" className="space-y-6">
              {/* Hiragana Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-matcha/10 to-matcha/20 border-matcha/30">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2 text-matcha">Progress</h3>
                    <div className="text-4xl font-bold text-matcha mb-2">
                      {hiraganaStats?.total || 0}
                    </div>
                    <p className="text-sm text-matcha/70">Characters learned</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2 text-green-700">Mastered</h3>
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {hiraganaStats?.mastered || 0}
                    </div>
                    <p className="text-sm text-green-600">Fully learned</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2 text-blue-700">Confidence</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {hiraganaStats?.averageConfidence || 0}%
                    </div>
                    <p className="text-sm text-blue-600">Average score</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2 text-purple-700">Practice Time</h3>
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {formatTime(progressData
                        .filter(p => {
                          const dbChar = dbCharacters.find(db => db.id === p.character_id);
                          return dbChar && dbChar.type === 'hiragana';
                        })
                        .reduce((total, p) => total + (p.average_response_time * p.total_practice_count), 0)
                      )}
                    </div>
                    <p className="text-sm text-purple-600">Time spent</p>
                  </CardContent>
                </Card>
              </div>

              {/* Hiragana Character Grid */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">あ</span>
                    Hiragana Characters ({getCharactersByType('hiragana').length} total)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderCharacterGrid(getCharactersByType('hiragana'), 'hiragana')}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="katakana" className="space-y-6">
              {/* Katakana Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-vermilion/10 to-vermilion/20 border-vermilion/30">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2 text-vermilion">Progress</h3>
                    <div className="text-4xl font-bold text-vermilion mb-2">
                      {katakanaStats?.total || 0}
                    </div>
                    <p className="text-sm text-vermilion/70">Characters learned</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2 text-green-700">Mastered</h3>
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {katakanaStats?.mastered || 0}
                    </div>
                    <p className="text-sm text-green-600">Fully learned</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2 text-blue-700">Confidence</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {katakanaStats?.averageConfidence || 0}%
                    </div>
                    <p className="text-sm text-blue-600">Average score</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2 text-purple-700">Practice Time</h3>
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {formatTime(progressData
                        .filter(p => {
                          const dbChar = dbCharacters.find(db => db.id === p.character_id);
                          return dbChar && dbChar.type === 'katakana';
                        })
                        .reduce((total, p) => total + (p.average_response_time * p.total_practice_count), 0)
                      )}
                    </div>
                    <p className="text-sm text-purple-600">Time spent</p>
                  </CardContent>
                </Card>
              </div>

              {/* Katakana Character Grid */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">ア</span>
                    Katakana Characters ({getCharactersByType('katakana').length} total)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderCharacterGrid(getCharactersByType('katakana'), 'katakana')}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Performers */}
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-800">
                      <Star className="h-6 w-6 text-yellow-600" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getTopPerformers().map((progress, index) => {
                        const dbCharacter = dbCharacters.find(db => db.id === progress.character_id);
                        const localCharacter = [...hiraganaCharacters, ...katakanaCharacters].find(k => k.id === progress.character_id);
                        const character = dbCharacter || localCharacter;
                        
                        if (!character) return null;
                        
                        return (
                          <div key={progress.character_id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                            <div className="flex items-center gap-4">
                              <div className="text-2xl bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center">
                                {character.character}
                              </div>
                              <div>
                                <div className="font-semibold text-lg">{character.romaji}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  {getMasteryStageLabel(progress.mastery_level)}
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <HelpCircle className="h-3 w-3 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">{getMasteryStageDescription(progress.mastery_level)}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-2xl text-green-600">{progress.confidence_score}%</div>
                              <div className="text-xs text-gray-500">
                                {progress.total_practice_count} practices
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Challenging Characters */}
                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <Zap className="h-6 w-6 text-red-600" />
                      Needs Practice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getChallengingCharacters().map((progress, index) => {
                        const dbCharacter = dbCharacters.find(db => db.id === progress.character_id);
                        const localCharacter = [...hiraganaCharacters, ...katakanaCharacters].find(k => k.id === progress.character_id);
                        const character = dbCharacter || localCharacter;
                        
                        if (!character) return null;
                        
                        return (
                          <div key={progress.character_id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                            <div className="flex items-center gap-4">
                              <div className="text-2xl bg-red-100 rounded-full w-12 h-12 flex items-center justify-center">
                                {character.character}
                              </div>
                              <div>
                                <div className="font-semibold text-lg">{character.romaji}</div>
                                <div className="text-sm text-gray-500">
                                  {progress.mistake_count} mistakes
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-2xl text-red-600">{progress.confidence_score}%</div>
                              <div className="text-xs text-gray-500">
                                {progress.total_practice_count} practices
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                    {getRecentlyPracticed().map((progress, index) => {
                      const dbCharacter = dbCharacters.find(db => db.id === progress.character_id);
                      const localCharacter = [...hiraganaCharacters, ...katakanaCharacters].find(k => k.id === progress.character_id);
                      const character = dbCharacter || localCharacter;
                      
                      if (!character) return null;
                      
                      return (
                        <div key={progress.character_id} className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                          <div className="text-3xl mb-2">{character.character}</div>
                          <div className="font-medium text-sm">{character.romaji}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(progress.last_practiced).toLocaleDateString()}
                          </div>
                          <div className="mt-3">
                            <ProgressIndicator
                              progress={progress.confidence_score}
                              size="sm"
                              masteryLevel={progress.mastery_level}
                              showPercentage={false}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatTime(progress.average_response_time)} avg
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EnhancedProgress;
