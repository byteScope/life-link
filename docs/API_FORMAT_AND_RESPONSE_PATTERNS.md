# LifeLink API – Expected Format & Response Patterns

This doc describes the **exact request/response formats** the frontend expects and the **common response patterns** it supports. Use it to align the backend (life-link, chat, call) with the app.

---

## 1. Common response patterns the frontend supports

### 1.1 List responses (GET returning arrays)

The frontend accepts **any** of these for list endpoints (e.g. GET `/api/doctors`):

| Pattern | Example |
|--------|---------|
| **Raw array** | `[{ "id": "d1", "name": "Dr. Smith" }, ...]` |
| **Envelope `data`** | `{ "data": [...] }` |
| **Envelope `doctors`** | `{ "doctors": [...] }` |
| **Envelope `items`** | `{ "items": [...] }` |
| **Envelope `results`** | `{ "results": [...] }` |

It looks for the array in this order: raw response → `data` → `doctors` → `items` → `results`. Any other envelope key is not used.

### 1.2 Single-resource responses (GET by ID, POST create)

The frontend expects a **single JSON object** with at least the documented fields (e.g. `id`, `status`). Extra fields are ignored.

- **Create (POST):** response must include `id` (e.g. booking id, emergency id, session id).
- **Get by ID (GET):** response must include the resource fields (e.g. `status` for emergency).

### 1.3 HTTP status & errors

- **Success:** `2xx` (typically `200` or `201`). Body is JSON where documented.
- **Error:** any non-2xx. The frontend treats the request as failed and shows a generic error (or uses fallback data where implemented). It does **not** parse a standard error body shape; it only uses `res.ok` and optional `res.status` / `res.text()` for the message.

So the backend can use any error format (e.g. `{ "error": "..." }`, `{ "message": "..." }`); the frontend will just show “API 400: …” or similar.

### 1.4 Content-Type

- **Request:** frontend sends `Content-Type: application/json` for all requests (including GET). If your server rejects GET with a body, that’s fine—GET has no body.
- **Response:** frontend expects `Content-Type: application/json` for successful responses so it can call `res.json()`.

---

## 2. LifeLink (main) – Expected request/response format

Base URL: `http://localhost:8080` (or `VITE_API_LIFELINK`).

### 2.1 GET `/api/doctors`

**Query (optional):**  
`specialty`, `area` (e.g. `?specialty=General%20practice&area=Downtown`).

**Response (any of these):**

- Raw array (preferred):
```json
[
  {
    "id": "d1",
    "name": "Dr. Sarah Chen",
    "specialty": "General Practice",
    "area": "Downtown",
    "rating": 4.8,
    "reviews": 342
  }
]
```

- Or an object with the list under **one** of these keys: `data`, `doctors`, `items`, `results`:
```json
{
  "doctors": [
    {
      "id": "d1",
      "name": "Dr. Sarah Chen",
      "specialty": "General Practice",
      "area": "Downtown",
      "rating": 4.8,
      "reviews": 342
    }
  ]
}
```

**Required:** `id` (string).  
**Optional:** `name`, `specialty`, `area`, `rating` (number), `reviews` (number). Any extra fields are ignored.

---

### 2.2 GET `/api/doctors/:id/slots`

**Response:** array of slots. Either raw strings or objects with `slot`:

- `["2025-03-15 10:00", "2025-03-15 11:00"]`
- or `[{ "slot": "2025-03-15 10:00" }, { "slot": "2025-03-15 11:00" }]`

Frontend currently uses local time slots; this is for future use.

---

### 2.3 POST `/api/bookings`

**Request body (JSON):**

```json
{
  "doctor_id": "d1",
  "slot": "2025-03-15 10:00",
  "patient": "John Doe",
  "phone": "+1234567890",
  "care_type": "video",
  "duration": "30",
  "location": ""
}
```

- **Doctor booking:** `doctor_id`, `slot`, `patient`, `phone`. Optional: `care_type` (`"video"` | `"in-person"`), `duration`, `location`.
- **Provider booking:** same but use `provider_id` instead of `doctor_id`, and `care_type` e.g. `"home-visit"`.

**Slot format:** `"YYYY-MM-DD HH:mm"` (e.g. `"2025-03-15 10:00"`).

**Response:**

```json
{
  "id": "bk-123"
}
```

`id` is required (used for payment/call token flow).

---

### 2.4 GET `/api/bookings` and GET `/api/bookings/:id`

- **List:** response = array of booking objects (or `{ "data": [...] }` same as doctors).
- **Get by ID:** response = single object with `id` and any other fields you use.

---

### 2.5 POST `/api/emergency`

**Request body:**

```json
{
  "service_type": "ambulance",
  "location": "123 Main St",
  "details": "Patient needs urgent transport"
}
```

`service_type`: e.g. `ambulance`, `medical`, `fire`, `police`.  
`details` is optional.

