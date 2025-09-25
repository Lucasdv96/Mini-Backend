import express from "express";
import { AppdataSource } from "./config/data-source";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import teamRoutes from "./routes/team.routes";


const app = express();
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

    

    app.listen(3000, () => {
      console.log("Servidor corriendo en http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Error al conectar con la BD:", err);
  });