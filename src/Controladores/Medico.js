import { sql } from "../bd.js";


export const getHorarios = async (req, res) => {
    try {
        const [result] = await sql.query("SELECT * FROM HORARIOS ORDER BY FECHA, HORA_INICIO");
        res.json({ total: result.length, data: result });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener horarios", error });
    }
};

export const getHorarioById = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM HORARIOS WHERE ID_HORARIO = ?",
            [id]
        );

        result.length > 0
            ? res.json(result[0])
            : res.status(404).json({ message: "Horario no encontrado" });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener horario", error });
    }
};


// Obtener horarios por médico
export const getHorariosPorMedico = async (req, res) => {
    const { id_medico } = req.params;

    try {
        const [result] = await sql.query(
            `SELECT * 
             FROM HORARIOS 
             WHERE ID_MEDICO = ?
             ORDER BY FECHA, HORA_INICIO`,
            [id_medico]
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener horarios del médico", error });
    }
};


// Obtener horarios disponibles para un médico
export const getHorariosDisponiblesPorMedico = async (req, res) => {
    const { id_medico } = req.params;

    try {
        const [result] = await sql.query(
            `SELECT *
             FROM HORARIOS
             WHERE ID_MEDICO = ? AND ESTADO = 'LIBRE'
             ORDER BY FECHA, HORA_INICIO`,
            [id_medico]
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener horarios disponibles", error });
    }
};


// Crear un horario
export const crearHorario = async (req, res) => {
    const { id_medico, fecha, hora_inicio, hora_fin } = req.body;

    if (!id_medico || !fecha || !hora_inicio || !hora_fin) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    try {
        // Validar que el horario no choque con otro horario del mismo médico
        const [existe] = await sql.query(
            `SELECT *
             FROM HORARIOS
             WHERE ID_MEDICO = ?
               AND FECHA = ?
               AND (
                    (HORA_INICIO <= ? AND HORA_FIN > ?) OR
                    (HORA_INICIO < ? AND HORA_FIN >= ?)
               )
            `,
            [id_medico, fecha, hora_inicio, hora_inicio, hora_fin, hora_fin]
        );

        if (existe.length > 0) {
            return res.status(400).json({
                message: "El médico ya tiene un horario que se superpone"
            });
        }

        const [result] = await sql.query(
            `INSERT INTO HORARIOS (ID_MEDICO, FECHA, HORA_INICIO, HORA_FIN, ESTADO)
             VALUES (?, ?, ?, ?, 'LIBRE')`,
            [id_medico, fecha, hora_inicio, hora_fin]
        );

        res.status(201).json({
            message: "Horario creado correctamente",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ message: "Error al crear horario", error });
    }
};


// Actualizar horario (fecha y horas)
export const actualizarHorario = async (req, res) => {
    const { id } = req.params;
    const { fecha, hora_inicio, hora_fin, estado } = req.body;

    try {
        const [existe] = await sql.query(
            "SELECT * FROM HORARIOS WHERE ID_HORARIO = ?",
            [id]
        );

        if (existe.length === 0) {
            return res.status(404).json({ message: "Horario no encontrado" });
        }

        await sql.query(
            `UPDATE HORARIOS 
             SET FECHA=?, HORA_INICIO=?, HORA_FIN=?, ESTADO=?
             WHERE ID_HORARIO=?`,
            [fecha, hora_inicio, hora_fin, estado, id]
        );

        res.json({ message: "Horario actualizado correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar horario", error });
    }
};


// Cancelar horario
export const cancelarHorario = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "UPDATE HORARIOS SET ESTADO='CANCELADO' WHERE ID_HORARIO = ?",
            [id]
        );

        result.affectedRows > 0
            ? res.json({ message: "Horario cancelado" })
            : res.status(404).json({ message: "Horario no encontrado" });

    } catch (error) {
        res.status(500).json({ message: "Error al cancelar horario", error });
    }
};


// Eliminar horario (solo si está libre)
export const eliminarHorario = async (req, res) => {
    const { id } = req.params;

    try {
        const [horario] = await sql.query(
            "SELECT ESTADO FROM HORARIOS WHERE ID_HORARIO = ?",
            [id]
        );

        if (horario.length === 0)
            return res.status(404).json({ message: "Horario no encontrado" });

        if (horario[0].ESTADO !== "LIBRE")
            return res.status(400).json({
                message: "No se puede eliminar un horario ocupado o cancelado"
            });

        await sql.query("DELETE FROM HORARIOS WHERE ID_HORARIO = ?", [id]);

        res.json({ message: "Horario eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar horario", error });
    }
};
