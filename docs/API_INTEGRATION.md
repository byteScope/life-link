# LifeLink API Integration

This doc describes how the frontend is wired to the LifeLink backends and what you may need to update.

**Expected request/response format and common response patterns:** see **[API_FORMAT_AND_RESPONSE_PATTERNS.md](./API_FORMAT_AND_RESPONSE_PATTERNS.md)** for exact JSON shapes and what the frontend supports (e.g. raw array vs `{ "data": [...] }`, error handling, slot format).

## Postman collection

- **Path:** `docs/postman/LifeLink-API.postman_collection.json`
- **Import** this file into Postman to call the same APIs the app uses.
- **Services:** life-link (8080), chat (8081), call (8082).

## Environment

Copy `.env.example` to `.env` and set base URLs if you use different ports/hosts:

```env
VITE_API_LIFELINK=http://localhost:8080
VITE_API_CHAT=http://localhost:8081
VITE_API_CALL=http://localhost:8082
```

If these are not set, the app falls back to the `localhost` URLs above.

## CORS

The backends must allow the frontend origin (e.g. `http://localhost:5173` when using Vite). If requests fail with CORS errors, configure CORS on:

- life-link (8080)
- chat (8081)
- call (8082)

## What’s integrated

| Feature            | API used                                                                 | Notes |
|--------------------|---------------------------------------------------------------------------|--------|
| **Doctors**        | `GET /api/doctors`, `POST /api/bookings`                                 | List from API; booking creates a doctor booking. Slots are still local (date + time). |
| **Symptom Check**  | `POST /api/chat/sessions`, `POST .../messages`, `GET /api/doctors`        | New session on load; each message is sent to chat API; suggested doctors from life-link by `specialty`. |
| **Emergency**      | `POST /api/emergency`, `GET /api/emergency/:id`                          | Create request then poll status. Status is mapped to pending/accepted/arriving/arrived. |
| **Blood Request**  | `POST /api/blood-requests`, `GET /api/blood-requests/donors/search`       | Create request then search donors by `blood_group` (and optional `location`). |
| **Payments**       | —                                                                        | Still demo only; receives `bookingId` in state from Doctors for future use (e.g. call token). |
| **Call (A/V)**     | `POST /api/call/token` (body: `booking_id`)                              | Not yet used in UI. Use when implementing video/audio: call with `booking_id` from booking create. |

## Backend response shapes (assumptions)

The app assumes the following. If your backend differs, update `src/api/lifelink.ts` and `src/api/chat.ts` (and any component types) accordingly.

- **GET /api/doctors**  
  Returns an array of objects with at least: `id`, and optionally `name`, `specialty`, `area`, `rating`, `reviews`.

- **POST /api/bookings**  
  Request body: `doctor_id` or `provider_id`, `slot` (e.g. `"2025-03-15 10:00"`), `patient`, `phone`, and optionally `care_type`, `duration`, `location`.  
  Response: object with `id` (booking id).

- **POST /api/chat/sessions**  
  Response: object with `id` (session id).

- **POST /api/chat/sessions/:id/messages**  
  Body: `{ "text": "..." }`.  
  Response: object with `reply` or `message` (bot text).

- **POST /api/emergency**  
  Body: `service_type`, `location`, `details` (optional).  
  Response: object with `id`.  
  **GET /api/emergency/:id**  
  Response: object with `status` (e.g. `pending`, `accepted`, `arriving`, `arrived` or backend equivalents). The UI maps known values to these four states.

- **POST /api/blood-requests**  
  Body: `blood_group`, `units`, `location`, `urgency`.  
  Response: object with `id`.

- **GET /api/blood-requests/donors/search**  
  Query: `blood_group`, optional `location`.  
  Response: array of donor objects; the app uses `id`, `name`, `blood_group`, `location` and optionally `lastDonation`, `donations`.

## Optional updates

1. **Doctors – slots**  
   The app currently uses a fixed list of time slots. To use real slots: call `GET /api/doctors/:id/slots` when a doctor is selected and map the response to the booking dialog (e.g. disable dates/times that are not in the response).

2. **Payments**  
   When you add real payments, pass the `bookingId` from the booking create response through to your payment flow and, after success, use it for **Call - Get token** if the booking is for a video call.

3. **Services / provider booking**  
   Service listing and provider booking (e.g. physiotherapy) still use mock data. To integrate: use `listServices`, `getServiceSlots`, and `createBooking` with `provider_id` in `src/components/ServiceListing.tsx` and related booking flow.

4. **Auth**  
   There is no auth token sent to the APIs. When you add login, send the token in request headers (e.g. `Authorization: Bearer <token>`) from `src/api/config.ts` or the request helpers in `src/api/lifelink.ts` and `src/api/chat.ts`.

5. **Chat session**  
   Symptom Check creates one session on mount. If the user leaves and comes back, a new session is created. To reuse a session, persist `chatSessionId` (e.g. in sessionStorage) and only create a new session when missing.

## Design

No design or layout changes were made; only API wiring, loading/error state copy, and disabled states were added.
