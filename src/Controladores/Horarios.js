import { sql } from '../db.js';

export const getHorarios = async (req, res) => {
    try {
        const [result] = await sql.query("SELECT * FROM HORARIOS");
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener horarios", error });
    }
};
export const getHorarioPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM HORARIOS WHERE ID_HORARIO = ? LIMIT 1",
            [id]
        );

        result.length > 0
            ? res.json(result[0])
            : res.status(404).json({ message: "Horario no encontrado" });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener horario", error });
    }
};
export const getHorariosPorMedico = async (req, res) => {
    const { id_medico } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM HORARIOS WHERE ID_MEDICO = ? ORDER BY FECHA, HORA_INICIO",
            [id_medico]
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener horarios del médico", error });
    }
};
export const crearHorario = async (req, res) => {
    const { id_medico, fecha, hora_inicio, hora_fin, estado } = req.body;

    if (!id_medico || !fecha || !hora_inicio || !hora_fin) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    try {
        const [result] = await sql.query(
            `INSERT INTO HORARIOS
            (ID_MEDICO, FECHA, HORA_INICIO, HORA_FIN, ESTADO)
            VALUES (?, ?, ?, ?, ?)`,
            [id_medico, fecha, hora_inicio, hora_fin, estado || "LIBRE"]
        );

        res.status(201).json({
            message: "Horario creado exitosamente",
            id: result.insertId
        });

    } catch (error) {
        console.error("Error SQL al crear horario:", error);

        res.status(500).json({
            message: "Error al crear horario",
            error: error.sqlMessage || error.message || "Error desconocido"
        });
    }
};
export const actualizarHorario = async (req, res) => {
    const { id } = req.params;
    const { fecha, hora_inicio, hora_fin, estado } = req.body;

    try {
        const [exists] = await sql.query(
            "SELECT * FROM HORARIOS WHERE ID_HORARIO = ?",
            [id]
        );

        if (exists.length === 0) {
            return res.status(404).json({ message: "Horario no encontrado" });
        }

        await sql.query(
            `UPDATE HORARIOS SET 
                FECHA = ?, 
                HORA_INICIO = ?, 
                HORA_FIN = ?, 
                ESTADO = ?
            WHERE ID_HORARIO = ?`,
            [fecha, hora_inicio, hora_fin, estado, id]
        );

        res.json({ message: "Horario actualizado correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar horario", error });
    }
};
export const cambiarEstadoHorario = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        await sql.query(
            "UPDATE HORARIOS SET ESTADO = ? WHERE ID_HORARIO = ?",
            [estado, id]
        );

        res.json({ message: "Estado del horario actualizado" });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar estado", error });
    }
};
export const eliminarHorario = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "DELETE FROM HORARIOS WHERE ID_HORARIO = ?",
            [id]
        );

        result.affectedRows > 0
            ? res.json({ message: "Horario eliminado correctamente" })
            : res.status(404).json({ message: "Horario no encontrado" });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar horario", error });
    }
};
export const getHorariosDisponiblesPorMedico = async (req, res) => {
    const { id_medico, id_especialidad } = req.params;

    try {
        const [result] = await sql.query(
            `SELECT 
                H.*
             FROM HORARIOS H
             JOIN MEDICO M ON H.ID_MEDICO = M.ID_MEDICO
             WHERE H.ID_MEDICO = ?
               AND M.ID_ESPECIALIDAD = ?
               AND H.ESTADO = 'LIBRE'
             ORDER BY H.FECHA, H.HORA_INICIO`,
            [id_medico, id_especialidad]
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener horarios disponibles del médico",
            error
        });
    }
};
