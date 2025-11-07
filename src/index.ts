import express from "express";
import { AppdataSource } from "./config/data-source";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import teamRoutes from "./routes/team.routes";
import estadoRoutes from "./routes/estado.routes";
import etiquetaRoutes from "./routes/etiqueta.routes";
import tareaEtiquetaRoutes from "./routes/tarea-etiqueta.routes";
import authRoutes from "./routes/auth.routes";
import cors from "cors";


const app = express();
app.use(cors({
  origin: 'http://localhost:3001', // Puerto de frontend React
  credentials: true
}));
app.use(express.json());

AppdataSource.initialize()
  .then(() => {
    console.log("Base de datos conectada");

    app.get("/", (_req, res) => {
      res.send("Hola mundo desde mi API ");
    });

    app.use("/users", userRoutes);
    app.use("/tasks", taskRoutes);
    app.use("/teams", teamRoutes);
    app.use("/", estadoRoutes);
    app.use("/etiquetas", etiquetaRoutes);
    app.use("/", tareaEtiquetaRoutes);
    app.use("/auth", authRoutes);
    

    app.listen(3000, () => {
      console.log("Servidor corriendo en http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Error al conectar con la BD:", err);
  });