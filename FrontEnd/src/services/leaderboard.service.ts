import { apiRequest } from './api'

export interface LeaderboardEntry {
    position: number
    userId: string
    name: string
    handle: string
    avatarUrl?: string | null
    collegeId: string | null
    points: number
    xpTotal: number
}

export interface LeaderboardFilters {
    page?: number
    limit?: number
}

export const leaderboardService = {
    async getGeneralLeaderboard(filters?: LeaderboardFilters): Promise<LeaderboardEntry[]> {
        return apiRequest<LeaderboardEntry[]>('GET', '/leaderboards/general', undefined, {
            params: filters,
        })
    },

    async getByLanguage(languageId: string, filters?: LeaderboardFilters): Promise<LeaderboardEntry[]> {
        return apiRequest<LeaderboardEntry[]>('GET', '/leaderboards/by-language', undefined, {
            params: {
                languageId,
                ...filters,
            },
        })
    },

    async getBySeason(seasonId: string, filters?: LeaderboardFilters): Promise<LeaderboardEntry[]> {
        return apiRequest<LeaderboardEntry[]>('GET', '/leaderboards/by-season', undefined, {
            params: {
                seasonId,
                ...filters,
            },
        })
    },

    async getByCollege(collegeId: string, filters?: LeaderboardFilters): Promise<LeaderboardEntry[]> {
        return apiRequest<LeaderboardEntry[]>('GET', '/leaderboards/by-college', undefined, {
            params: {
                collegeId,
                ...filters,
            },
        })
    },
}

