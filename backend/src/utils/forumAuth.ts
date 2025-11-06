import { IForum } from '../models/Forum.model'

export function isDono(forum: IForum, userId: string) {
    return String(forum.donoUsuarioId) === userId
}

export function isModerador(forum: IForum, userId: string) {
    return forum.moderadores?.some(m => String(m.usuarioId) === userId) ?? false
}

export function isMembro(forum: IForum, userId: string) {
    return forum.membros?.some(m => String(m.usuarioId) === userId) ?? false
}

export function isParticipante(forum: IForum, userId: string) {
    return isDono(forum, userId) || isModerador(forum, userId) || isMembro(forum, userId)
}