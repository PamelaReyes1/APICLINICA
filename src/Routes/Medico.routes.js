import { Router } from "express";

import {
    getHorarios,
    getHorarioById,
    getHorariosPorMedico,
    getHorariosDisponiblesPorMedico,
    crearHorario,
    actualizarHorario,
    cancelarHorario,
    eliminarHorario
} from "../Controladores/Horarios.js";

const router = Router();

router.get("/horarios", getHorarios);
router.get("/horarios/:id", getHorarioById);
router.get("/horarios/medico/:id_medico", getHorariosPorMedico);
router.get("/horarios/disponibles/:id_medico", getHorariosDisponiblesPorMedico);
router.post("/horarios", crearHorario);
router.put("/horarios/:id", actualizarHorario);
router.put("/horarios/cancelar/:id", cancelarHorario);
router.delete("/horarios/:id", eliminarHorario);

export default router;
