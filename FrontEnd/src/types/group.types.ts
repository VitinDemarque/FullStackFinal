export type GroupVisibility = 'PUBLIC' | 'PRIVATE';
export type GroupMemberRole = 'MEMBER' | 'MODERATOR';
export type ExerciseDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ExerciseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Group {
  id: string;
  ownerUserId: string;
  name: string;
  description: string | null;
  visibility: GroupVisibility;
  createdAt: Date;
  updatedAt: Date;
  members?: GroupMember[];
}

export interface GroupMember {
  userId: string;
  role: GroupMemberRole;
  joinedAt: Date;
}

export interface Exercise {
  id: string;
  title: string;
  languageId: string | null;
  difficulty: ExerciseDifficulty;
  isPublic: boolean;
  status: ExerciseStatus;
  createdAt: Date;
}

export interface GroupListResponse {
  items: Group[];
  total: number;
}

export interface ExerciseListResponse {
  items: Exercise[];
  total: number;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  visibility: GroupVisibility;
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
  visibility?: GroupVisibility;
}