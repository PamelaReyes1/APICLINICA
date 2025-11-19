import { sql } from '../db.js';

export const getHistorialCitas = async (req, res) => {
    try {
        const [result] = await sql.query("SELECT * FROM HISTORIAL_DE_CITAS");
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener historial", error });
    }
};
export const getHistorialPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM HISTORIAL_DE_CITAS WHERE ID_HISTORIAL = ? LIMIT 1",
            [id]
        );

        result.length > 0
            ? res.json(result[0])
            : res.status(404).json({ message: "Historial no encontrado" });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener historial", error });
    }
};
export const getHistorialPorCita = async (req, res) => {
    const { id_cita } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM HISTORIAL_DE_CITAS WHERE ID_CITA = ?",
            [id_cita]
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener historial de la cita", error });
    }
};
export const crearHistorialCita = async (req, res) => {
    const { id_cita, observaciones } = req.body;

    if (!id_cita) {
        return res.status(400).json({ message: "El ID de la cita es obligatorio" });
    }

    try {
        const [result] = await sql.query(
            `INSERT INTO HISTORIAL_DE_CITAS (ID_CITA, OBSERVACIONES)
            VALUES (?, ?)`,
            [id_cita, observaciones]
        );

        res.status(201).json({
            message: "Registro de historial creado",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ message: "Error al crear historial", error });
    }
};
export const actualizarHistorialCita = async (req, res) => {
    const { id } = req.params;
    const { observaciones } = req.body;

    try {
        const [exists] = await sql.query(
            "SELECT * FROM HISTORIAL_DE_CITAS WHERE ID_HISTORIAL = ?",
            [id]
        );

        if (exists.length === 0) {
            return res.status(404).json({ message: "Historial no encontrado" });
        }

        await sql.query(
            `UPDATE HISTORIAL_DE_CITAS SET 
                OBSERVACIONES = ?
            WHERE ID_HISTORIAL = ?`,
            [observaciones, id]
        );

        res.json({ message: "Historial actualizado correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar historial", error });
    }
};
export const eliminarHistorialCita = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "DELETE FROM HISTORIAL_DE_CITAS WHERE ID_HISTORIAL = ?",
            [id]
        );

        result.affectedRows > 0
            ? res.json({ message: "Historial eliminado correctamente" })
            : res.status(404).json({ message: "Historial no encontrado" });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar historial", error });
    }
};
