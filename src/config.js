import {config} from 'dotenv'
config()

export const BD_HOST=process.env.BD_HOST || 'mysql-pamela2025.alwaysdata.net'
export const BD_DATABASE=process.env.BD_DATABASE || 'pamela2025_clinica'
export const BD_USER=process.env.BD_USER ||'441600'
export const BD_PASSWORD=process.env.BD_PASSWORD || 'Pam3l4*2025'
export const BD_PORT=process.env.BD_PORT || 3306
export const PORT=process.env.PORT || 3000

