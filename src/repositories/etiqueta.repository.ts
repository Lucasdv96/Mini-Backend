import { AppdataSource } from "../config/data-source";
import { Etiqueta } from "../entities/etiqueta.entity";

export class EtiquetaRepository {
  private repo = AppdataSource.getRepository(Etiqueta);

  async create(nombre: string, color: string): Promise<Etiqueta> {
    const etiqueta = this.repo.create({ nombre, color });
    return await this.repo.save(etiqueta);
  }

  async findAll(): Promise<Etiqueta[]> {
    return await this.repo.find();
  }

  async findById(id: number): Promise<Etiqueta | null> {
    return await this.repo.findOneBy({ id });
  }

  async findByName(nombre: string): Promise<Etiqueta | null> {
    return await this.repo.findOneBy({ nombre });
  }

  async remove(etiqueta: Etiqueta): Promise<void> {
    await this.repo.remove(etiqueta);
  }

  async save(etiqueta: Etiqueta): Promise<Etiqueta> {
    return await this.repo.save(etiqueta);
  }
}