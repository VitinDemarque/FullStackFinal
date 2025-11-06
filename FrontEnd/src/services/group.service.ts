import { apiRequest } from './api';
import { 
  Group, 
  GroupListResponse, 
  CreateGroupData, 
  ExerciseListResponse 
} from '../types/group.types';

export const groupService = {
  async listPublic(skip: number = 0, limit: number = 10): Promise<GroupListResponse> {
    return apiRequest('GET', `/groups?skip=${skip}&limit=${limit}`);
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
    return apiRequest('PUT', `/groups/${groupId}`, data);
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
    skip: number = 0, 
    limit: number = 10
  ): Promise<ExerciseListResponse> {
    return apiRequest('GET', `/groups/${groupId}/exercises?skip=${skip}&limit=${limit}`);
  }
};