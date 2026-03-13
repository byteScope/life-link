# LifeLink — User flows

This document describes how to use the app for common scenarios. Use the Postman collection (`postman/LifeLink-API.postman_collection.json`) to try the APIs.

**Auth:** All `/api` routes require a valid JWT in the `Authorization: Bearer <token>` header, except `/api/auth/*` (OTP request and verify). Log in first, then send the token with every other API request.

---

## Patient flow: "Book doctor" (recommended UX)

When the user clicks "Book doctor", the app should follow this flow.

### 1. User clicks "Book doctor"

- **Not logged in (no valid JWT):** Show the login screen (phone + OTP).
- **Already logged in (have JWT):** Go to step 2 (or step 4 when booking "for me" and self patient exists).

**Login (when not logged in):**

- User enters phone → **POST /api/auth/otp/request** with `{ "phone": "..." }`.
- User receives OTP (SMS in prod; in dev use server logs or `APP_ENV=dev` to get OTP in the response).
- User enters OTP → **POST /api/auth/otp/verify** with `{ "phone": "...", "otp": "..." }`.
- Save the returned **token**, **user**, and **self_patient**. Use `Authorization: Bearer <token>` for all subsequent requests.
- **Verify response:** `{ "token", "user", "self_patient" }`.  
  **self_patient** = the logged-in user’s one patient record where `is_self: true` (the "for me" profile).  
  **self_patient: null** = user has not created their self profile yet. If null, show "Complete your profile" and create that one record (step 2).

### 2. Ensure user has their one "self" patient (first login)

- Right after verify: Check **self_patient** from the verify response (or **GET /api/patients/me?self=1** with the token).
- If **self_patient is null:** Show a profile form (name, gender, phone, address, etc.) and **POST /api/patients** with **is_self: true**. This creates their single self patient.
- If **self_patient exists:** User already has their one self record. Go to step 3 (or skip to doctor list when booking "for me").
- **Rule:** Each user has exactly one patient with `is_self: true`. They may have multiple patients with `is_self: false` (family/others) when booking "for someone else."

### 3. Choosing patient for this booking

- **Booking for myself:** Use the self patient (`self_patient` from verify or **GET /api/patients/me?self=1**). No extra form.
- **Booking for someone else:** Call **GET /api/patients/me** to list all their patients (self + family). Let them pick one, or show a form and **POST /api/patients** with **is_self: false** to add a new family member. Use that patient’s `id` for the appointment.
- Save the **patient_id** you will use for the appointment.

### 4. Land on doctor list

- Call **GET /api/doctors** (optionally with `?specialty=...&area=...`).
- Show the doctor list so the user can pick a doctor and then pick a slot and confirm the appointment (step 5).

### 5. Book the appointment

- User selects a doctor and a slot (e.g. from **GET /api/doctors/:id/slots**).
- **POST /api/appointments** with header `Authorization: Bearer <token>` and body:
  - **patient_id:** from step 3  
  - **doctor_id:** selected doctor  
  - **appointment_datetime:** selected slot (ISO format)  
  - **reason:** optional  
- Only logged-in users can create appointments. Then show a success screen or redirect to "My appointments."

---

## Flow summary (Book doctor)

| Step | What to do | API |
|------|------------|-----|
| 1 | Not logged in? → Show login (phone + OTP). After verify, save token, user, self_patient. | POST /api/auth/otp/request, POST /api/auth/otp/verify |
| 2 | If self_patient is null → "Complete your profile": create the one self patient with is_self: true. If present, skip. | POST /api/patients (Bearer token) with is_self: true when missing |
| 3 | For "for me": use self_patient. For "for someone else": list GET /api/patients/me, pick or create with is_self: false. | GET /api/patients/me or POST /api/patients with is_self: false |
| 4 | Show doctor list. | GET /api/doctors |
| 5 | User picks doctor & slot; create appointment. | GET /api/doctors/:id/slots, POST /api/appointments (Bearer token) |

---

## API details for the patient flow

- **POST /api/auth/otp/verify (login)**  
  Returns `{ "token", "user", "self_patient" }`. **self_patient** is the user’s single patient with `is_self: true`, or null if not created yet. After first login, if **self_patient** is null, prompt "Complete your profile" and create one with **POST /api/patients** and **is_self: true**.

- **GET /api/patients/me** (auth required)  
  Header: `Authorization: Bearer <token>`.  
  Returns `{ "patients": [ { "id", "user_id", "name", "gender", "address", "is_self", ... } ] }`.  
  Query **?self=1** or **?primary=1:** returns only the self patient (the one with `is_self: true`).

- **POST /api/patients** (auth required)  
  Header: `Authorization: Bearer <token>`. Only logged-in users can create patients; user_id is set from the JWT.  
  Required: **name**, **gender** (one of male, female, non_binary, other).  
  Optional: phone_number, email_address, date_of_birth, country_id, **address** (single field), **is_self** (boolean). **is_self: true** = this patient is the logged-in user; **false** = for someone else (e.g. family).

- **GET /api/doctors**  
  Optional query: specialty, area.  
  Returns list of doctors; use **id** when creating an appointment.

---

## Quick reference: Doctor appointment (API order)

| Step | Action | API |
|------|--------|-----|
| 1a | Send OTP to user’s phone | POST /api/auth/otp/request with phone |
| 1b | User submits OTP; get JWT + self_patient (null = need profile) | POST /api/auth/otp/verify with phone and otp |
| 2 | If self_patient is null → create the one self patient (first login) | POST /api/patients with is_self: true (Bearer token) |
| 3 | For "for me" use self_patient; for others use GET /api/patients/me or create with is_self: false | GET /api/patients/me or POST /api/patients |
| 4 | List doctors | GET /api/doctors, GET /api/doctors/:id/slots |
| 5 | Book appointment | POST /api/appointments (Bearer token) with patient_id, doctor_id, appointment_datetime, reason |

---

## Other flows (short)

- **Book a provider (e.g. physiotherapy):** Same as above, but use **GET /api/services** and **GET /api/services/:id/slots**, then **POST /api/appointments** with **provider_id** instead of **doctor_id**.
- **Emergency request:** **POST /api/emergency** with service_type, location, and optionally patient_id, details.
- **Blood request / find donors:** **POST /api/blood-requests** to create a request; **GET /api/blood-requests/donors/search?blood_group=...&location=...** to search donors.
