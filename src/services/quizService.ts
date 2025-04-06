export const getUserKanaProgress = async (userId: string): Promise<UserKanaProgress[]> => {
  try {
    if (!userId) return [];
    
    const { data, error } = await supabaseClient
      .from('user_kana_progress')
      .select('*')
      .eq('user_id', userId);
      
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
    })) as UserKanaProgress[];
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }
};