**Response:**

```json
{
  "id": "em-456"
}
```

`id` is required (used for status polling).

---

### 2.6 GET `/api/emergency/:id`

**Response:**

```json
{
  "id": "em-456",
  "status": "accepted"
}
```

**Status values** the frontend maps to UI state:

- `pending` (or unknown) → “Request Pending”
- `accepted`, `dispatched` → “Request Accepted”
- `arriving`, `on_the_way`, `en_route` → “On The Way”
- `arrived`, `completed` → “Arrived”

Use these (or add mapping in the frontend for your values).

---

### 2.7 POST `/api/blood-requests`

**Request body:**

```json
{
  "blood_group": "O+",
  "units": "2",
  "location": "City Hospital",
  "urgency": "critical"
}
```

`urgency`: e.g. `critical`, `urgent`, `normal`.

**Response:**

```json
{
  "id": "br-789"
}
```

`id` is required.

---

### 2.8 GET `/api/blood-requests/donors/search`

**Query:** `blood_group` (required), `location` (optional).  
Example: `?blood_group=O+&location=Downtown`

**Response:** array of donors (or `{ "data": [...] }`). Frontend currently only unwraps `data` for doctors; for donors it expects a raw array. To be consistent, either:

- Return a **raw array** of donors, or  
- Use `{ "data": [...] }` and the frontend can be updated to unwrap it (same as doctors).

**Donor object – used fields:**

- `id` (optional)
- `name`
- `blood_group`
- `location`
- `lastDonation` (optional, string)
- `donations` (optional, number)

Example:

```json
[
  {
    "id": "donor-1",
    "name": "John Smith",
    "blood_group": "O+",
    "location": "1.2 km away",
    "lastDonation": "4 months ago",
    "donations": 12
  }
]
```

---

## 3. Chat service – Expected format

Base URL: `http://localhost:8081` (or `VITE_API_CHAT`).

### 3.1 POST `/api/chat/sessions`

**Request:** no body (or empty JSON `{}`).

**Response:**

```json
{
  "id": "session-abc"
}
```

`id` is required (used for sending messages).

---

### 3.2 POST `/api/chat/sessions/:id/messages`

**Request body:**

```json
{
  "text": "I have headache and fever since 2 days"
}
```

**Response (bot reply):** object with **either** `reply` or `message` (string). Optional: `summary` or other fields.

```json
{
  "reply": "Based on your symptoms, I recommend seeing a General Practice doctor."
}
```

or

```json
{
  "message": "Based on your symptoms, I recommend seeing a General Practice doctor."
}
```

The frontend uses the first non-empty of `reply` or `message` as the bot text.

---

## 4. Call (A/V) service – Expected format

Base URL: `http://localhost:8082` (or `VITE_API_CALL`).

### 4.1 POST `/api/call/token`

**Request body:**

```json
{
  "booking_id": "bk-123"
}
```

**Response:** object with token and room info, e.g.:

```json
{
  "token": "eyJ...",
  "room_id": "room-xyz"
}
```

Frontend expects at least `token` and/or `room_id` for future video/audio integration.

---

## 5. Summary table

| Endpoint | Method | Request body / query | Response pattern | Required fields |
|----------|--------|----------------------|------------------|-----------------|
| `/api/doctors` | GET | Query: `specialty`, `area` | Array or `{ "data": [...] }` | Each item: `id` |
| `/api/doctors/:id/slots` | GET | — | Array of strings or `[{ "slot": "..." }]` | — |
| `/api/bookings` | POST | JSON: doctor_id/provider_id, slot, patient, phone, … | Single object | `id` |
| `/api/emergency` | POST | JSON: service_type, location, details? | Single object | `id` |
| `/api/emergency/:id` | GET | — | Single object | `status` |
| `/api/blood-requests` | POST | JSON: blood_group, units, location, urgency | Single object | `id` |
| `/api/blood-requests/donors/search` | GET | Query: blood_group, location? | Array (raw) | Items: name, blood_group, location |
| `/api/chat/sessions` | POST | — | Single object | `id` |
| `/api/chat/sessions/:id/messages` | POST | JSON: text | Single object | `reply` or `message` |
| `/api/call/token` | POST | JSON: booking_id | Single object | `token` and/or `room_id` |

---

## 6. Recommendation for backend

- Use **raw arrays** for list endpoints (doctors, donors, slots) for simplicity; or a single envelope `{ "data": [...] }` for lists.
- Use **plain objects** with `id` (and other fields as above) for create/get-by-id and chat/call.
- Use **HTTP status** for success (2xx) vs error (4xx/5xx); error body format is flexible.
- Use **Content-Type: application/json** for responses.

If your backend uses different field names or envelopes, either adjust the backend to match this doc or update the frontend parsers in `src/api/lifelink.ts` and `src/api/chat.ts` to match your format.
