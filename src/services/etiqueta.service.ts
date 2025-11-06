import { Etiqueta } from "../entities/etiqueta.entity";
import { EtiquetaRepository } from "../repositories/etiqueta.repository";

export class EtiquetaService {
  private etiquetaRepo = new EtiquetaRepository();

  async crearEtiqueta(nombre: string, color: string): Promise<Etiqueta> {
    if (!nombre || !nombre.trim()) {
      throw new Error("El nombre de la etiqueta no puede estar vacío");
    }

    // Verificar si ya existe una etiqueta con el mismo nombre
    const etiquetaExistente = await this.etiquetaRepo.findByName(nombre);
    if (etiquetaExistente) {
      throw new Error("Ya existe una etiqueta con ese nombre");
    }

    // Validar formato de color (hexadecimal simple)
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      throw new Error("El color debe estar en formato hexadecimal (ej: #FF5733)");
    }

    return await this.etiquetaRepo.create(nombre, color);
  }

  async listarEtiquetas(): Promise<Etiqueta[]> {
    return await this.etiquetaRepo.findAll();
  }

  async obtenerEtiquetaPorId(id: number): Promise<Etiqueta | null> {
    return await this.etiquetaRepo.findById(id);
  }

  async eliminarEtiqueta(id: number): Promise<void> {
    const etiqueta = await this.etiquetaRepo.findById(id);
    if (!etiqueta) {
      throw new Error("Etiqueta no encontrada");
    }
    await this.etiquetaRepo.remove(etiqueta);
  }

  async actualizarEtiqueta(id: number, nombre?: string, color?: string): Promise<Etiqueta> {
    const etiqueta = await this.etiquetaRepo.findById(id);
    if (!etiqueta) {
      throw new Error("Etiqueta no encontrada");
    }

    if (nombre) {
      if (!nombre.trim()) {
        throw new Error("El nombre de la etiqueta no puede estar vacío");
      }
      etiqueta.nombre = nombre;
    }

    if (color) {
      if (!/^#[0-9A-F]{6}$/i.test(color)) {
        throw new Error("El color debe estar en formato hexadecimal (ej: #FF5733)");
      }
      etiqueta.color = color;
    }

    return await this.etiquetaRepo.save(etiqueta);
  }
}