import express from 'express';

import {
    getHistorialCitas,
    getHistorialPorId,
    getHistorialPorCita,
    crearHistorialCita,
    actualizarHistorialCita,
    eliminarHistorialCita
} from "../Controladores/HistorialCitas.js";

const router = express.Router();


router.get("/historial", getHistorialCitas);
router.get("/historial/:id", getHistorialPorId);
router.get("/historial/cita/:id_cita", getHistorialPorCita);
router.post("/historial", crearHistorialCita);
router.put("/historial/:id", actualizarHistorialCita);
router.delete("/historial/:id", eliminarHistorialCita);

export default router;
