import express from 'express';
import {
    getEspecialidades,
    getEspecialidadPorId
} from "../Controladores/Especialidades.js";

const router = express.Router();

router.get("/especialidades", getEspecialidades);
router.get("/especialidades/:id", getEspecialidadPorId);

export default router;
