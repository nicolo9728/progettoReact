import { Pool, PoolClient } from "pg";
import { UtenteRepository } from "./repositories/utenteRepository";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { LibroRepository } from "./repositories/libroRepository";
import { PrestitoRepository } from "./repositories/prestitoRepository";

export type Repositories = {
  utenteRepository: UtenteRepository,
  libroRepository: LibroRepository,
  prestitoRepository: PrestitoRepository
}

@Injectable({ scope: Scope.REQUEST })
export class UnitOfWork {
  private client: PoolClient | null = null;

  constructor(@Inject("DATABASE_POOL") private pool: Pool) { }

  public get repositories(): Repositories{
    const client = this.client ?? this.pool
    return {
        utenteRepository: new UtenteRepository(client),
        libroRepository: new LibroRepository(client),
        prestitoRepository: new PrestitoRepository(client)
      };
  }

  async execute<T>(work: (repos: Repositories) => Promise<T>): Promise<T> {
    this.client = await this.pool.connect();

    try {
      await this.client.query('BEGIN');

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
      }
    }
  }
}