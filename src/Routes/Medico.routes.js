import { Router } from "express";

import {
    getMedicos,
    getMedicoById,
    getMedicosPorEspecialidad,
    crearMedico,
    actualizarMedico,
    eliminarMedico
} from "../Controladores/Medico.js";

const router = Router();

router.get("/medicos", getMedicos);
router.get("/medicos/:id", getMedicoById);
router.get("/medicos/especialidad/:id_especialidad", getMedicosPorEspecialidad);
router.post("/medicos", crearMedico);
router.put("/medicos/:id", actualizarMedico);
router.delete("/medicos/:id", eliminarMedico);

export default router;
