import type { BaseHttpClient } from '@/shared/domain/abstracts/BaseHttpClient'
import type { DashboardResponseDTO } from '../../domain/types/gamification.types'

export interface GamificationServiceInterface {
  getDashboard(): Promise<DashboardResponseDTO>
}

export class GamificationService implements GamificationServiceInterface {
  constructor(private readonly httpClient: BaseHttpClient) {}

  async getDashboard(): Promise<DashboardResponseDTO> {
    const response = await this.httpClient.get<{
      success: boolean
      data: DashboardResponseDTO
    }>('/gamification/dashboard')

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch gamification dashboard')
    }

    return response.data
  }
}
