import { AppdataSource } from "../config/data-source";
import { Comment } from "../entities/comment.entity";

export class CommentRepository {
  private repo = AppdataSource.getRepository(Comment);

  async create(contenido: string, usuarioId: number, tareaId: number): Promise<Comment> {
    const comment = this.repo.create({
      contenido,
      usuario: { id: usuarioId },
      tarea: { id: tareaId }
    });
    return await this.repo.save(comment);
  }

  async findById(id: number): Promise<Comment | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ["usuario", "tarea"]
    });
  }

  async findByTareaId(tareaId: number): Promise<Comment[]> {
    return await this.repo.find({
      where: { tarea: { id: tareaId } },
      relations: ["usuario"],
      order: { fechaCreacion: "DESC" }
    });
  }

  async update(id: number, contenido: string): Promise<Comment> {
    const comment = await this.repo.findOneBy({ id });
    if (!comment) {
      throw new Error("Comentario no encontrado");
    }
    comment.contenido = contenido;
    return await this.repo.save(comment);
  }

  async remove(comment: Comment): Promise<void> {
    await this.repo.remove(comment);
  }
}