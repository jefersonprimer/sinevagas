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
let memoryUsers: User[] = [];
let memoryJobs: Job[] = [];
let memoryApplications: Application[] = [];

declare global {
  var _pgPool: Pool | undefined;
}

export function getPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!global._pgPool) {
    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    global._pgPool = new Pool({
      connectionString,
      connectionTimeoutMillis: 10000,
      ssl: isLocalhost ? undefined : { rejectUnauthorized: false },
    });
  }
  return global._pgPool;
}

let columnsMigrated = false;
async function ensureUserColumns() {
  const pool = getPool();
  if (!pool || columnsMigrated) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'candidate',
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
        contract_type VARCHAR(50) NOT NULL,
        salary VARCHAR(100),
        description TEXT NOT NULL,
        requirements TEXT,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        application_type VARCHAR(50) DEFAULT 'internal',
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
    console.error('Aviso ao garantir tabelas e colunas no banco de dados:', err);
  }
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getPool();
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
    if (getPool()) {
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
    if (getPool()) {
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
    if (getPool()) {
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
    if (getPool()) {
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
    if (getPool()) {
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
    if (getPool()) {
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
    if (getPool()) {
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

    if (getPool()) {
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
    if (getPool()) {
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
    if (getPool()) {
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
    if (getPool()) {
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
    if (getPool()) {
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
