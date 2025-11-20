import express from 'express';
import {
    getCitas,
    getCitaById,
    crearCita,
    getCitasPorPaciente,
    getCitasPorMedico,
    confirmarCita,
    cancelarCita,
    actualizarCita,
    eliminarCita,
    getCitasPorVariosMedicos
} from "../Controladores/CitaMedica.js";

const router = express.Router();

router.get("/citas", getCitas);
router.get("/citas/:id", getCitaById);
router.post("/citas", crearCita);
router.get("/citas/paciente/:id_paciente", getCitasPorPaciente);
router.get("/citas/medico/:id_medico", getCitasPorMedico);
router.put("/citas/confirmar/:id", confirmarCita);
router.put("/citas/cancelar/:id", cancelarCita);
router.put("/citas/actualizar/:id", actualizarCita);
router.put("/citas/actualizar/:id", actualizarCita);
router.delete("/citas/:id", eliminarCita);
router.post("/medicos/citas", getCitasPorVariosMedicos);

export default router;
