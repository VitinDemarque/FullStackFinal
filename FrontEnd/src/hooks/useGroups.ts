import { useState, useEffect } from 'react';
import { Group, GroupListResponse, ExerciseListResponse } from '../types/group.types';
import { groupService } from '../services/group.service';

export const useGroups = (page: number = 1, limit: number = 20) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: GroupListResponse = await groupService.listPublic(page, limit);
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
  }, [page, limit]);

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

export const useGroupExercises = (groupId: string | undefined, page: number = 1, limit: number = 20) => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadExercises = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      setError(null);
      const response: ExerciseListResponse = await groupService.listExercises(groupId, page, limit);
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
  }, [groupId, page, limit]);

  return { exercises, loading, error, total, refetch: loadExercises };
};

export const useMyGroups = (page: number = 1, limit: number = 20) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: GroupListResponse = await groupService.listMyGroups(page, limit);
      setGroups(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar seus grupos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [page, limit]);

  return { groups, loading, error, total, refetch: loadGroups };
};