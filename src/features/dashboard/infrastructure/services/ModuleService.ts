import type { BaseHttpClient } from '@/shared/domain/abstracts/BaseHttpClient'
import type {
  ModuleWithProgressDTO,
  ModuleDetailsDTO,
  UpdateModuleProgressRequest,
  UpdateModuleProgressResponse
} from '../../domain/types/module.types'
import type { ChallengeDTO } from '../../domain/mappers/ChallengeMapper'

export interface ModuleServiceInterface {
  getModulesWithProgress(): Promise<ModuleWithProgressDTO[]>
  getModuleDetails(slug: string): Promise<ModuleDetailsDTO>
  getModuleChallenges(slug: string): Promise<ChallengeDTO[]>
  updateModuleProgress(moduleId: string, data: UpdateModuleProgressRequest): Promise<UpdateModuleProgressResponse>
}

export class ModuleService implements ModuleServiceInterface {
  constructor(private readonly httpClient: BaseHttpClient) {}

  async getModulesWithProgress(): Promise<ModuleWithProgressDTO[]> {
    const response = await this.httpClient.get<{ success: boolean; data: ModuleWithProgressDTO[] }>('/modules')

    if (!response.success) {
      throw new Error('Failed to fetch modules')
    }

    return response.data
  }

  async getModuleDetails(slug: string): Promise<ModuleDetailsDTO> {
    const response = await this.httpClient.get<{ success: boolean; data: ModuleDetailsDTO }>(`/modules/${slug}`)

    if (!response.success) {
      throw new Error(`Failed to fetch module: ${slug}`)
    }

    return response.data
  }

  async getModuleChallenges(slug: string): Promise<ChallengeDTO[]> {
    const response = await this.httpClient.get<{ success: boolean; data: ChallengeDTO[] }>(
      `/modules/${slug}/challenges`
    )

    if (!response.success) {
      throw new Error(`Failed to fetch challenges for module: ${slug}`)
    }

    return response.data
  }

  async updateModuleProgress(
    moduleId: string,
    data: UpdateModuleProgressRequest
  ): Promise<UpdateModuleProgressResponse> {
    const response = await this.httpClient.patch<{ success: boolean; data: UpdateModuleProgressResponse }>(
      `/modules/${moduleId}/progress`,
      data
    )

    if (!response.success) {
      throw new Error(`Failed to update module progress: ${moduleId}`)
    }

    return response.data
  }
}
