import { sql } from "../db.js";


export const getCitas = async (req, res) => {
    try {
        const [result] = await sql.query("SELECT * FROM CITA_MEDICA");
        res.json({ total: result.length, data: result });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener citas", error });
    }
};

// Obtener cita por ID
export const getCitaById = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await sql.query("SELECT * FROM CITA_MEDICA WHERE ID_CITA = ?", [id]);
        result.length > 0
            ? res.json(result[0])
            : res.status(404).json({ message: "Cita no encontrada" });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener cita", error });
    }
};

// Crear cita (paciente agenda una cita)
export const crearCita = async (req, res) => {
    const { id_horario, id_paciente } = req.body;

    if (!id_horario || !id_paciente) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    try {
        // Verificar si ya existe una cita en ese horario
        const [existe] = await sql.query(
            "SELECT * FROM CITA_MEDICA WHERE ID_HORARIO = ? AND ESTADO <> 'CANCELADA'",
            [id_horario]
        );

        if (existe.length > 0) {
            return res.status(400).json({ message: "El horario ya está ocupado" });
        }

        // Marcar horario como ocupado
        await sql.query("UPDATE HORARIOS SET ESTADO='OCUPADO' WHERE ID_HORARIO=?", [id_horario]);

        // Crear cita
        const [result] = await sql.query(
            `INSERT INTO CITA_MEDICA (ID_HORARIO, ID_PACIENTE) VALUES (?, ?)`,
            [id_horario, id_paciente]
        );

        res.status(201).json({
            message: "Cita creada con éxito",
            id: result.insertId,
        });

    } catch (error) {
        res.status(500).json({ message: "Error al crear cita", error });
    }
};

// Obtener citas por paciente
export const getCitasPorPaciente = async (req, res) => {
    const { id_paciente } = req.params;

    try {
        const [result] = await sql.query(
            `SELECT C.*, H.FECHA, H.HORA_INICIO, H.HORA_FIN, M.ID_MEDICO, U.NOMBRE AS MEDICO_NOMBRE, 
                    U.APELLIDO AS MEDICO_APELLIDO 
             FROM CITA_MEDICA C
             INNER JOIN HORARIOS H ON H.ID_HORARIO = C.ID_HORARIO
             INNER JOIN MEDICO M ON M.ID_MEDICO = H.ID_MEDICO
             INNER JOIN USUARIO U ON U.ID_USUARIO = M.ID_USUARIO
             WHERE C.ID_PACIENTE = ?
             ORDER BY H.FECHA DESC`,
            [id_paciente]
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener citas del paciente", error });
    }
};

// Obtener citas por médico
export const getCitasPorMedico = async (req, res) => {
    const { id_medico } = req.params;

    try {
        const [result] = await sql.query(
            `SELECT C.*, H.FECHA, H.HORA_INICIO, H.HORA_FIN, 
                    U.NOMBRE AS PACIENTE_NOMBRE, U.APELLIDO AS PACIENTE_APELLIDO
             FROM CITA_MEDICA C
             INNER JOIN HORARIOS H ON H.ID_HORARIO = C.ID_HORARIO
             INNER JOIN USUARIO U ON U.ID_USUARIO = C.ID_PACIENTE
             WHERE H.ID_MEDICO = ?
             ORDER BY H.FECHA DESC`,
            [id_medico]
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener citas del médico", error });
    }
};

// Confirmar cita
export const confirmarCita = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "UPDATE CITA_MEDICA SET ESTADO='CONFIRMADA' WHERE ID_CITA = ?",
            [id]
        );

        result.affectedRows > 0
            ? res.json({ message: "Cita confirmada" })
            : res.status(404).json({ message: "Cita no encontrada" });

    } catch (error) {
        res.status(500).json({ message: "Error al confirmar cita", error });
    }
};

// Cancelar cita
export const cancelarCita = async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener horario de la cita
        const [cita] = await sql.query("SELECT ID_HORARIO FROM CITA_MEDICA WHERE ID_CITA = ?", [id]);

        if (cita.length === 0) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

        const id_horario = cita[0].ID_HORARIO;

        // Cambiar estado cita
        await sql.query("UPDATE CITA_MEDICA SET ESTADO='CANCELADA' WHERE ID_CITA = ?", [id]);

        // Liberar horario
        await sql.query("UPDATE HORARIOS SET ESTADO='LIBRE' WHERE ID_HORARIO = ?", [id_horario]);

        res.json({ message: "Cita cancelada con éxito" });

    } catch (error) {
        res.status(500).json({ message: "Error al cancelar cita", error });
    }
};

// Actualizar cita (cambiar de horario)
export const actualizarCita = async (req, res) => {
    const { id } = req.params;
    const { nuevo_horario } = req.body;

    try {
        // Obtener horario viejo
        const [cita] = await sql.query("SELECT ID_HORARIO FROM CITA_MEDICA WHERE ID_CITA = ?", [id]);

        if (cita.length === 0) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

        const horarioViejo = cita[0].ID_HORARIO;

        // Liberar horario anterior
        await sql.query("UPDATE HORARIOS SET ESTADO='LIBRE' WHERE ID_HORARIO = ?", [horarioViejo]);

        // Ocupar nuevo horario
        await sql.query("UPDATE HORARIOS SET ESTADO='OCUPADO' WHERE ID_HORARIO = ?", [nuevo_horario]);

        // Actualizar cita
        await sql.query(
            "UPDATE CITA_MEDICA SET ID_HORARIO=? WHERE ID_CITA = ?",
            [nuevo_horario, id]
        );

        res.json({ message: "Cita actualizada correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar cita", error });
    }
};

// Eliminar cita (solo si no está confirmada)
export const eliminarCita = async (req, res) => {
    const { id } = req.params;

    try {
        const [cita] = await sql.query(
            "SELECT * FROM CITA_MEDICA WHERE ID_CITA = ?",
            [id]
        );

        if (cita.length === 0)
            return res.status(404).json({ message: "Cita no encontrada" });

        if (cita[0].ESTADO === "CONFIRMADA")
            return res.status(400).json({ message: "No se puede eliminar una cita confirmada" });

        await sql.query("DELETE FROM CITA_MEDICA WHERE ID_CITA = ?", [id]);

        res.json({ message: "Cita eliminada correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar cita", error });
    }
};
