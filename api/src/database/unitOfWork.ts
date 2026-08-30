import { Pool, PoolClient } from "pg";
import { UtenteRepository } from "./repositories/utenteRepository";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { LibroRepository } from "./repositories/libroRepository";

export type Repositories = {
  utenteRepository: UtenteRepository,
  libroRepository: LibroRepository
}

@Injectable({scope: Scope.REQUEST})
export class UnitOfWork {
  private client: PoolClient | null = null;
  public repositories: Repositories | null = null;

  constructor(@Inject("DATABASE_POOL") private pool: Pool) {}


  async execute<T>(work: (repos: Repositories) => Promise<T>): Promise<T> {
    this.client = await this.pool.connect();

    try {
      await this.client.query('BEGIN');
      this.repositories = {
        utenteRepository: new UtenteRepository(this.client),
        libroRepository: new LibroRepository(this.client)
      };

      const result = await work(this.repositories);

      await this.client.query('COMMIT');
      return result;
    } catch (error) {
      await this.client.query('ROLLBACK');
      throw error;
    } finally {
      // Rilascia sempre il client nel pool
      if (this.client) {
        this.client.release();
        this.client = null;
        this.repositories = null;
      }
    }
  }
}