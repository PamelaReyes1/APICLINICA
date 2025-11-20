import { Router } from "express";

import {
    getUsuarios,
    BuscarUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    verificarCorreo,
    loginUsuario,
    actualizarContrasena,
    cambiarEstadoUsuario,
    getUsuariosXcellOCorreo,
    getCitasPorPaciente,
    actualizarUsuario2
} from "../Controladores/Usuario.js";

const router = Router();


router.get("/usuarios", getUsuarios);
router.get("/citas/paciente2/:id_paciente", getCitasPorPaciente); 
router.get("/usuarios/buscar/:busqueda", getUsuariosXcellOCorreo);
router.get("/usuarios/:id", BuscarUsuarioPorId);
router.post("/usuarios", crearUsuario);
router.put("/usuarios/:id", actualizarUsuario);
router.put("/usuarios2/:id",actualizarUsuario2);
router.delete("/usuarios/:id", eliminarUsuario);
router.get("/usuarios/verificar-correo/:correo", verificarCorreo);
router.post("/usuarios/login", loginUsuario);
router.put("/usuarios/:id/contrasena", actualizarContrasena);
router.put("/usuarios/:id/estado", cambiarEstadoUsuario);

export default router;
