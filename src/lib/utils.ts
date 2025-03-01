import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate the next review date based on proficiency
export function calculateNextReviewDate(proficiency: number): Date {
  const now = new Date();
  let daysToAdd = 1;

  // Simple spaced repetition algorithm:
  // Higher proficiency = longer interval between reviews
  if (proficiency >= 90) {
    daysToAdd = 30; // Monthly review for mastered items
  } else if (proficiency >= 70) {
    daysToAdd = 14; // Bi-weekly review
  } else if (proficiency >= 50) {
    daysToAdd = 7; // Weekly review
  } else if (proficiency >= 30) {
    daysToAdd = 3; // Every few days
  } else {
    daysToAdd = 1; // Daily review for new/difficult items
  }

  now.setDate(now.getDate() + daysToAdd);
  return now;
}
