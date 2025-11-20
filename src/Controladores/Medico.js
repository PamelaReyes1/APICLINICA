import { sql } from "../db.js";

export const getMedicos = async (req, res) => {
    try {
        const [result] = await sql.query("SELECT * FROM MEDICO");
        res.json({ total: result.length, data: result });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener médicos", error });
    }
};
export const getMedicoById = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM MEDICO WHERE ID_MEDICO = ?",
            [id]
        );

        result.length > 0
            ? res.json(result[0])
            : res.status(404).json({ message: "Médico no encontrado" });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener médico", error });
    }
};
export const getMedicoByIdUsu = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM MEDICO WHERE ID_USUARIO  = ?",
            [id]
        );

        result.length > 0
            ? res.json(result)
            : res.status(404).json({ message: "Médico no encontrado" });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener médico", error });
    }
};
export const getMedicosPorEspecialidad = async (req, res) => {
    const { id_especialidad } = req.params;

    try {
        const [result] = await sql.query(
            `SELECT 
                M.ID_MEDICO,
                U.NOMBRE,
                U.APELLIDO,
                U.CORREO_ELECTRONICO,
                U.TELEFONO,
                M.ID_ESPECIALIDAD
             FROM MEDICO M
             JOIN USUARIO U ON M.ID_USUARIO = U.ID_USUARIO
             WHERE M.ID_ESPECIALIDAD = ?`,
            [id_especialidad]
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener médicos por especialidad",
            error
        });
    }
};

export const crearMedico = async (req, res) => {
    const { id_usuario, id_especialidad, consultorio } = req.body;

    if (!id_usuario || !id_especialidad) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    try {
        const [result] = await sql.query(
            `INSERT INTO MEDICO (ID_USUARIO, ID_ESPECIALIDAD, CONSULTORIO)
             VALUES (?, ?, ?)`,
            [id_usuario, id_especialidad, consultorio || null]
        );

        res.status(201).json({
            message: "Médico creado correctamente",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ message: "Error al crear médico", error });
    }
};

export const actualizarMedico = async (req, res) => {
    const { id } = req.params;
    const { id_especialidad, consultorio } = req.body;

    try {
        const [existe] = await sql.query(
            "SELECT * FROM MEDICO WHERE ID_MEDICO = ?",
            [id]
        );

        if (existe.length === 0)
            return res.status(404).json({ message: "Médico no encontrado" });

        await sql.query(
            `UPDATE MEDICO SET 
                ID_ESPECIALIDAD = ?, 
                CONSULTORIO = ?
            WHERE ID_MEDICO = ?`,
            [id_especialidad, consultorio, id]
        );

        res.json({ message: "Médico actualizado correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar médico", error });
    }
};

// Eliminar médico
export const eliminarMedico = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "DELETE FROM MEDICO WHERE ID_MEDICO = ?",
            [id]
        );

        result.affectedRows > 0
            ? res.json({ message: "Médico eliminado correctamente" })
            : res.status(404).json({ message: "Médico no encontrado" });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar médico", error });
    }
};
export const getCitasPorVariosMedicos = async (req, res) => {
    const { ids } = req.body; // array de IDs de médico

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Debe enviar un array de IDs de médicos" });
    }

    try {
        const [result] = await sql.query(`
            SELECT 
                C.ID_CITA,
                C.ID_HORARIO,
                C.ID_PACIENTE,
                C.ESTADO,
                C.FECHA_SOLICITUD,

                H.FECHA,
                H.HORA_INICIO,
                H.HORA_FIN,

                M.ID_MEDICO,
                M.CONSULTORIO,
                E.DESCRIPCION AS ESPECIALIDAD,

                -- DATOS DEL MÉDICO
                UM.NOMBRE  AS MEDICO_NOMBRE,
                UM.APELLIDO AS MEDICO_APELLIDO,

                -- DATOS DEL PACIENTE (DE SU USUARIO)
                UP.NOMBRE  AS PACIENTE_NOMBRE,
                UP.APELLIDO AS PACIENTE_APELLIDO

            FROM CITA_MEDICA C
            INNER JOIN HORARIOS H ON H.ID_HORARIO = C.ID_HORARIO

            INNER JOIN MEDICO M ON M.ID_MEDICO = H.ID_MEDICO
            INNER JOIN USUARIO UM ON UM.ID_USUARIO = M.ID_USUARIO   -- Médico

            INNER JOIN ESPECIALIDADES E ON E.ID_ESPECIALIDAD = M.ID_ESPECIALIDAD

            -- PACIENTE → DIRECTAMENTE USUARIO
            INNER JOIN USUARIO UP ON UP.ID_USUARIO = C.ID_PACIENTE   -- Paciente

            WHERE M.ID_MEDICO IN (?)
            ORDER BY H.FECHA DESC
            
        `, [ids]);

        res.json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al obtener citas del médico",
            error
        });
    }
};

