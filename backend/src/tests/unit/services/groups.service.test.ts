// comando de teste para esse arquivo: npm test -- src/tests/unit/services/groups.service.test.ts --verbose

import * as groupsService from '@/services/groups.service';
import Group from '@/models/Group.model';
import GroupMember from '@/models/GroupMember.model';
import { ForbiddenError, NotFoundError } from '@/utils/httpErrors';
import { Types } from 'mongoose';

jest.mock('../../../models/Group.model', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));
jest.mock('../../../models/GroupMember.model', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  deleteOne: jest.fn(),
  deleteMany: jest.fn(),
  updateOne: jest.fn(),
}));

/*

  O que este teste cobre:
  
    Função	                  Cenários	       
      listPublic                Listagem e paginação
      getById                   Retorno normal e grupo inexistente
      create                    Criação + membro moderador
      update                    Sucesso, NotFound e Forbidden
      reemove                   Sucesso, idempotente e Forbidden
      join                      Grupo publico, privado inexistente
      leave                     Sucesso
      addMember                 Owner, moderador, Forbidden e NotFound
      removeMember              Sucesso
      setMemberRole             Sucesso

*/

// Mock seguro de ObjectId
jest.spyOn(Types, 'ObjectId').mockImplementation((id?: any) => id as unknown as any);

