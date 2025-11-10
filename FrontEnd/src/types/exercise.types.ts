export type ExerciseDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ExerciseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Exercise {
  id: string;
  authorUserId: string;
  languageId: string | null;
  title: string;
  description: string | null;
  groupId: string | null;
  difficulty: number;
  baseXp: number;
  isPublic: boolean;
  codeTemplate: string;
  status: ExerciseStatus;
  publicCode?: string;
  triumphantBadgeId?: string | null;
  badgeRarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  highScoreBadgeId?: string | null;
  highScoreThreshold?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExerciseData {
  title: string;
  description: string;
  difficulty: number;
  baseXp: number;
  codeTemplate: string;
  isPublic: boolean;
  languageId?: string;
  groupId?: string;
  triumphantBadgeId?: string;
  badgeRarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  highScoreBadgeId?: string;
  highScoreThreshold?: number;
}

export interface UpdateExerciseData {
  title?: string;
  description?: string;
  difficulty?: number;
  baseXp?: number;
  codeTemplate?: string;
  isPublic?: boolean;
  languageId?: string;
  status?: ExerciseStatus;
  triumphantBadgeId?: string | null;
  badgeRarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  highScoreBadgeId?: string | null;
  highScoreThreshold?: number;
}

export interface ExerciseFilters {
  page?: number;
  limit?: number;
  difficulty?: number;
  languageId?: string;
  isPublic?: boolean;
  status?: ExerciseStatus;
  groupId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}