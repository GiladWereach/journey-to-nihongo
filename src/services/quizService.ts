import { supabaseClient } from '@/lib/supabase';
import { KanaType, QuizCharacterSet, QuizCharacter } from '@/types/quiz';
import { UserKanaProgress } from '@/types/kana';
import { hiraganaCharacters } from '@/data/hiraganaData';
import { katakanaCharacters } from '@/data/katakanaData';
import { calculateNextReviewDate } from '@/lib/utils';

export const quizService = {
  getAvailableCharacterSets: async (type: KanaType): Promise<QuizCharacterSet[]> => {
    try {
      const allKana = type === 'hiragana' ? hiraganaCharacters : katakanaCharacters;
      
      const characterSets: QuizCharacterSet[] = [];
      
      const vowels = allKana.filter(k => /^(a|i|u|e|o)$/.test(k.romaji));
      if (vowels.length > 0) {
        characterSets.push({
          id: `${type}-vowels`,
          name: 'Vowels',
          type,
          characters: vowels.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: 'vowels',
            row: 'vowels',
          })),
          consonantGroup: 'vowels',
          vowelGroup: 'all',
        });
      }
      
      const kRow = allKana.filter(k => /^k[aiueo]$/.test(k.romaji));
      if (kRow.length > 0) {
        characterSets.push({
          id: `${type}-k-row`,
          name: 'K',
          type,
          characters: kRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: 'k',
            row: kana.romaji[1],
          })),
          consonantGroup: 'k',
          vowelGroup: 'all',
        });
      }
      
      const sRow = allKana.filter(k => /^s[aiueo]$/.test(k.romaji));
      if (sRow.length > 0) {
        characterSets.push({
          id: `${type}-s-row`,
          name: 'S',
          type,
          characters: sRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: 's',
            row: kana.romaji[1],
          })),
          consonantGroup: 's',
          vowelGroup: 'all',
        });
      }
      
      const tRow = allKana.filter(k => /^t[aiueo]$/.test(k.romaji));
      if (tRow.length > 0) {
        characterSets.push({
          id: `${type}-t-row`,
          name: 'T',
          type,
          characters: tRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: 't',
            row: kana.romaji[1],
          })),
          consonantGroup: 't',
          vowelGroup: 'all',
        });
      }
      
      const nRow = allKana.filter(k => /^n[aiueo]$/.test(k.romaji));
      if (nRow.length > 0) {
        characterSets.push({
          id: `${type}-n-row`,
          name: 'N',
          type,
          characters: nRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: 'n',
            row: kana.romaji[1],
          })),
          consonantGroup: 'n',
          vowelGroup: 'all',
        });
      }
      
      const hRow = allKana.filter(k => /^h[aiueo]$/.test(k.romaji));
      if (hRow.length > 0) {
        characterSets.push({
          id: `${type}-h-row`,
          name: 'H',
          type,
          characters: hRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: 'h',
            row: kana.romaji[1],
          })),
          consonantGroup: 'h',
          vowelGroup: 'all',
        });
      }
      
      const mRow = allKana.filter(k => /^m[aiueo]$/.test(k.romaji));
      if (mRow.length > 0) {
        characterSets.push({
          id: `${type}-m-row`,
          name: 'M',
          type,
          characters: mRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: 'm',
            row: kana.romaji[1],
          })),
          consonantGroup: 'm',
          vowelGroup: 'all',
        });
      }
      
      const yRow = allKana.filter(k => /^y[auo]$/.test(k.romaji));
      if (yRow.length > 0) {
        characterSets.push({
          id: `${type}-y-row`,
          name: 'Y',
          type,
          characters: yRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: 'y',
            row: kana.romaji[1],
          })),
          consonantGroup: 'y',
          vowelGroup: 'special',
        });
      }
      
      const rRow = allKana.filter(k => /^r[aiueo]$/.test(k.romaji));
      if (rRow.length > 0) {
        characterSets.push({
          id: `${type}-r-row`,
          name: 'R',
          type,
          characters: rRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: 'r',
            row: kana.romaji[1],
          })),
          consonantGroup: 'r',
          vowelGroup: 'all',
        });
      }
      
      const wRow = allKana.filter(k => /^w[aoe]$/.test(k.romaji));
      if (wRow.length > 0) {
        characterSets.push({
          id: `${type}-w-row`,
          name: 'W',
          type,
          characters: wRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: 'w',
            row: kana.romaji[1],
          })),
          consonantGroup: 'w',
          vowelGroup: 'special',
        });
      }
      
      const special = allKana.filter(k => /^n$/.test(k.romaji));
      if (special.length > 0) {
        characterSets.push({
          id: `${type}-special`,
          name: 'Special',
          type,
          characters: special.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: 'special',
            row: 'special',
          })),
          consonantGroup: 'special',
          vowelGroup: 'special',
        });
      }
      
      const gRow = allKana.filter(k => /^g[aiueo]$/.test(k.romaji));
      if (gRow.length > 0) {
        characterSets.push({
          id: `${type}-g-row`,
          name: 'G',
          type,
          characters: gRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            isDakuten: true,
            group: 'g',
            row: kana.romaji[1],
          })),
          consonantGroup: 'g',
          vowelGroup: 'all',
        });
      }
      
      const zRow = allKana.filter(k => /^z[aiueo]$/.test(k.romaji));
      if (zRow.length > 0) {
        characterSets.push({
          id: `${type}-z-row`,
          name: 'Z',
          type,
          characters: zRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            isDakuten: true,
            group: 'z',
            row: kana.romaji[1],
          })),
          consonantGroup: 'z',
          vowelGroup: 'all',
        });
      }
      
      const dRow = allKana.filter(k => /^d[aiueo]$/.test(k.romaji));
      if (dRow.length > 0) {
        characterSets.push({
          id: `${type}-d-row`,
          name: 'D',
          type,
          characters: dRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            isDakuten: true,
            group: 'd',
            row: kana.romaji[1],
          })),
          consonantGroup: 'd',
          vowelGroup: 'all',
        });
      }
      
      const bRow = allKana.filter(k => /^b[aiueo]$/.test(k.romaji));
      if (bRow.length > 0) {
        characterSets.push({
          id: `${type}-b-row`,
          name: 'B',
          type,
          characters: bRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            isDakuten: true,
            group: 'b',
            row: kana.romaji[1],
          })),
          consonantGroup: 'b',
          vowelGroup: 'all',
        });
      }
      
      const pRow = allKana.filter(k => /^p[aiueo]$/.test(k.romaji));
      if (pRow.length > 0) {
        characterSets.push({
          id: `${type}-p-row`,
          name: 'P',
          type,
          characters: pRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            isHandakuten: true,
            group: 'p',
            row: kana.romaji[1],
          })),
          consonantGroup: 'p',
          vowelGroup: 'all',
        });
      }
      
      const jRow = allKana.filter(k => /^j[aio]$/.test(k.romaji));
      if (jRow.length > 0) {
        characterSets.push({
          id: `${type}-j-row`,
          name: 'J',
          type,
          characters: jRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            isDakuten: true,
            group: 'j',
            row: kana.romaji[1],
          })),
          consonantGroup: 'j',
          vowelGroup: 'special',
        });
      }
      
      const combinations = allKana.filter(k => 
        /^[ksgzjtdnhbpmr]y[auo]$/.test(k.romaji)
      );
      
      if (combinations.length > 0) {
        characterSets.push({
          id: `${type}-combinations`,
          name: 'Combinations',
          type,
          characters: combinations.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: 'combinations',
            row: kana.romaji.slice(-1),
          })),
          consonantGroup: 'combinations',
          vowelGroup: 'special',
        });
      }
      
      const aRow = allKana.filter(k => k.romaji.endsWith('a'));
      if (aRow.length > 0) {
        characterSets.push({
          id: `${type}-a-row`,
          name: 'A Row',
          type,
          characters: aRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: kana.romaji[0],
            row: 'a',
          })),
          consonantGroup: 'all',
          vowelGroup: 'a',
        });
      }
      
      const iRow = allKana.filter(k => k.romaji.endsWith('i'));
      if (iRow.length > 0) {
        characterSets.push({
          id: `${type}-i-row`,
          name: 'I Row',
          type,
          characters: iRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: kana.romaji[0],
            row: 'i',
          })),
          consonantGroup: 'all',
          vowelGroup: 'i',
        });
      }
      
      const uRow = allKana.filter(k => k.romaji.endsWith('u'));
      if (uRow.length > 0) {
        characterSets.push({
          id: `${type}-u-row`,
          name: 'U Row',
          type,
          characters: uRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: kana.romaji[0],
            row: 'u',
          })),
          consonantGroup: 'all',
          vowelGroup: 'u',
        });
      }
      
      const eRow = allKana.filter(k => k.romaji.endsWith('e'));
      if (eRow.length > 0) {
        characterSets.push({
          id: `${type}-e-row`,
          name: 'E Row',
          type,
          characters: eRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: kana.romaji[0],
            row: 'e',
          })),
          consonantGroup: 'all',
          vowelGroup: 'e',
        });
      }
      
      const oRow = allKana.filter(k => k.romaji.endsWith('o'));
      if (oRow.length > 0) {
        characterSets.push({
          id: `${type}-o-row`,
          name: 'O Row',
          type,
          characters: oRow.map(kana => ({
            id: kana.id,
            character: kana.character,
            romaji: kana.romaji,
            type,
            group: kana.romaji[0],
            row: 'o',
          })),
          consonantGroup: 'all',
          vowelGroup: 'o',
        });
      }
      
      return characterSets;
    } catch (error) {
      console.error('Error fetching character sets:', error);
      return [];
    }
  },
  
  getUserKanaProgress: async (userId: string, type?: KanaType): Promise<UserKanaProgress[]> => {
    try {
      let query = supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);
      
      if (type) {
        query = query.ilike('character_id', `${type}%`);
      }
      
      const { data, error } = await query;
        
      if (error) {
        console.error('Error fetching user progress:', error);
        throw error;
      }
      
      return data.map((progress: any) => ({
        id: progress.id,
        user_id: progress.user_id,
        character_id: progress.character_id,
        proficiency: progress.proficiency,
        mistake_count: progress.mistake_count,
        total_practice_count: progress.total_practice_count,
        consecutive_correct: progress.consecutive_correct || 0,
        mastery_level: progress.mastery_level || 0,
        last_practiced: new Date(progress.last_practiced),
        review_due: new Date(progress.review_due)
      }));
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  },
  
  getUserQuizStats: async (userId: string, kanaType?: KanaType): Promise<{
    totalQuizzes: number;
    averageAccuracy: number;
    bestStreak: number;
  }> => {
    try {
      let query = supabaseClient
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true);
      
      if (kanaType) {
        query = query.eq('kana_type', kanaType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching quiz stats:', error);
        throw error;
      }
      
      const totalQuizzes = data.length;
      
      const accuracySum = data.reduce((sum, session) => sum + (session.accuracy || 0), 0);
      const averageAccuracy = totalQuizzes > 0 ? Math.round(accuracySum / totalQuizzes) : 0;
      
      const bestStreak = data.length > 0 ? Math.max(...data.map(session => session.streak || 0)) : 0;
      
      return {
        totalQuizzes,
        averageAccuracy,
        bestStreak
      };
    } catch (error) {
      console.error('Error calculating quiz stats:', error);
      return {
        totalQuizzes: 0,
        averageAccuracy: 0,
        bestStreak: 0
      };
    }
  },
  
  updateKanaProgress: async (
    userId: string, 
    characterId: string, 
    isCorrect: boolean
  ): Promise<void> => {
    try {
      const { data, error } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('character_id', characterId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching kana progress:', error);
        throw error;
      }
      
      const now = new Date().toISOString();
      
      if (data) {
        const currentProficiency = data.proficiency || 0;
        const currentConsecutiveCorrect = data.consecutive_correct || 0;
        const currentMasteryLevel = data.mastery_level || 0;
        
        let newConsecutiveCorrect = isCorrect ? 
          currentConsecutiveCorrect + 1 : 0;
        
        const isDueForReview = new Date(data.review_due) <= new Date();
        
        let newMasteryLevel = currentMasteryLevel;
        let newReviewDue = new Date(data.review_due);
        
        let proficiencyChange = 0;
        
        const CONSECUTIVE_THRESHOLD = 8;
        
        if (isCorrect) {
          proficiencyChange = Math.max(10 - Math.floor(currentProficiency / 10), 2);
          
          if (newConsecutiveCorrect >= CONSECUTIVE_THRESHOLD && newMasteryLevel === 0) {
            newMasteryLevel = 1;
            newReviewDue = calculateNextReviewDate(currentProficiency, newMasteryLevel);
            newConsecutiveCorrect = 0;
          }
          else if (newMasteryLevel > 0 && isDueForReview) {
            newMasteryLevel += 1;
            newReviewDue = calculateNextReviewDate(currentProficiency, newMasteryLevel);
            newConsecutiveCorrect = 0;
          }
        } else {
          proficiencyChange = -1 * (2 + Math.floor(currentProficiency / 25));
          
          if (newMasteryLevel > 0 && isDueForReview) {
            newMasteryLevel = Math.max(0, newMasteryLevel - 1);
            
            if (newMasteryLevel > 0) {
              newReviewDue = calculateNextReviewDate(currentProficiency, newMasteryLevel);
            } else {
              newReviewDue = new Date();
            }
          }
        }
        
        const newProficiency = Math.min(Math.max(currentProficiency + proficiencyChange, 0), 100);
        
        const { error: updateError } = await supabaseClient
          .from('user_kana_progress')
          .update({
            proficiency: newProficiency,
            total_practice_count: data.total_practice_count + 1,
            mistake_count: isCorrect ? data.mistake_count : data.mistake_count + 1,
            consecutive_correct: newConsecutiveCorrect,
            mastery_level: newMasteryLevel,
            last_practiced: now,
            review_due: newReviewDue.toISOString(),
            updated_at: now
          })
          .eq('id', data.id);
          
        if (updateError) {
          console.error('Error updating kana progress:', updateError);
          throw updateError;
        }
      } else {
        const initialProficiency = isCorrect ? 15 : 5;
        
        const { error: insertError } = await supabaseClient
          .from('user_kana_progress')
          .insert({
            user_id: userId,
            character_id: characterId,
            proficiency: initialProficiency,
            total_practice_count: 1,
            mistake_count: isCorrect ? 0 : 1,
            consecutive_correct: isCorrect ? 1 : 0,
            mastery_level: 0,
            last_practiced: now,
            review_due: now
          });
          
        if (insertError) {
          console.error('Error inserting kana progress:', insertError);
          throw insertError;
        }
      }
    } catch (error) {
      console.error('Error updating kana progress:', error);
    }
  },
  
  recordQuizSession: async (
    userId: string,
    quizData: {
      kanaType: KanaType;
      characterIds: string[];
      startTime: Date;
      endTime: Date;
      correctCount: number;
      totalAttempts: number;
    }
  ): Promise<string | null> => {
    try {
      const { data: recentSessions } = await supabaseClient
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      let streak = 0;
      
      if (recentSessions) {
        if (recentSessions.streak && recentSessions.accuracy && recentSessions.accuracy >= 70) {
          streak = recentSessions.streak + 1;
        } else {
          streak = 1;
        }
      } else {
        streak = 1;
      }
      
      const accuracy = Math.round((quizData.correctCount / Math.max(quizData.totalAttempts, 1)) * 100);
      
      if (accuracy < 50) {
        streak = 0;
      }
      
      const { data, error } = await supabaseClient
        .from('kana_learning_sessions')
        .insert({
          user_id: userId,
          kana_type: quizData.kanaType,
          characters_studied: quizData.characterIds,
          start_time: quizData.startTime.toISOString(),
          end_time: quizData.endTime.toISOString(),
          accuracy: accuracy,
          streak: streak,
          completed: true
        })
        .select('id')
        .single();
        
      if (error) {
        console.error('Error recording quiz session:', error);
        return null;
      }
      
      return data.id;
    } catch (error) {
      console.error('Error recording quiz session:', error);
      return null;
    }
  },
  
  getRecentQuizSessions: async (
    userId: string,
    limit: number = 5
  ): Promise<any[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('start_time', { ascending: false })
        .limit(limit);
        
      if (error) {
        console.error('Error fetching quiz sessions:', error);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching quiz sessions:', error);
      return [];
    }
  },
  
  getQuickQuizCharacters: async (type: KanaType, userId?: string, limit: number = 10): Promise<QuizCharacter[]> => {
    try {
      const allKana = type === 'hiragana' ? 
        hiraganaCharacters : 
        type === 'katakana' ? 
          katakanaCharacters : 
          [...hiraganaCharacters, ...katakanaCharacters];
      
      let characters: QuizCharacter[] = [];
      
      if (userId) {
        const { data: progressData } = await supabaseClient
          .from('user_kana_progress')
          .select('*')
          .eq('user_id', userId);
        
        if (progressData && progressData.length > 0) {
          const now = new Date();
          const userProgress = progressData.map(p => ({
            ...p,
            review_due: new Date(p.review_due),
            proficiency: p.proficiency || 0
          }));
          
          const scoredCharacters = allKana.map(kana => {
            const progress = userProgress.find(p => p.character_id === kana.id);
            
            let priorityScore = 0;
            
            if (!progress) {
              priorityScore = 50;
            } else if (progress.review_due <= now) {
              priorityScore = 100 - progress.proficiency;
            } else {
              priorityScore = 40 - (progress.proficiency / 2.5);
            }
            
            return {
              character: kana,
              priorityScore
            };
          });
          
          scoredCharacters.sort((a, b) => b.priorityScore - a.priorityScore);
          
          characters = scoredCharacters.slice(0, limit).map(sc => ({
            id: sc.character.id,
            character: sc.character.character,
            romaji: sc.character.romaji,
            type: sc.character.type as KanaType,
            group: sc.character.group || 'unknown',
            quizMode: 'both' as const
          }));
        }
      }
      
      if (characters.length < limit) {
        const remainingChars = allKana.filter(kana => 
          !characters.some(c => c.id === kana.id)
        );
        
        const shuffled = [...remainingChars].sort(() => Math.random() - 0.5);
        
        const additional = shuffled.slice(0, limit - characters.length).map(kana => ({
          id: kana.id,
          character: kana.character,
          romaji: kana.romaji,
          type: kana.type as KanaType,
          group: kana.group || 'unknown',
          quizMode: 'both' as const
        }));
        
        characters = [...characters, ...additional];
      }
      
      return characters.sort(() => Math.random() - 0.5);
    } catch (error) {
      console.error('Error preparing quick quiz characters:', error);
      return [];
    }
  }
};
