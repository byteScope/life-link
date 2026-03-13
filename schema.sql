-- LifeLink Medical Appointment & Patient Management Schema
-- PostgreSQL DDL (INT/SERIAL, auto-increment)
-- Run lookup tables first, then core tables in order.

-- ========== Lookup Tables ==========
CREATE TABLE country (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gender (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE specialisation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bill_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_method (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointment_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========== Core Tables ==========
CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    gender_id INTEGER NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(50),
    email_address VARCHAR(255) UNIQUE,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    state VARCHAR(255),
    country_id INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient_gender
        FOREIGN KEY (gender_id)
        REFERENCES gender (id),
    CONSTRAINT fk_patient_country
        FOREIGN KEY (country_id)
        REFERENCES country (id)
);

CREATE TABLE doctor (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    gender_id INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctor_gender
        FOREIGN KEY (gender_id)
        REFERENCES gender (id)
);

CREATE TABLE doctor_specialisations (
    doctor_id INTEGER NOT NULL,
    specialisation_id INTEGER NOT NULL,
    PRIMARY KEY (doctor_id, specialisation_id),
    CONSTRAINT fk_ds_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctor (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ds_specialisation
        FOREIGN KEY (specialisation_id)
        REFERENCES specialisation (id)
        ON DELETE CASCADE
);

CREATE TABLE appointment (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_datetime TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    status_id INTEGER NOT NULL,
    reason VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id)
        REFERENCES patient (id),
    CONSTRAINT fk_appointment_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctor (id),
    CONSTRAINT fk_appointment_status
        FOREIGN KEY (status_id)
        REFERENCES appointment_status (id)
);

CREATE TABLE appointment_note (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    CONSTRAINT fk_note_appointment
        FOREIGN KEY (appointment_id)
        REFERENCES appointment (id),
    CONSTRAINT fk_note_created_by_doctor
        FOREIGN KEY (created_by)
        REFERENCES doctor (id)
);

CREATE TABLE prescription (
    id SERIAL PRIMARY KEY,
    prescribed_appointment_id INTEGER NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(255),
    frequency VARCHAR(255),
    instructions VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    CONSTRAINT fk_prescription_appointment
        FOREIGN KEY (prescribed_appointment_id)
        REFERENCES appointment (id),
    CONSTRAINT fk_prescription_created_by_doctor
        FOREIGN KEY (created_by)
        REFERENCES doctor (id)
);

CREATE TABLE patient_bill (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    bill_status_id INTEGER NOT NULL,
    payment_method_id INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    bill_paid_datetime TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_bill_appointment
        FOREIGN KEY (appointment_id)
        REFERENCES appointment (id),
    CONSTRAINT fk_bill_status
        FOREIGN KEY (bill_status_id)
        REFERENCES bill_status (id),
    CONSTRAINT fk_bill_payment_method
        FOREIGN KEY (payment_method_id)
        REFERENCES payment_method (id)
);
