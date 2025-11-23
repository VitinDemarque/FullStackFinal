import React, { useEffect, useState } from 'react';
import { ArrowUp, MessageSquare, Copy, Check, Clock } from 'lucide-react';
import submissionsService from '../services/submissions.service';
import ExerciseActionsMenu from '@components/ExerciseActionsMenu';
import * as S from '@/styles/components/ExerciseCard/styles';

interface ExerciseCardProps {
  id: string;
  publicCode?: string;
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
  onClick?: () => void;
}

export default function ExerciseCard({
  id,
  publicCode,
  title,
  description,
  icon,
  votes,
  comments,
  lastModified,
  status,
  onEdit,
  onDelete,
  onInactivate,
  onClick
}: ExerciseCardProps) {
  const isActive = status === 'PUBLISHED';
  const [copied, setCopied] = useState(false);

  const handleCopyId = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const codeToCopy = publicCode ?? id;
      await navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // fallback: ignore
    }
  }

  const handleCardClick = () => {
    if (isActive && onClick) {
      onClick();
    }
  }

  return (
    <S.ExerciseCard $inactive={!isActive} onClick={handleCardClick} style={isActive && onClick ? { cursor: 'pointer' } : undefined}>
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
            <S.VoteIcon>
              <ArrowUp size={14} />
            </S.VoteIcon>
            {votes}
          </S.VoteCount>
          <S.CommentsCount>
            <MessageSquare size={14} />
            {comments} respostas
          </S.CommentsCount>
          <S.IdBadge>
            Código: <code>{publicCode ?? id}</code>
            <S.CopyButton onClick={handleCopyId} type="button" title={copied ? 'Copiado!' : 'Copiar código'}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </S.CopyButton>
          </S.IdBadge>
        </S.StatsLeft>

        <S.LastModified>
          <Clock size={14} />
          Alterado a {lastModified}
        </S.LastModified>

        <S.ActionsContainer onClick={(e) => e.stopPropagation()}>
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