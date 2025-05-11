import type { ConnectedTripType } from '~/types/TripType';

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const API_GATEWAY_URL = config.public.apiGatewayUrl;
    
    // Get the request body
    const body = await readBody(event);
    
    // Forward the request to the backend API
    const response = await $fetch<{
      status: string;
      result: ConnectedTripType[];
    }>(`${API_GATEWAY_URL}/v2/trip/search-connected`, {
      method: 'POST',
      body
    });
    
    return response;
  } catch (error) {
    console.error('Error in connected-trips API:', error);
    
    // Return a formatted error response
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      result: []
    };
  }
}); 