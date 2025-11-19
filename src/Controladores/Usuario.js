import { sql } from "../bd.js";


/* ==========================================================
    USUARIO — CONTROLADORES ACTUALIZADOS
============================================================ */


// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const [result] = await sql.query("SELECT * FROM USUARIO");
        res.json({ total: result.length, data: result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error al obtener usuarios", error });
    }
};


// Buscar usuario por ID
export const BuscarUsuarioPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM USUARIO WHERE ID_USUARIO = ? LIMIT 1",
            [id]
        );

        result.length > 0
            ? res.json(result[0])
            : res.status(404).json({ message: "Usuario no encontrado" });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario", error });
    }
};


// Crear usuario (con contraseña)
export const crearUsuario = async (req, res) => {
    const {
        nombre,
        apellido,
        correo_electronico,
        contrasena,
        telefono,
        ubicacion,
        id_rol,
        foto
    } = req.body;

    if (!nombre || !apellido || !correo_electronico || !contrasena || !id_rol) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    try {
        // Verificar correo repetido
        const [existe] = await sql.query(
            "SELECT ID_USUARIO FROM USUARIO WHERE CORREO_ELECTRONICO = ? LIMIT 1",
            [correo_electronico]
        );

        if (existe.length > 0) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        const [result] = await sql.query(
            `INSERT INTO USUARIO 
            (NOMBRE, APELLIDO, CORREO_ELECTRONICO, CONTRASENA, TELEFONO, UBICACION, ID_ROL, FOTO)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                apellido,
                correo_electronico,
                contrasena,
                telefono,
                ubicacion,
                id_rol,
                foto
            ]
        );

        res.status(201).json({
            message: "Usuario creado exitosamente",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ message: "Error al crear usuario", error });
    }
};


// Actualizar usuario (datos generales)
export const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const {
        nombre,
        apellido,
        correo_electronico,
        telefono,
        ubicacion,
        id_rol,
        foto,
        estado
    } = req.body;

    try {
        const [userExists] = await sql.query(
            "SELECT * FROM USUARIO WHERE ID_USUARIO = ?",
            [id]
        );

        if (userExists.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await sql.query(
            `UPDATE USUARIO SET 
                NOMBRE=?, 
                APELLIDO=?, 
                CORREO_ELECTRONICO=?, 
                TELEFONO=?, 
                UBICACION=?, 
                ID_ROL=?, 
                FOTO=?, 
                ESTADO=?
            WHERE ID_USUARIO=?`,
            [
                nombre,
                apellido,
                correo_electronico,
                telefono,
                ubicacion,
                id_rol,
                foto,
                estado,
                id
            ]
        );

        res.json({ message: "Usuario actualizado correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario", error });
    }
};


// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await sql.query(
            "DELETE FROM USUARIO WHERE ID_USUARIO = ?",
            [id]
        );

        result.affectedRows > 0
            ? res.json({ message: "Usuario eliminado correctamente" })
            : res.status(404).json({ message: "Usuario no encontrado" });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario", error });
    }
};



// Verificar correo
export const verificarCorreo = async (req, res) => {
    const { correo } = req.params;

    try {
        const [result] = await sql.query(
            "SELECT * FROM USUARIO WHERE CORREO_ELECTRONICO = ? LIMIT 1",
            [correo]
        );

        result.length > 0
            ? res.json({ existe: true, usuario: result[0] })
            : res.json({ existe: false });

    } catch (error) {
        res.status(500).json({ message: "Error al verificar correo", error });
    }
};



// LOGIN (correo o teléfono + contraseña)
export const loginUsuario = async (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({ message: "Usuario y contraseña son obligatorios" });
    }

    try {
        const [result] = await sql.query(
            `SELECT * FROM USUARIO 
             WHERE CORREO_ELECTRONICO = ? OR TELEFONO = ?
             LIMIT 1`,
            [usuario, usuario]
        );

        if (result.length === 0) {
            return res.json({ success: false, message: "Usuario no encontrado" });
        }

        const user = result[0];

        if (user.CONTRASENA !== contrasena) {
            return res.json({ success: false, message: "Contraseña incorrecta" });
        }

        // Si deseas ocultar contraseña:
        delete user.CONTRASENA;

        res.json({
            success: true,
            usuario: user
        });

    } catch (error) {
        res.status(500).json({ message: "Error en login", error });
    }
};



export const actualizarContrasena = async (req, res) => {
    const { id } = req.params;
    const { contrasena } = req.body;

    if (!contrasena)
        return res.status(400).json({ message: "La contraseña es obligatoria" });

    try {
        const [result] = await sql.query(
            "UPDATE USUARIO SET CONTRASENA=? WHERE ID_USUARIO = ?",
            [contrasena, id]
        );

        result.affectedRows > 0
            ? res.json({ message: "Contraseña actualizada correctamente" })
            : res.status(404).json({ message: "Usuario no encontrado" });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar contraseña", error });
    }
};



// Cambiar estado (activo/inactivo)
export const cambiarEstadoUsuario = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        await sql.query(
            "UPDATE USUARIO SET ESTADO=? WHERE ID_USUARIO=?",
            [estado, id]
        );

        res.json({ message: "Estado actualizado correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al cambiar estado", error });
    }
};
