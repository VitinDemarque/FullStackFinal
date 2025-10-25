import React from 'react';
import * as S from './styles';

interface ExerciseCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  votes: number;
  comments: number;
  lastModified: string;
  onEdit?: () => void;
}

export default function ExerciseCard({
  title,
  description,
  icon,
  votes,
  comments,
  lastModified,
  onEdit
}: ExerciseCardProps) {
  return (
    <S.ExerciseCard>
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
          <S.CommentsCount>{comments} comentários</S.CommentsCount>
        </S.StatsLeft>
        
        <div>
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Alterado a {lastModified}
          </span>
        </div>
        
        {onEdit && (
          <S.EditButton onClick={onEdit}>
            Editar
          </S.EditButton>
        )}
      </S.CardStats>
    </S.ExerciseCard>
  );
}
