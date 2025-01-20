import type { ApiResponse } from '@/types/ApiResponse';

import { BaseApiClient } from './base';

class OrganizationApiClient extends BaseApiClient {
  async createTestData(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/organization/test-data', {
      method: 'POST',
    });
  }
}

export const organizationApiClient = new OrganizationApiClient();
