import { sql } from "../db.js";

/* ============================================================
   OBTENER RECORDATORIOS POR MÉDICO (solo ENVIADO)
   ============================================================ */
export const getRecordatoriosByMedico = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            `SELECT * FROM RECORDATORIO 
             WHERE ID_MEDICO = ? AND ESTADO = 'ENVIADO'`,
            [id]
        );

        res.json({ total: result.length, data: result });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener recordatorios por médico",
            error
        });
    }
};

/* ============================================================
   OBTENER RECORDATORIOS POR PACIENTE (solo ENVIADO)
   ============================================================ */
export const getRecordatoriosByPaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            `SELECT * FROM RECORDATORIO 
             WHERE ID_PACIENTE = ? AND ESTADO = 'ENVIADO'`,
            [id]
        );

        res.json({ total: result.length, data: result });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener recordatorios por paciente",
            error
        });
    }
};

/* ============================================================
   CREAR RECORDATORIO
   ============================================================ */
export const crearRecordatorio = async (req, res) => {
    const { id_medico, id_paciente, id_cita, fecha_envio, mensaje } = req.body;

    if (!id_medico || !id_paciente || !id_cita || !mensaje) {
        return res.status(400).json({
            message: "Faltan datos obligatorios"
        });
    }

    try {
        const [result] = await sql.query(
            `INSERT INTO RECORDATORIO 
             (ID_MEDICO, ID_PACIENTE, ID_CITA, FECHA_ENVIO, MENSAJE, ESTADO)
             VALUES (?, ?, ?, ?, ?, 'PENDIENTE')`,
            [id_medico, id_paciente, id_cita, fecha_envio || null, mensaje]
        );

        res.status(201).json({
            message: "Recordatorio creado correctamente",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al crear recordatorio",
            error
        });
    }
};

/* ============================================================
   ACTUALIZAR ESTADO DEL RECORDATORIO
   ============================================================ */
export const actualizarEstadoRecordatorio = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
        return res
            .status(400)
            .json({ message: "Debe enviar el nuevo estado" });
    }

    try {
        const [existe] = await sql.query(
            "SELECT * FROM RECORDATORIO WHERE ID_RECORDATORIO = ?",
            [id]
        );

        if (existe.length === 0) {
            return res
                .status(404)
                .json({ message: "Recordatorio no encontrado" });
        }

        await sql.query(
            `UPDATE RECORDATORIO SET ESTADO = ? WHERE ID_RECORDATORIO = ?`,
            [estado.toUpperCase(), id]
        );

        res.json({
            message: "Estado actualizado correctamente",
            id
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar estado",
            error
        });
    }
};

/* ============================================================
   ELIMINAR RECORDATORIO (opcional)
   ============================================================ */
export const eliminarRecordatorio = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "DELETE FROM RECORDATORIO WHERE ID_RECORDATORIO = ?",
            [id]
        );

        result.affectedRows > 0
            ? res.json({ message: "Recordatorio eliminado correctamente" })
            : res.status(404).json({ message: "Recordatorio no encontrado" });

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar recordatorio",
            error
        });
    }
};