describe('groups.service', () => {
  const userId = 'u123';
  const groupId = 'g123';
  const targetUserId = 'u999';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Testa do listPublic()
  describe('listPublic', () => {
    it('deve listar grupos públicos com paginação', async () => {
      const mockGroups = [
        {
          _id: '1',
          ownerUserId: userId,
          name: 'Public Group',
          description: 'desc',
          visibility: 'PUBLIC',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (Group.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValueOnce(mockGroups),
      });
      (Group.countDocuments as jest.Mock).mockResolvedValueOnce(1);

      const result = await groupsService.listPublic({ skip: 0, limit: 10 });

      expect(result.total).toBe(1);
      expect(result.items[0].name).toBe('Public Group');
    });
  });

  // Testa do getById()
  describe('getById', () => {
    it('deve retornar grupo e membros', async () => {
      const mockGroup = { _id: groupId, ownerUserId: userId, name: 'Test Group', visibility: 'PUBLIC' };
      const mockMembers = [
        { userId, role: 'MODERATOR', joinedAt: new Date() },
      ];

      (Group.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockGroup),
      });
      (GroupMember.find as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockMembers),
      });

      const result = await groupsService.getById(groupId);
      expect(result.id).toBe(groupId);
      expect(result.members).toHaveLength(1);
    });

    it('deve lançar NotFoundError se grupo não existir', async () => {
      (Group.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });
      await expect(groupsService.getById('404')).rejects.toThrow(NotFoundError);
    });
  });

  // Testa do create()
  describe('create', () => {
    it('deve criar grupo e adicionar o dono como moderador', async () => {
      const mockG = {
        _id: groupId,
        ownerUserId: userId,
        name: 'New Group',
        description: '',
        visibility: 'PUBLIC',
        toObject: jest.fn().mockReturnValue({
          _id: groupId,
          ownerUserId: userId,
          name: 'New Group',
          visibility: 'PUBLIC',
        }),
      };
      (Group.create as jest.Mock).mockResolvedValueOnce(mockG);
      (GroupMember.create as jest.Mock).mockResolvedValueOnce({});

      const result = await groupsService.create(userId, { name: 'New Group' });

      expect(Group.create).toHaveBeenCalled();
      expect(GroupMember.create).toHaveBeenCalled();
      expect(result.name).toBe('New Group');
    });
  });

  // Testa do update()
  describe('update', () => {
    it('deve atualizar grupo se for dono', async () => {
      const mockG: any = {
        _id: groupId,
        ownerUserId: userId,
        name: 'Old',
        save: jest.fn(),
        toObject: jest.fn().mockReturnValue({ _id: groupId, ownerUserId: userId, name: 'Updated' }),
      };
      (Group.findById as jest.Mock).mockResolvedValueOnce(mockG);

      const result = await groupsService.update(userId, groupId, { name: 'Updated' });
      expect(mockG.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated');
    });

    it('deve lançar erro se grupo não existir', async () => {
      (Group.findById as jest.Mock).mockResolvedValueOnce(null);
      await expect(groupsService.update(userId, '404', {})).rejects.toThrow(NotFoundError);
    });

    it('deve lançar ForbiddenError se não for dono', async () => {
      const mockG: any = { _id: groupId, ownerUserId: 'outra' };
      (Group.findById as jest.Mock).mockResolvedValueOnce(mockG);
      await expect(groupsService.update(userId, groupId, {})).rejects.toThrow(ForbiddenError);
    });
  });

  // Testa do remove()
  describe('remove', () => {
    it('deve remover grupo e membros se for dono', async () => {
      const mockG: any = {
        _id: groupId,
        ownerUserId: userId,
        deleteOne: jest.fn(),
      };
      (Group.findById as jest.Mock).mockResolvedValueOnce(mockG);
      (GroupMember.deleteMany as jest.Mock).mockResolvedValueOnce({});

      await groupsService.remove(userId, groupId);

      expect(GroupMember.deleteMany).toHaveBeenCalled();
      expect(mockG.deleteOne).toHaveBeenCalled();
    });

    it('deve ser idempotente se grupo não existir', async () => {
      (Group.findById as jest.Mock).mockResolvedValueOnce(null);
      await expect(groupsService.remove(userId, '404')).resolves.not.toThrow();
    });

    it('deve lançar ForbiddenError se não for dono', async () => {
      const mockG: any = { _id: groupId, ownerUserId: 'outra' };
      (Group.findById as jest.Mock).mockResolvedValueOnce(mockG);
      await expect(groupsService.remove(userId, groupId)).rejects.toThrow(ForbiddenError);
    });
  });

  // Testa do join()
  describe('join', () => {
    it('deve permitir entrar em grupo público', async () => {
      (Group.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({ _id: groupId, visibility: 'PUBLIC' }),
      });
      (GroupMember.findOne as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });
      (GroupMember.create as jest.Mock).mockResolvedValueOnce({});

      const result = await groupsService.join(userId, groupId);
      expect(result.joined).toBe(true);
    });

    it('deve lançar erro se grupo privado', async () => {
      (Group.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({ visibility: 'PRIVATE' }),
      });
      await expect(groupsService.join(userId, groupId)).rejects.toThrow(ForbiddenError);
    });

    it('deve lançar erro se grupo não existir', async () => {
      (Group.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });
      await expect(groupsService.join(userId, groupId)).rejects.toThrow(NotFoundError);
    });
  });

  // Testa do leave()
  describe('leave', () => {
    it('deve sair do grupo', async () => {
      (GroupMember.deleteOne as jest.Mock).mockResolvedValueOnce({});
      const result = await groupsService.leave(userId, groupId);
      expect(result.left).toBe(true);
      expect(GroupMember.deleteOne).toHaveBeenCalled();
    });
  });

  // Testa do addMember(), removeMember(), setMemberRole()
  describe('member management', () => {
    const mockGroupPublic = { _id: groupId, ownerUserId: userId, visibility: 'PUBLIC' };

    it('addMember deve adicionar membro se for owner', async () => {
      (Group.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockGroupPublic),
      });
      (GroupMember.findOne as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });
      (GroupMember.create as jest.Mock).mockResolvedValueOnce({});

      const result = await groupsService.addMember(userId, groupId, targetUserId);
      expect(result.added).toBe(true);
    });

    it('removeMember deve remover membro se for owner', async () => {
      (Group.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockGroupPublic),
      });
      (GroupMember.deleteOne as jest.Mock).mockResolvedValueOnce({});
      const result = await groupsService.removeMember(userId, groupId, targetUserId);
      expect(result.removed).toBe(true);
    });

    it('setMemberRole deve atualizar papel se for owner', async () => {
      (Group.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockGroupPublic),
      });
      (GroupMember.updateOne as jest.Mock).mockResolvedValueOnce({});
      const result = await groupsService.setMemberRole(userId, groupId, targetUserId, 'MODERATOR');
      expect(result.updated).toBe(true);
    });

    it('deve lançar ForbiddenError se não for owner nem moderador', async () => {
      // Grupo existe, mas usuário não é dono
      (Group.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({ _id: groupId, ownerUserId: 'outro' }),
      });
      (GroupMember.findOne as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(groupsService.addMember(userId, groupId, targetUserId)).rejects.toThrow(ForbiddenError);
    });

    it('deve lançar NotFoundError se grupo não existir', async () => {
      (Group.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });
      await expect(groupsService.addMember(userId, groupId, targetUserId)).rejects.toThrow(NotFoundError);
    });
  });
});