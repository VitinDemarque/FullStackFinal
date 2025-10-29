import { useState, useEffect } from 'react';
import { Group, GroupListResponse, ExerciseListResponse } from '../types/group.types';
import { groupService } from '../services/group.service';

export const useGroups = (skip: number = 0, limit: number = 10) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: GroupListResponse = await groupService.listPublic(skip, limit);
      setGroups(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar grupos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [skip, limit]);

  return { groups, loading, error, total, refetch: loadGroups };
};

export const useGroup = (id: string | undefined) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGroup = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const groupData = await groupService.getById(id);
      setGroup(groupData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar grupo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroup();
  }, [id]);

  return { group, loading, error, refetch: loadGroup };
};

export const useGroupExercises = (groupId: string | undefined, skip: number = 0, limit: number = 10) => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadExercises = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      setError(null);
      const response: ExerciseListResponse = await groupService.listExercises(groupId, skip, limit);
      setExercises(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar exercícios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, [groupId, skip, limit]);

  return { exercises, loading, error, total, refetch: loadExercises };
};