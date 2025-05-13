# Connected Trips Seat Selection

## Overview
This feature allows users to select seats for both trips in a connected journey (e.g., HCMC → Dak Lak → Hanoi) in a single interface. The implementation shows seat maps for both trips side by side and allows the user to select seats for each leg of the journey.

## Components

### ConnectedTripSeatSelection.vue
The main component that displays seat selection panels for both trips. It:
- Fetches trip details for both trips
- Displays seat maps and available seats
- Tracks selected seats separately for each trip
- Calculates total price for the entire journey
- Emits selected seats when the user proceeds

### API Integration
- Added a server-side API endpoint (`/api/trips/connected-trips`) to handle connected trips search
- Updated the `findConnectedTrips` function in `tripAPI.ts` to use the correct API endpoint
- Fixed type issues with API responses

### Workflow
1. User selects a connected trip from search results
2. The ConnectedTripSeatSelection component opens in a modal
3. Both trip seat maps are fetched and displayed side by side
4. User selects seats for both trips 
5. User clicks "Continue" to proceed with booking
6. Selected seats for both trips are sent to the payment page

## Implementation Notes
- Seat selection logic is based on the existing implementation in the index.vue file
- Added better error handling for API requests
- Fixed type issues with TypeScript interfaces
- Added proxy configuration for API requests

## Testing
To test this feature:
1. Search for a route that requires a connection (e.g., HCMC → Hanoi)
2. Select one of the connected trips
3. The dual seat selection modal will open
4. Select seats for both trips
5. Click "Continue" to proceed to payment

## Files Modified
- `vinahome/pages/(booking)/ve-xe-khach/index.vue`
- `vinahome/components/ConnectedTripSeatSelection.vue`
- `vinahome/api/tripAPI.ts`
- `vinahome/types/PendingType.ts`
- `vinahome/server/api/trips/connected-trips.post.ts` (new file)
- `vinahome/nuxt.config.ts` 