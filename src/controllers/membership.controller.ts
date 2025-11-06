import { Request, Response } from "express";
import { MembershipService } from "../services/membership.service";
import { RolMembresia } from "../entities/membership.entity";

const membershipService = new MembershipService();

export class MembershipController {
  agregarMiembro = async (req: Request, res: Response) => {
    try {
      const teamId = Number(req.params.id);
      const { userId, rol, actorUserId } = req.body;

      if (!userId || !rol || !actorUserId) {
        return res.status(400).json({ message: "Faltan parámetros: userId, rol, actorUserId" });
      }

      const rolEnum = rol as RolMembresia;
      if (!Object.values(RolMembresia).includes(rolEnum)) {
        return res.status(400).json({ message: "Rol inválido. Use: PROPIETARIO o MIEMBRO" });
      }

      const membership = await membershipService.agregarMiembro(teamId, userId, rolEnum, actorUserId);
      return res.status(201).json(membership);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  removerMiembro = async (req: Request, res: Response) => {
    try {
      const teamId = Number(req.params.id);
      const userId = Number(req.params.usuarioId);
      const { actorUserId } = req.body;

      if (!actorUserId) {
        return res.status(400).json({ message: "Falta actorUserId" });
      }

      await membershipService.removerMiembro(teamId, userId, actorUserId);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  listarMiembros = async (req: Request, res: Response) => {
    try {
      const teamId = Number(req.params.id);
      const miembros = await membershipService.listarMiembros(teamId);
      return res.json(miembros);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  cambiarRol = async (req: Request, res: Response) => {
    try {
      const teamId = Number(req.params.id);
      const userId = Number(req.params.usuarioId);
      const { nuevoRol, actorUserId } = req.body;

      if (!nuevoRol || !actorUserId) {
        return res.status(400).json({ message: "Faltan parámetros: nuevoRol, actorUserId" });
      }

      const rolEnum = nuevoRol as RolMembresia;
      if (!Object.values(RolMembresia).includes(rolEnum)) {
        return res.status(400).json({ message: "Rol inválido. Use: PROPIETARIO o MIEMBRO" });
      }

      const membership = await membershipService.cambiarRol(teamId, userId, rolEnum, actorUserId);
      return res.json(membership);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
}