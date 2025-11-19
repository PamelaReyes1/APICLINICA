import { sql } from "../db.js";

// Obtener todas las funciones
export const getFunciones = async (req, res) => {
    try {
        const [result] = await sql.query("SELECT * FROM FUNCIONES");
        res.json({ total: result.length, data: result });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener funciones", error });
    }
};

// Obtener una función por ID
export const getFuncionById = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM FUNCIONES WHERE ID_FUNCION = ?",
            [id]
        );

        result.length > 0
            ? res.json(result[0])
            : res.status(404).json({ message: "Función no encontrada" });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener función", error });
    }
};

// Obtener funciones por ID_ROL
export const getFuncionesPorRol = async (req, res) => {
    const { id_rol } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM FUNCIONES WHERE ID_ROL = ?",
            [id_rol]
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener funciones del rol", error });
    }
};

// Crear función
export const crearFuncion = async (req, res) => {
    const { descripcion, id_rol } = req.body;

    if (!descripcion || !id_rol) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    try {
        const [result] = await sql.query(
            "INSERT INTO FUNCIONES (DESCRIPCION, ID_ROL) VALUES (?, ?)",
            [descripcion, id_rol]
        );

        res.status(201).json({
            message: "Función creada correctamente",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ message: "Error al crear función", error });
    }
};

// Actualizar función
export const actualizarFuncion = async (req, res) => {
    const { id } = req.params;
    const { descripcion, id_rol } = req.body;

    try {
        const [result] = await sql.query(
            `UPDATE FUNCIONES 
             SET DESCRIPCION = ?, ID_ROL = ? 
             WHERE ID_FUNCION = ?`,
            [descripcion, id_rol, id]
        );

        result.affectedRows > 0
            ? res.json({ message: "Función actualizada correctamente" })
            : res.status(404).json({ message: "Función no encontrada" });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar función", error });
    }
};

// Eliminar una función
export const eliminarFuncion = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "DELETE FROM FUNCIONES WHERE ID_FUNCION = ?",
            [id]
        );

        result.affectedRows > 0
            ? res.json({ message: "Función eliminada correctamente" })
            : res.status(404).json({ message: "Función no encontrada" });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar función", error });
    }
};
