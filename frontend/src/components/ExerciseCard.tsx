import React, { useEffect, useState } from 'react';
import submissionsService from '../services/submissions.service';
import ExerciseActionsMenu from '@components/ExerciseActionsMenu';
import * as S from '@/styles/components/ExerciseCard/styles';

interface ExerciseCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  votes: number;
  comments: number;
  lastModified: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  onEdit?: () => void;
  onDelete?: () => void;
  onInactivate?: () => void;
}

export default function ExerciseCard({
  title,
  description,
  icon,
  votes,
  comments,
  lastModified,
  status,
  onEdit,
  onDelete,
  onInactivate
}: ExerciseCardProps) {
  const isActive = status === 'PUBLISHED';

  return (
    <S.ExerciseCard $inactive={!isActive}>
      <S.CardHeader>
        <S.CardIcon>
          {icon}
        </S.CardIcon>
        <S.CardContent>
          <S.CardTitle>{title}</S.CardTitle>
          <S.CardDescription>{description}</S.CardDescription>
        </S.CardContent>
      </S.CardHeader>

      <S.CardStats>
        <S.StatsLeft>
          <S.VoteCount>
            <S.VoteIcon>↑</S.VoteIcon>
            {votes}
          </S.VoteCount>
          <S.CommentsCount>{comments} respostas</S.CommentsCount>
        </S.StatsLeft>

        <div>
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Alterado a {lastModified}
          </span>
        </div>

        <S.ActionsContainer>
          <ExerciseActionsMenu
            onEdit={onEdit || (() => { })}
            onDelete={onDelete || (() => { })}
            onInactivate={onInactivate || (() => { })}
            isActive={isActive}
          />
        </S.ActionsContainer>
      </S.CardStats>

      {!isActive && (
        <S.InactiveOverlay>
          <S.InactiveLabel>INATIVO</S.InactiveLabel>
        </S.InactiveOverlay>
      )}
    </S.ExerciseCard>
  );
}