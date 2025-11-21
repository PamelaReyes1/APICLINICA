import { Router } from "express";

import {
    getRecordatoriosByMedico,
    getRecordatoriosByPaciente,
    crearRecordatorio,
    actualizarEstadoRecordatorio,
    eliminarRecordatorio
} from "../Controladores/Recordatorio.js";

const router = Router();

router.get("/recordatorio/medico/:id", getRecordatoriosByMedico);

router.get("/recordatorio/paciente/:id", getRecordatoriosByPaciente);

router.post("/recordatorio", crearRecordatorio);

router.put("/recordatorio/estado/:id", actualizarEstadoRecordatorio);

router.delete("/recordatorio/:id", eliminarRecordatorio);

export default router;
