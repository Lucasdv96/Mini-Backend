import { Request, Response } from "express";
import { TeamService } from "../services/team.service";

const teamService = new TeamService();

export class TeamController {
  create = async (req: Request, res: Response) => {
    try {
      const { name, propietarioId } = req.body; // ← Agregar propietarioId
      const team = await teamService.createTeam(name, propietarioId);
      return res.status(201).json(team);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  addUser = async (req: Request, res: Response) => {
    try {
      const teamId = Number(req.params.teamId);
      const userId = Number(req.params.userId);
      const { actorUserId } = req.body;

      if (!actorUserId) {
        return res.status(400).json({ message: "Falta actorUserId en el body" });
      }

      const updatedUser = await teamService.addUserToTeam(teamId, userId, actorUserId);
      return res.json(updatedUser);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const teamId = Number(req.params.id);
      const team = await teamService.getTeamById(teamId);
      return res.json(team);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  getAll = async (_req: Request, res: Response) => {
    try {
      const teams = await teamService.getAllTeams();
      return res.json(teams);
    } catch (err: any) {
      return res.status(500).json({ message: "Error al obtener equipos" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const teamId = Number(req.params.id);
      const { name, actorUserId } = req.body;
      const updatedTeam = await teamService.updateTeam(teamId, name, actorUserId);
      return res.json(updatedTeam);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const teamId = Number(req.params.id);
      const { actorUserId } = req.body; // ← Cambiar de params a body
      await teamService.deleteTeam(teamId, actorUserId);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
}