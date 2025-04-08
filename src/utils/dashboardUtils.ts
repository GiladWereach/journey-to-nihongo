
import { StudySession, ContinueLearningData } from '@/types/dashboard';
import { Profile } from '@/types/kana';

/**
 * Calculates the current learning streak based on study sessions
 */
export const calculateStreak = (studySessions: StudySession[]): number => {
  if (studySessions.length === 0) return 0;
  
  const sortedSessions = [...studySessions].sort((a, b) => 
    new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
  );
  
  const uniqueDates = new Set(
    sortedSessions.map(session => 
      new Date(session.created_at || '').toISOString().split('T')[0]
    )
  );
  
  const dateArray = Array.from(uniqueDates);
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (dateArray[0] !== today && dateArray[0] !== yesterday) {
    return 0;
  }
  
  let streak = 1;
  for (let i = 1; i < dateArray.length; i++) {
    const current = new Date(dateArray[i-1]);
    const prev = new Date(dateArray[i]);
    
    const diffDays = Math.round((current.getTime() - prev.getTime()) / 86400000);
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Calculates the total study time from study sessions in the past week
 */
export const calculateTotalStudyTimeInPastWeek = (studySessions: StudySession[]): number => {
  return studySessions
    .filter(session => {
      const sessionDate = new Date(session.created_at || '');
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return sessionDate >= oneWeekAgo;
    })
    .reduce((sum, session) => {
      return sum + session.duration_minutes;
    }, 0);
};

/**
 * Determines the recommended next module based on user progress
 */
export const determineRecommendedNextModule = (
  profile: Profile | null,
  settings: any | null,
  hiraganaStats: { learned: number; total: number },
  katakanaStats: { learned: number; total: number },
  showAssessmentPrompt: boolean
): ContinueLearningData | null => {
  if (!profile || !settings) return null;

  if (showAssessmentPrompt) {
    return {
      title: "Complete Assessment",
      description: "Take a quick assessment to personalize your learning experience.",
      progress: 0,
      route: "/assessment",
      japaneseTitle: "アセスメント",
    };
  }
  
  // If user hasn't started or completed hiragana
  if (hiraganaStats.learned < hiraganaStats.total * 0.9) {
    return {
      title: "Hiragana Mastery",
      description: "Continue learning the hiragana characters.",
      progress: (hiraganaStats.learned / hiraganaStats.total) * 100,
      route: "/kana-learning",
      japaneseTitle: "ひらがな",
    };
  }
  
  // If user has completed hiragana but not katakana
  if (hiraganaStats.learned >= hiraganaStats.total * 0.9 && 
      katakanaStats.learned < katakanaStats.total * 0.9) {
    return {
      title: "Katakana Essentials",
      description: "Start learning katakana characters.",
      progress: (katakanaStats.learned / katakanaStats.total) * 100,
      route: "/kana-learning?type=katakana",
      japaneseTitle: "カタカナ",
    };
  }
  
  // If user has completed both hiragana and katakana
  if (hiraganaStats.learned >= hiraganaStats.total * 0.9 && 
      katakanaStats.learned >= katakanaStats.total * 0.9) {
    return {
      title: "Basic Kanji",
      description: "Start learning essential kanji characters.",
      progress: 0,
      route: "/kanji-basics",
      japaneseTitle: "漢字",
    };
  }
  
  return {
    title: "Hiragana Mastery",
    description: "Learn all 46 basic hiragana characters.",
    progress: 0,
    route: "/kana-learning",
    japaneseTitle: "ひらがな",
  };
};

/**
 * Finds the last active learning module
 */
export const findLastActiveModule = (
  studySessions: StudySession[],
  hiraganaStats: { learned: number; total: number },
  katakanaStats: { learned: number; total: number }
): ContinueLearningData | null => {
  if (studySessions.length === 0) return null;
  
  // Get the most recent study session
  const recentSession = [...studySessions].sort((a, b) => 
    new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
  )[0];
  
  let moduleData: ContinueLearningData | null = null;
  
  // Parse created_at to a formatted string
  const lastActiveDate = recentSession.created_at 
    ? new Date(recentSession.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Recently';
  
  // Map the module to a title and route
  switch (recentSession.module) {
    case 'hiragana':
      moduleData = {
        title: "Hiragana Mastery",
        description: "Continue your hiragana learning journey.",
        progress: (hiraganaStats.learned / hiraganaStats.total) * 100,
        route: "/kana-learning",
        japaneseTitle: "ひらがな",
        lastActive: lastActiveDate
      };
      break;
    case 'katakana':
      moduleData = {
        title: "Katakana Essentials",
        description: "Continue your katakana learning journey.",
        progress: (katakanaStats.learned / katakanaStats.total) * 100,
        route: "/kana-learning?type=katakana",
        japaneseTitle: "カタカナ",
        lastActive: lastActiveDate
      };
      break;
    case 'quiz':
      moduleData = {
        title: "Quick Quiz",
        description: "Continue practicing with quick quizzes.",
        progress: 100,
        route: "/quick-quiz",
        lastActive: lastActiveDate
      };
      break;
    case 'assessment':
      moduleData = {
        title: "Assessment",
        description: "Continue your Japanese proficiency assessment.",
        progress: recentSession.completed ? 100 : 50,
        route: "/assessment",
        lastActive: lastActiveDate
      };
      break;
    default:
      // If we can't determine the module, recommend hiragana as default
      moduleData = {
        title: "Hiragana Mastery",
        description: "Learn the Japanese hiragana characters.",
        progress: (hiraganaStats.learned / hiraganaStats.total) * 100,
        route: "/kana-learning",
        japaneseTitle: "ひらがな",
      };
  }
  
  return moduleData;
};
