import { apiRequest } from './api';
import { 
  Group, 
  GroupListResponse, 
  CreateGroupData, 
  ExerciseListResponse 
} from '../types/group.types';

export const groupService = {
  async listPublic(page: number = 1, limit: number = 20): Promise<GroupListResponse> {
    return apiRequest('GET', `/groups?page=${page}&limit=${limit}`);
  },

  async listMyGroups(page: number = 1, limit: number = 20): Promise<GroupListResponse> {
    return apiRequest('GET', `/groups/my?page=${page}&limit=${limit}`);
  },

  async getById(id: string): Promise<Group> {
    return apiRequest('GET', `/groups/${id}`);
  },

  async create(groupData: CreateGroupData): Promise<Group> {
    return apiRequest('POST', '/groups', groupData);
  },

  async join(groupId: string): Promise<{ joined: boolean }> {
    return apiRequest('POST', `/groups/${groupId}/join`);
  },

  async leave(groupId: string): Promise<{ left: boolean }> {
    return apiRequest('POST', `/groups/${groupId}/leave`);
  },

  async update(groupId: string, data: Partial<Group>): Promise<Group> {
    return apiRequest('PATCH', `/groups/${groupId}`, data);
  },

  async delete(groupId: string): Promise<void> {
    return apiRequest('DELETE', `/groups/${groupId}`);
  },

  async addMember(groupId: string, targetUserId: string): Promise<{ added: boolean }> {
    return apiRequest('POST', `/groups/${groupId}/members/${targetUserId}`);
  },

  async removeMember(groupId: string, targetUserId: string): Promise<{ removed: boolean }> {
    return apiRequest('DELETE', `/groups/${groupId}/members/${targetUserId}`);
  },

  async setMemberRole(
    groupId: string, 
    targetUserId: string, 
    role: 'MEMBER' | 'MODERATOR'
  ): Promise<{ updated: boolean }> {
    return apiRequest('POST', `/groups/${groupId}/members/${targetUserId}/role`, { role });
  },

  async listExercises(
    groupId: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<ExerciseListResponse> {
    return apiRequest('GET', `/groups/${groupId}/exercises?page=${page}&limit=${limit}`);
  },

  async generateInviteLink(groupId: string): Promise<{ link: string; expiresAt: Date }> {
    return apiRequest('POST', `/groups/${groupId}/invite-link`);
  },

  async joinByToken(groupId: string, token: string): Promise<{ joined: boolean }> {
    return apiRequest('POST', `/groups/${groupId}/join-by-token`, { token });
  }
};