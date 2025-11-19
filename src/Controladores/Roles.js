    import { sql } from '../db.js';

    export const getRoles = async (req, res) => {
        try {
            const [result] = await sql.query("SELECT * FROM ROLES");
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener roles", error });
        }
    };
    export const getRolPorId = async (req, res) => {
        const { id } = req.params;

        try {
            const [result] = await sql.query(
                "SELECT * FROM ROLES WHERE ID_ROL = ? LIMIT 1",
                [id]
            );

            result.length > 0
                ? res.json(result[0])
                : res.status(404).json({ message: "Rol no encontrado" });

        } catch (error) {
            res.status(500).json({ message: "Error al obtener rol", error });
        }
    };