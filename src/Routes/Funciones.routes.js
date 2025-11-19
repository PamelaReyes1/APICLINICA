import express from 'express';
import {
    getFunciones,
    getFuncionById,
    getFuncionesPorRol,
    crearFuncion,
    actualizarFuncion,
    eliminarFuncion
} from "../Controladores/Funciones.js";

const router = express.Router();

router.get("/funciones", getFunciones);
router.get("/funciones/:id", getFuncionById);
router.get("/funciones/rol/:id_rol", getFuncionesPorRol);
router.post("/funciones", crearFuncion);
router.put("/funciones/:id", actualizarFuncion);
router.delete("/funciones/:id", eliminarFuncion);

export default router;
