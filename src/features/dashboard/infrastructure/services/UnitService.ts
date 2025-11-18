import type { BaseHttpClient } from '@/shared/domain/abstracts/BaseHttpClient'
import type {
  UnitDTO,
  UnitDetailsDTO,
  UpdateUnitProgressRequest,
  UpdateUnitProgressResponse
} from '../../domain/types/unit.types'

/**
 * UnitService
 *
 * Serviço de infraestrutura para comunicação com a API de Units
 * Endpoints: /api/units
 */

export interface UnitServiceInterface {
  getModuleUnits(moduleId: string): Promise<UnitDTO[]>
  getUnitDetails(unitId: string): Promise<UnitDetailsDTO>
  startUnit(unitId: string): Promise<{ id: string; status: string; startedAt: string }>
  updateUnitProgress(unitId: string, data: UpdateUnitProgressRequest): Promise<UpdateUnitProgressResponse>
}

export class UnitService implements UnitServiceInterface {
  constructor(private readonly httpClient: BaseHttpClient) {}

  /**
   * GET /api/modules/:moduleId/units
   * Retorna todas as unidades de um módulo
   */
  async getModuleUnits(moduleId: string): Promise<UnitDTO[]> {
    const response = await this.httpClient.get<{ success: boolean; data: UnitDTO[] }>(
      `/modules/${moduleId}/units`
    )

    if (!response.success) {
      throw new Error(`Failed to fetch units for module: ${moduleId}`)
    }

    return response.data
  }

  /**
   * GET /api/units/:unitId
   * Retorna detalhes completos de uma unidade
   */
  async getUnitDetails(unitId: string): Promise<UnitDetailsDTO> {
    const response = await this.httpClient.get<{ success: boolean; data: UnitDetailsDTO }>(
      `/units/${unitId}`
    )

    if (!response.success) {
      throw new Error(`Failed to fetch unit: ${unitId}`)
    }

    return response.data
  }

  /**
   * POST /api/units/:unitId/start
   * Inicia uma unidade
   */
  async startUnit(unitId: string): Promise<{ id: string; status: string; startedAt: string }> {
    const response = await this.httpClient.post<{
      success: boolean
      data: { id: string; status: string; startedAt: string }
    }>(`/units/${unitId}/start`, {})

    if (!response.success) {
      throw new Error(`Failed to start unit: ${unitId}`)
    }

    return response.data
  }

  /**
   * PATCH /api/units/:unitId/progress
   * Atualiza o progresso de uma unidade
   */
  async updateUnitProgress(
    unitId: string,
    data: UpdateUnitProgressRequest
  ): Promise<UpdateUnitProgressResponse> {
    const response = await this.httpClient.patch<{
      success: boolean
      data: UpdateUnitProgressResponse
    }>(`/units/${unitId}/progress`, data)

    if (!response.success) {
      throw new Error(`Failed to update unit progress: ${unitId}`)
    }

    return response.data
  }
}
