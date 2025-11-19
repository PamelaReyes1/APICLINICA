import express from 'express';
import cors from 'cors';
import path from 'path';

import CitaMedicaRoutes from './Routes/Citamedica.routes.js';
import EspecialidadRoutes from './Routes/Especialidades.routes.js';
import HistorialCRoutes from './Routes/HistorialC.js';
import HorariosRoutes from './Routes/Horarios.routes.js';
import MedicoRoutes from './Routes/Medico.routes.js';
import RolesGRoutes from './Routes/RolesG.routes.js';
import UsuarioRoutes from './Routes/Usuario.routes.js';
import FuncionesRoutes from './Routes/Funciones.routes.js';


const app = express()

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api', CitaMedicaRoutes);
app.use('/api', EspecialidadRoutes);
app.use('/api', HistorialCRoutes);
app.use('/api', HorariosRoutes);
app.use('/api', MedicoRoutes);
app.use('/api', RolesGRoutes);
app.use('/api', UsuarioRoutes);
app.use('/api', FuncionesRoutes);




app.use((req, res, next) => {
  res.status(404).json({
    message: 'PÁGINA NO ENCONTRADA'
  })
})

export default app;