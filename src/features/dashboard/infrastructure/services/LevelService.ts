import type { BaseHttpClient } from '@/shared/domain/abstracts/BaseHttpClient'
import type {
  LevelDTO,
  LevelDetailsDTO,
  StartLevelResponse,
  CompleteLevelRequest,
  CompleteLevelResponse
} from '../../domain/types/level.types'

/**
 * LevelService
 *
 * Serviço de infraestrutura para comunicação com a API de Levels
 * Endpoints: /api/levels
 */

export interface LevelServiceInterface {
  getUnitLevels(unitId: string): Promise<LevelDTO[]>
  getLevelDetails(levelId: string): Promise<LevelDetailsDTO>
  startLevel(levelId: string): Promise<StartLevelResponse>
  completeLevel(levelId: string, data: CompleteLevelRequest): Promise<CompleteLevelResponse>
}

export class LevelService implements LevelServiceInterface {
  constructor(private readonly httpClient: BaseHttpClient) {}

  /**
   * GET /api/units/:unitId/levels
   * Retorna todos os níveis de uma unidade
   */
  async getUnitLevels(unitId: string): Promise<LevelDTO[]> {
    const response = await this.httpClient.get<{ success: boolean; data: LevelDTO[] }>(
      `/units/${unitId}/levels`
    )

    if (!response.success) {
      throw new Error(`Failed to fetch levels for unit: ${unitId}`)
    }

    return response.data
  }

  /**
   * GET /api/levels/:levelId
   * Retorna detalhes completos de um nível com desafios
   */
  async getLevelDetails(levelId: string): Promise<LevelDetailsDTO> {
    const response = await this.httpClient.get<{ success: boolean; data: LevelDetailsDTO }>(
      `/levels/${levelId}`
    )

    if (!response.success) {
      throw new Error(`Failed to fetch level: ${levelId}`)
    }

    return response.data
  }

  /**
   * POST /api/levels/:levelId/start
   * Inicia um nível
   */
  async startLevel(levelId: string): Promise<StartLevelResponse> {
    const response = await this.httpClient.post<{
      success: boolean
      data: StartLevelResponse
    }>(`/levels/${levelId}/start`, {})

    if (!response.success) {
      throw new Error(`Failed to start level: ${levelId}`)
    }

    return response.data
  }

  /**
   * POST /api/levels/:levelId/complete
   * Completa um nível com score e tempo
   */
  async completeLevel(
    levelId: string,
    data: CompleteLevelRequest
  ): Promise<CompleteLevelResponse> {
    const response = await this.httpClient.post<{
      success: boolean
      data: CompleteLevelResponse
    }>(`/levels/${levelId}/complete`, data)

    if (!response.success) {
      throw new Error(`Failed to complete level: ${levelId}`)
    }

    return response.data
  }
}
