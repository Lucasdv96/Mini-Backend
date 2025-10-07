import { Request, Response } from "express";
import { TeamService } from "../services/team.service";

const teamService = new TeamService();

export class TeamController {
  create = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const team = await teamService.createTeam(name);
      return res.status(201).json(team);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  addUser = async (req: Request, res: Response) => {
    try {
      const teamId = Number(req.params.teamId);
      const userId = Number(req.params.userId);
      const updatedUser = await teamService.addUserToTeam(teamId, userId);
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
  //NUEVO: UPDATE
  update = async (req: Request, res: Response) => {
    try {
      const teamId = Number(req.params.id);
      const { name, actorUserId } = req.body; // actorUserId es el ID del usuario que realiza la petición
      const updatedTeam = await teamService.updateTeam(teamId, name, actorUserId);
      return res.json(updatedTeam);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
  //NUEVO: DELETE
  delete = async (req: Request, res: Response) => {
    try {
      const teamId = Number(req.params.id);
      const userId = Number(req.params.userId);
      await teamService.deleteTeam(teamId, userId); // actorUserId es el ID del usuario que realiza la petición
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
}
