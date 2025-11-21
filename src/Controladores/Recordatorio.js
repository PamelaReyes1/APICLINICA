import { sql } from "../db.js";

/* ============================================================
   OBTENER RECORDATORIOS POR MÉDICO (solo ENVIADO)
   ============================================================ */
export const getRecordatoriosByMedico = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            `SELECT 
                R.ID_RECORDATORIO,
                R.ID_MEDICO,
                R.ID_PACIENTE,
                R.ID_CITA,
                R.FECHA_ENVIO,
                R.MENSAJE,
                R.ESTADO,

                -- DATOS DEL PACIENTE
                P.ID_USUARIO AS PACIENTE_ID_USUARIO,
                P.NOMBRE AS PACIENTE_NOMBRE,
                P.APELLIDO AS PACIENTE_APELLIDO,
                P.CORREO_ELECTRONICO AS PACIENTE_CORREO,
                P.TELEFONO AS PACIENTE_TELEFONO,
                P.FOTO AS PACIENTE_FOTO,

                -- DATOS DEL MEDICO
                M.ID_USUARIO AS MEDICO_ID_USUARIO,
                UM.NOMBRE AS MEDICO_NOMBRE,
                UM.APELLIDO AS MEDICO_APELLIDO,
                UM.CORREO_ELECTRONICO AS MEDICO_CORREO,
                UM.TELEFONO AS MEDICO_TELEFONO,
                UM.FOTO AS MEDICO_FOTO,
                M.ID_ESPECIALIDAD,
                M.CONSULTORIO,

                -- DATOS DE LA CITA
                C.ESTADO AS CITA_ESTADO,
                C.FECHA_SOLICITUD,

                -- HORARIO
                H.FECHA AS FECHA_CITA,
                H.HORA_INICIO,
                H.HORA_FIN

            FROM RECORDATORIO R
            INNER JOIN USUARIO P ON P.ID_USUARIO = R.ID_PACIENTE
            INNER JOIN MEDICO M ON M.ID_MEDICO = R.ID_MEDICO
            INNER JOIN USUARIO UM ON UM.ID_USUARIO = M.ID_USUARIO
            INNER JOIN CITA_MEDICA C ON C.ID_CITA = R.ID_CITA
            INNER JOIN HORARIOS H ON H.ID_HORARIO = C.ID_HORARIO

            WHERE R.ID_MEDICO = ? AND R.ESTADO = 'ENVIADO'
            ORDER BY R.FECHA_ENVIO DESC`,
            [id]
        );

        res.json({ total: result.length, data: result });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener recordatorios por médico", error });
    }
};

export const getRecordatoriosByPaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            `SELECT 
                R.ID_RECORDATORIO,
                R.ID_MEDICO,
                R.ID_PACIENTE,
                R.ID_CITA,
                R.FECHA_ENVIO,
                R.MENSAJE,
                R.ESTADO,

                -- DATOS DEL PACIENTE
                P.ID_USUARIO AS PACIENTE_ID_USUARIO,
                P.NOMBRE AS PACIENTE_NOMBRE,
                P.APELLIDO AS PACIENTE_APELLIDO,
                P.CORREO_ELECTRONICO AS PACIENTE_CORREO,
                P.TELEFONO AS PACIENTE_TELEFONO,
                P.FOTO AS PACIENTE_FOTO,

                -- DATOS DEL MEDICO
                M.ID_MEDICO,
                M.ID_USUARIO AS MEDICO_ID_USUARIO,
                UM.NOMBRE AS MEDICO_NOMBRE,
                UM.APELLIDO AS MEDICO_APELLIDO,
                UM.CORREO_ELECTRONICO AS MEDICO_CORREO,
                UM.TELEFONO AS MEDICO_TELEFONO,
                UM.FOTO AS MEDICO_FOTO,
                M.ID_ESPECIALIDAD,
                M.CONSULTORIO,

                -- DATOS DE LA CITA
                C.ESTADO AS CITA_ESTADO,
                C.FECHA_SOLICITUD,

                -- HORARIO
                H.FECHA AS FECHA_CITA,
                H.HORA_INICIO,
                H.HORA_FIN

            FROM RECORDATORIO R
            INNER JOIN USUARIO P ON P.ID_USUARIO = R.ID_PACIENTE
            INNER JOIN MEDICO M ON M.ID_MEDICO = R.ID_MEDICO
            INNER JOIN USUARIO UM ON UM.ID_USUARIO = M.ID_USUARIO
            INNER JOIN CITA_MEDICA C ON C.ID_CITA = R.ID_CITA
            INNER JOIN HORARIOS H ON H.ID_HORARIO = C.ID_HORARIO

            WHERE R.ID_PACIENTE = ? AND R.ESTADO = 'ENVIADO'
            ORDER BY R.FECHA_ENVIO DESC`,
            [id]
        );

        res.json({ total: result.length, data: result });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener recordatorios por paciente", error });
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
             VALUES (?, ?, ?, ?, ?, 'ENVIADO')`,
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
