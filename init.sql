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

-- Inserção de dados iniciais (Seed Data)
INSERT INTO users (id, name, last_name, email, password_hash, role, employment_status, location, preferred_role, expected_salary, preferred_contract, professional_summary) VALUES 
(1, 'TechCorp', 'Recrutamento', 'recruiter@techcorp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'recruiter', 'Recrutador Ativo', 'São Paulo, SP', 'Líder de Recrutamento', 'N/A', 'CLT', 'Recrutador responsável pela contratação de talentos de tecnologia.'),
(2, 'Maria', 'Silva', 'maria.silva@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'candidate', 'Em busca de oportunidades', 'Rio de Janeiro, RJ', 'Desenvolvedora Frontend Senior', 'R$ 12.000 / mês', 'PJ', 'Desenvolvedora apaixonada por interfaces modernas com React, Next.js e TypeScript.')
ON CONFLICT (email) DO NOTHING;

INSERT INTO jobs (id, title, company, location, contract_type, salary, description, requirements, user_id) VALUES
(1, 'Desenvolvedor Frontend Senior (React / Next.js)', 'TechCorp Brasil', 'Remoto', 'PJ', 'R$ 12.000 - R$ 16.000 / mês', 'Buscamos um desenvolvedor frontend experiente para atuar no desenvolvimento de aplicações modernas com React, Next.js e TypeScript. Você trabalhará em colaboração com designers e especialistas em UX para entregar interfaces rápidas e responsivas.', 'Experiência sólida em React, Next.js (App Router), Tailwind CSS e consumo de APIs REST/GraphQL. Conhecimento em testes automatizados e boa comunicação.', 1),

(2, 'UI/UX Designer Pleno', 'DesignStudio Studio', 'São Paulo, SP (Híbrido)', 'CLT', 'R$ 7.500 - R$ 9.500 / mês', 'Procuramos um profissional apaixonado por criar experiências incríveis para usuários. Você será responsável por construir wireframes, protótipos interativos e design systems para nossos clientes.', 'Figma avançado, criação de Design Systems, testes de usabilidade, pesquisa com usuários e boa capacidade de apresentação de projetos.', 1),

(3, 'Desenvolvedor Backend Node.js / Go', 'Inovação Cloud', 'Remoto', 'PJ', 'R$ 10.000 - R$ 14.000 / mês', 'Venha integrar nosso time de infraestrutura e serviços backend. Desenvolverá microserviços escaláveis, APIs de alta performance e microsserviços integrados a bancos de dados PostgreSQL e Redis.', 'Experiência com Node.js ou Go, PostgreSQL, Docker, Kubernetes, mensageria (RabbitMQ/Kafka) e arquitetura de microserviços.', 1),

(4, 'Analista de Dados / Business Intelligence', 'DataInsight Soluções', 'Rio de Janeiro, RJ (Presencial)', 'CLT', 'R$ 6.000 - R$ 8.000 / mês', 'Buscamos um profissional para transformar dados brutos em visões estratégicas para os executivos de nossos clientes.', 'SQL avançado, PowerBI / Tableau, Python para análise de dados (Pandas, Numpy) e noções de estatística.', 1)

ON CONFLICT (id) DO NOTHING;

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('jobs_id_seq', (SELECT MAX(id) FROM jobs));
SELECT setval('applications_id_seq', (SELECT MAX(id) FROM applications));
