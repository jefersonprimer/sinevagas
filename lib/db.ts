import { Pool } from 'pg';

export interface User {
  id: number;
  name: string;
  last_name?: string;
  email: string;
  password_hash: string;
  role: 'candidate' | 'recruiter';
  avatar_url?: string;
  employment_status?: string;
  location?: string;
  resume_url?: string;
  preferred_role?: string;
  expected_salary?: string;
  preferred_contract?: string;
  professional_summary?: string;
  cpf?: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  created_at: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  contract_type: 'CLT' | 'PJ' | 'Remoto' | 'Híbrido';
  salary?: string;
  description: string;
  requirements?: string;
  user_id?: number;
  recruiter_avatar_url?: string;
  created_at: string;
  application_type?: 'internal' | 'external' | 'whatsapp' | 'email';
  external_url?: string;
  contact_whatsapp?: string;
  contact_email?: string;
}

export interface Application {
  id: number;
  job_id: number;
  candidate_id?: number;
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  candidate_location?: string;
  linkedin_url?: string;
  github_url?: string;
  resume_link: string;
  cover_letter?: string;
  created_at: string;
  job_title?: string;
  company?: string;
}

// Memory fallback store
let memoryUsers: User[] = [
  {
    id: 1,
    name: 'TechCorp',
    last_name: 'Recrutamento',
    email: 'recruiter@techcorp.com',
    password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'recruiter',
    employment_status: 'Recrutador Ativo',
    location: 'São Paulo, SP',
    preferred_role: 'Líder de Recrutamento',
    expected_salary: 'N/A',
    preferred_contract: 'CLT',
    professional_summary: 'Recrutador responsável pela contratação de talentos de tecnologia.',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Maria',
    last_name: 'Silva',
    email: 'maria.silva@email.com',
    password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'candidate',
    employment_status: 'Em busca de oportunidades',
    location: 'Rio de Janeiro, RJ',
    preferred_role: 'Desenvolvedora Frontend Senior',
    expected_salary: 'R$ 12.000 / mês',
    preferred_contract: 'PJ',
    professional_summary: 'Desenvolvedora apaixonada por interfaces modernas com React, Next.js e TypeScript.',
    created_at: new Date().toISOString(),
  }
];

let memoryJobs: Job[] = [
  {
    id: 1,
    title: 'Desenvolvedor Frontend Senior (React / Next.js)',
    company: 'TechCorp Brasil',
    location: 'Remoto',
    contract_type: 'PJ',
    salary: 'R$ 12.000 - R$ 16.000 / mês',
    description: 'Buscamos um desenvolvedor frontend experiente para atuar no desenvolvimento de aplicações modernas com React, Next.js e TypeScript. Você trabalhará em colaboração com designers e especialistas em UX para entregar interfaces rápidas e responsivas.',
    requirements: 'Experiência sólida em React, Next.js (App Router), Tailwind CSS e consumo de APIs REST/GraphQL. Conhecimento em testes automatizados.',
    user_id: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'UI/UX Designer Pleno',
    company: 'DesignStudio Studio',
    location: 'São Paulo, SP (Híbrido)',
    contract_type: 'CLT',
    salary: 'R$ 7.500 - R$ 9.500 / mês',
    description: 'Procuramos um profissional apaixonado por criar experiências incríveis para usuários. Você será responsável por construir wireframes, protótipos interativos e design systems para nossos clientes.',
    requirements: 'Figma avançado, criação de Design Systems, testes de usabilidade e pesquisa com usuários.',
    user_id: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Desenvolvedor Backend Node.js / Go',
    company: 'Inovação Cloud',
    location: 'Remoto',
    contract_type: 'PJ',
    salary: 'R$ 10.000 - R$ 14.000 / mês',
    description: 'Venha integrar nosso time de infraestrutura e serviços backend. Desenvolverá microserviços escaláveis, APIs de alta performance e microsserviços integrados a bancos de dados PostgreSQL.',
    requirements: 'Experiência com Node.js ou Go, PostgreSQL, Docker, Kubernetes e mensageria.',
    user_id: 1,
    created_at: new Date().toISOString(),
  }
];

