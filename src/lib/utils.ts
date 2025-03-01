import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate the next review date based on spaced repetition
 * @param proficiency - Current proficiency level (0-100)
 * @param masteryLevel - Current mastery level (0 = learning, 1+ = mastery phases)
 * @returns Date object for the next review
 */
export function calculateNextReviewDate(proficiency: number, masteryLevel: number = 0): Date {
  const now = new Date();
  
  // For characters in mastery phases
  if (masteryLevel > 0) {
    // Base interval is 3 days
    let intervalDays = 3;
    
    // Each mastery level increases the interval by a factor of 1.5
    for (let i = 1; i < masteryLevel; i++) {
      intervalDays *= 1.5;
    }
    
    const nextReview = new Date(now);
    nextReview.setDate(now.getDate() + Math.round(intervalDays));
    return nextReview;
  }
  
  // For characters still in learning phase (based on proficiency)
  let hours = 24; // Default to 1 day for medium proficiency
  
  if (proficiency < 30) {
    hours = 4; // Review very soon for low proficiency
  } else if (proficiency < 60) {
    hours = 12; // Half day for medium-low
  } else if (proficiency >= 90) {
    hours = 48; // 2 days for high proficiency
  }
  
  const nextReview = new Date(now);
  nextReview.setTime(now.getTime() + hours * 60 * 60 * 1000);
  
  return nextReview;
}
