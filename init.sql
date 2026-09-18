-- Criação das tabelas do SineVagas

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'candidate', -- 'candidate' ou 'recruiter'
    avatar_url TEXT,
    employment_status VARCHAR(255),
    location VARCHAR(255),
    resume_url TEXT,
    preferred_role VARCHAR(255),
    expected_salary VARCHAR(100),
    preferred_contract VARCHAR(50),
    professional_summary TEXT,
    cpf VARCHAR(20),
    phone VARCHAR(50),
    linkedin_url TEXT,
    github_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    contract_type VARCHAR(50) NOT NULL, -- 'CLT', 'PJ', 'Remoto', 'Híbrido'
    salary VARCHAR(100),
    description TEXT NOT NULL,
    requirements TEXT,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    application_type VARCHAR(50) DEFAULT 'internal', -- 'internal', 'external', 'whatsapp', 'email'
    external_url TEXT,
    contact_whatsapp VARCHAR(50),
    contact_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id INT REFERENCES users(id) ON DELETE SET NULL,
    candidate_name VARCHAR(255) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    candidate_phone VARCHAR(50),
    candidate_location VARCHAR(255),
    linkedin_url TEXT,
    github_url TEXT,
    resume_link TEXT NOT NULL,
    cover_letter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