let memoryApplications: Application[] = [
  {
    id: 1,
    job_id: 1,
    candidate_id: 2,
    candidate_name: 'Maria Silva',
    candidate_email: 'maria.silva@email.com',
    resume_link: 'https://linkedin.com/in/mariasilva-dev',
    cover_letter: 'Tenho 5 anos de experiência com React e Next.js. Adoraria contribuir com o time!',
    created_at: new Date().toISOString(),
    job_title: 'Desenvolvedor Frontend Senior (React / Next.js)',
    company: 'TechCorp Brasil'
  }
];

const connectionString = process.env.DATABASE_URL || 'postgres://sinevagas:sinevagas_password@localhost:5432/sinevagas_db';

let pool: Pool | null = null;
try {
  pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 2000,
  });
} catch {
  pool = null;
}

let columnsMigrated = false;
async function ensureUserColumns() {
  if (!pool || columnsMigrated) return;
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS employment_status VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_url TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_role VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS expected_salary VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_contract VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS professional_summary TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS cpf VARCHAR(20);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS github_url TEXT;

      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_type VARCHAR(50) DEFAULT 'internal';
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS external_url TEXT;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_whatsapp VARCHAR(50);
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);

      ALTER TABLE applications ADD COLUMN IF NOT EXISTS candidate_phone VARCHAR(50);
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS candidate_location VARCHAR(255);
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS github_url TEXT;
    `);
    columnsMigrated = true;
  } catch (err) {
    console.error('Aviso ao garantir colunas no banco de dados:', err);
  }
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  if (pool) {
    try {
      await ensureUserColumns();
      const res = await pool.query(text, params);
      return res.rows;
    } catch (err) {
      console.error('Erro ao executar query PostgreSQL:', err);
    }
  }
  return [];
}

export const db = {
  // USERS
  async findUserByEmail(email: string): Promise<User | null> {
    if (pool) {
      try {
        await ensureUserColumns();
        const rows = await query<User>('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) return rows[0];
      } catch {
        // Fallback
      }
    }
    return memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id: number): Promise<User | null> {
    if (pool) {
      try {
        await ensureUserColumns();
        const rows = await query<User>('SELECT * FROM users WHERE id = $1', [id]);
        if (rows.length > 0) return rows[0];
      } catch {
        // Fallback
      }
    }
    return memoryUsers.find(u => u.id === id) || null;
  },

  async createUser(name: string, email: string, password_hash: string, role: 'candidate' | 'recruiter'): Promise<User> {
    if (pool) {
      try {
        await ensureUserColumns();
        const rows = await query<User>(
          'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
          [name, email, password_hash, role]
        );
        if (rows.length > 0) return rows[0];
      } catch {
        // Fallback
      }
    }
    const newUser: User = {
      id: memoryUsers.length + 1,
      name,
      email,
      password_hash,
      role,
      created_at: new Date().toISOString()
    };
    memoryUsers.push(newUser);
    return newUser;
  },

  async updateUserProfile(
    id: number,
    data: {
      name?: string;
      last_name?: string;
      email?: string;
      avatar_url?: string | null;
      employment_status?: string | null;
      location?: string | null;
      resume_url?: string | null;
      preferred_role?: string | null;
      expected_salary?: string | null;
      preferred_contract?: string | null;
      professional_summary?: string | null;
      cpf?: string | null;
      phone?: string | null;
      linkedin_url?: string | null;
      github_url?: string | null;
    }
  ): Promise<User | null> {
    if (pool) {
      try {
        await ensureUserColumns();
        const rows = await query<User>(
          `UPDATE users SET 
            name = COALESCE($1, name), 
            last_name = $2, 
            avatar_url = $3, 
            employment_status = $4, 
            location = $5, 
            resume_url = $6,
            preferred_role = $7,
            expected_salary = $8,
            preferred_contract = $9,
            professional_summary = $10,
            cpf = $11,
            phone = $12,
            linkedin_url = $13,
            github_url = $14,
            email = COALESCE($15, email)
           WHERE id = $16 RETURNING *`,
          [
            data.name,
            data.last_name !== undefined ? data.last_name : null,
            data.avatar_url !== undefined ? data.avatar_url : null,
            data.employment_status !== undefined ? data.employment_status : null,
            data.location !== undefined ? data.location : null,
            data.resume_url !== undefined ? data.resume_url : null,
            data.preferred_role !== undefined ? data.preferred_role : null,
            data.expected_salary !== undefined ? data.expected_salary : null,
            data.preferred_contract !== undefined ? data.preferred_contract : null,
            data.professional_summary !== undefined ? data.professional_summary : null,
            data.cpf !== undefined ? data.cpf : null,
            data.phone !== undefined ? data.phone : null,
            data.linkedin_url !== undefined ? data.linkedin_url : null,
            data.github_url !== undefined ? data.github_url : null,
            data.email || null,
            id,
          ]
        );
        if (rows.length > 0) return rows[0];
      } catch (err) {
        console.error('Erro ao atualizar perfil no Postgres:', err);
      }
    }

    let user = memoryUsers.find(u => u.id === id);
    if (!user) {
      user = {
        id,
        name: data.name || 'Usuário',
        email: data.email || `user${id}@email.com`,
        password_hash: '',
        role: 'candidate',
        created_at: new Date().toISOString()
      };
      memoryUsers.push(user);
    }

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.last_name !== undefined) user.last_name = data.last_name || undefined;
    if (data.avatar_url !== undefined) user.avatar_url = data.avatar_url || undefined;
    if (data.employment_status !== undefined) user.employment_status = data.employment_status || undefined;
    if (data.location !== undefined) user.location = data.location || undefined;
    if (data.resume_url !== undefined) user.resume_url = data.resume_url || undefined;
    if (data.preferred_role !== undefined) user.preferred_role = data.preferred_role || undefined;
    if (data.expected_salary !== undefined) user.expected_salary = data.expected_salary || undefined;
    if (data.preferred_contract !== undefined) user.preferred_contract = data.preferred_contract || undefined;
    if (data.professional_summary !== undefined) user.professional_summary = data.professional_summary || undefined;
    if (data.cpf !== undefined) user.cpf = data.cpf || undefined;
    if (data.phone !== undefined) user.phone = data.phone || undefined;
    if (data.linkedin_url !== undefined) user.linkedin_url = data.linkedin_url || undefined;
    if (data.github_url !== undefined) user.github_url = data.github_url || undefined;

    return user;
  },

  async deleteUser(id: number): Promise<boolean> {
    if (pool) {
      try {
        await query('DELETE FROM users WHERE id = $1', [id]);
        return true;
      } catch (err) {
        console.error('Erro ao deletar usuário no Postgres:', err);
      }
    }
    const idx = memoryUsers.findIndex(u => u.id === id);
    if (idx !== -1) {
      memoryUsers.splice(idx, 1);
      return true;
    }
    return true;
  },

  // JOBS
  async getJobs(search?: string, type?: string, location?: string): Promise<Job[]> {
    if (pool) {
      try {
        let sql = 'SELECT j.*, u.avatar_url as recruiter_avatar_url FROM jobs j LEFT JOIN users u ON j.user_id = u.id WHERE 1=1';
        const params: any[] = [];

        if (search) {
          params.push(`%${search}%`);
          sql += ` AND (j.title ILIKE $${params.length} OR j.company ILIKE $${params.length} OR j.description ILIKE $${params.length})`;
        }

        if (location) {
          params.push(`%${location}%`);
          sql += ` AND j.location ILIKE $${params.length}`;
        }

        if (type && type !== 'Todas') {
          params.push(type);
          sql += ` AND j.contract_type = $${params.length}`;
        }

        sql += ' ORDER BY j.created_at DESC';
        const rows = await query<Job>(sql, params);
        if (rows.length >= 0) return rows;
      } catch {
        // Fallback
      }
    }

    let filtered = memoryJobs.map(j => {
      const recruiter = memoryUsers.find(u => u.id === j.user_id);
      return {
        ...j,
        recruiter_avatar_url: recruiter?.avatar_url || j.recruiter_avatar_url
      };
    });

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(q) || 
        j.company.toLowerCase().includes(q) || 
        j.description.toLowerCase().includes(q)
      );
    }
    if (location) {
      const loc = location.toLowerCase();
      filtered = filtered.filter(j => j.location.toLowerCase().includes(loc));
    }
    if (type && type !== 'Todas') {
      filtered = filtered.filter(j => j.contract_type.toLowerCase() === type.toLowerCase());
    }
    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getJobById(id: number): Promise<Job | null> {
    if (pool) {
      try {
        const rows = await query<Job>('SELECT j.*, u.avatar_url as recruiter_avatar_url FROM jobs j LEFT JOIN users u ON j.user_id = u.id WHERE j.id = $1', [id]);
        if (rows.length > 0) return rows[0];
      } catch {
        // Fallback
      }
    }
    const job = memoryJobs.find(j => j.id === id);
    if (!job) return null;
    const recruiter = memoryUsers.find(u => u.id === job.user_id);
    return {
      ...job,
      recruiter_avatar_url: recruiter?.avatar_url || job.recruiter_avatar_url
    };
  },

  async createJob(data: Omit<Job, 'id' | 'created_at'>): Promise<Job> {
    let recruiterAvatar: string | undefined = undefined;
    if (data.user_id) {
      const recruiter = await this.findUserById(data.user_id);
      recruiterAvatar = recruiter?.avatar_url || undefined;
    }

    if (pool) {
      try {
        const rows = await query<Job>(
          'INSERT INTO jobs (title, company, location, contract_type, salary, description, requirements, user_id, application_type, external_url, contact_whatsapp, contact_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
          [
            data.title,
            data.company,
            data.location,
            data.contract_type,
            data.salary || null,
            data.description,
            data.requirements || null,
            data.user_id || null,
            data.application_type || 'internal',
            data.external_url || null,
            data.contact_whatsapp || null,
            data.contact_email || null,
          ]
        );
        if (rows.length > 0) {
          return {
            ...rows[0],
            recruiter_avatar_url: recruiterAvatar
          };
        }
      } catch {
        // Fallback
      }
    }
    const newJob: Job = {
      id: memoryJobs.length + 1,
      ...data,
      application_type: data.application_type || 'internal',
      recruiter_avatar_url: recruiterAvatar,
      created_at: new Date().toISOString()
    };
    memoryJobs.unshift(newJob);
    return newJob;
  },

  async deleteJob(id: number, userId: number): Promise<boolean> {
    if (pool) {
      try {
        const rows = await query<Job>('DELETE FROM jobs WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
        if (rows.length > 0) return true;
      } catch {
        // Fallback
      }
    }
    const idx = memoryJobs.findIndex(j => j.id === id && j.user_id === userId);
    if (idx !== -1) {
      memoryJobs.splice(idx, 1);
      return true;
    }
    return false;
  },

  // APPLICATIONS
  async createApplication(data: Omit<Application, 'id' | 'created_at'>): Promise<Application> {
    if (pool) {
      try {
        const rows = await query<Application>(
          'INSERT INTO applications (job_id, candidate_id, candidate_name, candidate_email, candidate_phone, candidate_location, linkedin_url, github_url, resume_link, cover_letter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
          [
            data.job_id,
            data.candidate_id || null,
            data.candidate_name,
            data.candidate_email,
            data.candidate_phone || null,
            data.candidate_location || null,
            data.linkedin_url || null,
            data.github_url || null,
            data.resume_link,
            data.cover_letter || null,
          ]
        );
        if (rows.length > 0) return rows[0];
      } catch {
        // Fallback
      }
    }
    const job = memoryJobs.find(j => j.id === data.job_id);
    const newApp: Application = {
      id: memoryApplications.length + 1,
      ...data,
      created_at: new Date().toISOString(),
      job_title: job?.title,
      company: job?.company
    };
    memoryApplications.unshift(newApp);
    return newApp;
  },

  async getApplicationsForCandidate(candidateId: number): Promise<Application[]> {
    if (pool) {
      try {
        const rows = await query<Application>(
          `SELECT a.*, j.title as job_title, j.company 
           FROM applications a 
           JOIN jobs j ON a.job_id = j.id 
           WHERE a.candidate_id = $1 
           ORDER BY a.created_at DESC`,
          [candidateId]
        );
        if (rows.length >= 0) return rows;
      } catch {
        // Fallback
      }
    }
    return memoryApplications.filter(a => a.candidate_id === candidateId);
  },

  async getApplicationsForRecruiter(recruiterId: number): Promise<Application[]> {
    if (pool) {
      try {
        const rows = await query<Application>(
          `SELECT a.*, j.title as job_title, j.company 
           FROM applications a 
           JOIN jobs j ON a.job_id = j.id 
           WHERE j.user_id = $1 
           ORDER BY a.created_at DESC`,
          [recruiterId]
        );
        if (rows.length >= 0) return rows;
      } catch {
        // Fallback
      }
    }
    const recruiterJobs = memoryJobs.filter(j => j.user_id === recruiterId).map(j => j.id);
    return memoryApplications.filter(a => recruiterJobs.includes(a.job_id));
  }
};
