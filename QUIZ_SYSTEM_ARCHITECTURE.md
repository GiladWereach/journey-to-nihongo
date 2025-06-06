
# Quiz System Architecture Documentation

## Overview
This document tracks the current state of the quiz system to ensure consistency and prevent confusion between different quiz interfaces.

## Current Active Components (As of 2025-06-06)

### Primary Quiz Flow
1. **Quiz.tsx** - Main quiz page with traditional Kyoto Gion design
   - Uses `SimpleQuizSetup` for kana type selection
   - Uses `SimpleQuizInterface` for the actual quiz
   - Has session management and cleanup
   - **Status: ✅ ACTIVE - Traditional Design Applied**

2. **SimpleQuizSetup.tsx** - Kana type selection screen
   - Traditional cards with matcha/vermilion gradients
   - Japanese character displays (あ/ア)
   - **Status: ✅ ACTIVE - Traditional Design Applied**

3. **SimpleQuizInterface.tsx** - Wrapper component
   - Simply wraps `EnhancedQuizInterface`
   - Maintains backwards compatibility
   - **Status: ✅ ACTIVE - Wrapper Only**

4. **EnhancedQuizInterface.tsx** - Main quiz logic and UI
   - Traditional Kyoto Gion design with paper textures
   - Multiple choice questions with character recognition
   - Progress tracking and session management
   - **Status: ✅ ACTIVE - Traditional Design Applied**

### Secondary Quiz Flow
5. **QuickQuiz.tsx** - Alternative quiz entry point
   - Uses the same `SimpleQuizSetup` and `SimpleQuizInterface`
   - Has its own session management
   - **Status: ⚠️ NEEDS REVIEW - May not have traditional design**

### Legacy/Unused Components (READ-ONLY)
- `QuizInterface.tsx` - **Status: ❌ LEGACY - DO NOT USE**
- `QuizSetup.tsx` - **Status: ❌ LEGACY - DO NOT USE**  
- `QuizResults.tsx` - **Status: ❌ LEGACY - DO NOT USE**
- `QuizResultsModal.tsx` - **Status: ❌ LEGACY - DO NOT USE**

## Design System Requirements

### Traditional Kyoto Gion Theme Elements
- **Background**: `TraditionalBackground` with street stones and wood grain
- **Cards**: `TraditionalCard` with glass-wood effect and border patterns
- **Colors**: 
  - Matcha green for hiragana (`from-matcha/20 to-matcha/10`)
  - Vermilion red for katakana (`from-vermilion/20 to-vermilion/10`)
  - Lantern warm for accents (`text-lantern-warm`)
  - Paper warm for text (`text-paper-warm`)
  - Wood grain backgrounds (`bg-wood-grain/20`)
- **Typography**: `font-traditional` class
- **Characters**: `JapaneseCharacter` component with proper sizing
- **Progress**: `TraditionalProgressIndicator` component

## Current Issues Resolved
- ✅ TypeScript errors in `EnhancedQuizInterface.tsx` (updateSession parameters)
- ✅ Traditional design applied to main quiz flow
- ✅ Session management working correctly

## Potential Issues to Watch
- ⚠️ `QuickQuiz.tsx` may still use old design system
- ⚠️ Multiple quiz entry points could cause confusion
- ⚠️ Legacy components in read-only files might be referenced elsewhere

## Testing Checklist
When making changes to the quiz system, verify:
- [ ] Traditional Kyoto design is maintained
- [ ] Both hiragana and katakana quizzes work
- [ ] Session management functions correctly
- [ ] Progress tracking is accurate
- [ ] TypeScript compilation passes
- [ ] All quiz entry points use the same interface

## Architecture Decision Log

### 2025-06-06: Traditional Design Implementation
- Applied Kyoto Gion street design to all active quiz components
- Fixed TypeScript errors in session management
- Established clear hierarchy: Quiz.tsx → SimpleQuizSetup/SimpleQuizInterface → EnhancedQuizInterface

### Component Relationship Map
```
Quiz.tsx (Main Page)
├── SimpleQuizSetup.tsx (Kana Selection)
└── SimpleQuizInterface.tsx (Quiz Wrapper)
    └── EnhancedQuizInterface.tsx (Actual Quiz Logic)

QuickQuiz.tsx (Alternative Entry)
├── SimpleQuizSetup.tsx (Same as above)
└── SimpleQuizInterface.tsx (Same as above)
```

## Next Steps
1. Review `QuickQuiz.tsx` for design consistency
2. Consider removing or updating legacy quiz components
3. Ensure all quiz entry points lead to the same experience

---
**Last Updated**: 2025-06-06  
**Maintainer**: AI Assistant  
**Purpose**: Ensure consistent quiz system architecture and prevent design regression
