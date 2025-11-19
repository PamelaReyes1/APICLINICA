import { Router } from "express";

import {
    getRoles,
    getRolPorId
} from "../Controladores/Roles.js";

const router = Router();

router.get("/roles", getRoles);
router.get("/roles/:id", getRolPorId);

export default router;
