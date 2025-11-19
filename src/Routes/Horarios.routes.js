import { Router } from "express";

import {
    getHorarios,
    getHorarioPorId,
    getHorariosPorMedico,
    crearHorario,
    actualizarHorario,
    cambiarEstadoHorario,
    eliminarHorario
} from "../Controladores/Horarios.js";

const router = Router();

router.get("/horarios", getHorarios);
router.get("/horarios/:id", getHorarioPorId);
router.get("/horarios/medico/:id_medico", getHorariosPorMedico);
router.post("/horarios", crearHorario);
router.put("/horarios/:id", actualizarHorario);
router.patch("/horarios/estado/:id", cambiarEstadoHorario);
router.delete("/horarios/:id", eliminarHorario);

export default router;
