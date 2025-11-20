import { sql } from '../db.js';

export const getEspecialidades = async (req, res) => {
    try {
        const [result] = await sql.query("SELECT * FROM ESPECIALIDADES WHERE ESTADO='ACTIVO'");
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener especialidades", error });
    }
};
export const getEspecialidadPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM ESPECIALIDADES WHERE ID_ESPECIALIDAD = ? LIMIT 1",
            [id]
        );

        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: "Especialidad no encontrada" });
        }

    } catch (error) {
        res.status(500).json({ message: "Error al obtener especialidad", error });
    }
};
export const getEspecialidadPorIdMedico = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM ESPECIALIDADES WHERE ID_ESPECIALIDAD = ? ",
            [id]
        );

        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: "Especialidad no encontrada" });
        }

    } catch (error) {
        res.status(500).json({ message: "Error al obtener especialidad", error });
    }
};

