# 🔧 Configuración de Google Calendar API

## 📋 **Variables de Entorno Requeridas**

### **Obligatorias:**

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### **Opcionales:**

```env
# Solo necesaria si planeas hacer llamadas directas a la API desde el servidor
GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key_here
```

## 🚀 **Pasos para Configurar Google Cloud Console**

### **1. Crear Proyecto**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el ID del proyecto

### **2. Habilitar Google Calendar API**

1. En el menú lateral, ve a **"APIs y servicios" > "Biblioteca"**
2. Busca **"Google Calendar API"**
3. Haz clic en **"Habilitar"**

### **3. Configurar OAuth 2.0**

1. Ve a **"APIs y servicios" > "Credenciales"**
2. Haz clic en **"Crear credenciales" > "ID de cliente OAuth 2.0"**

#### **3.1. Configurar Pantalla de Consentimiento (si es la primera vez):**

- **Tipo de usuario:** Externo
- **Nombre de la aplicación:** Google Calendar Assistant
- **Email de soporte:** tu email
- **Dominio del desarrollador:** tu dominio (o localhost para desarrollo)
- **Scopes:** Agrega estos scopes:
  - `https://www.googleapis.com/auth/calendar`
  - `https://www.googleapis.com/auth/calendar.events`
- **Usuarios de prueba:** Agrega tu email

#### **3.2. Configurar ID de Cliente OAuth 2.0:**

- **Tipo de aplicación:** Aplicación web
- **Nombre:** Google Calendar Assistant
- **Orígenes JavaScript autorizados:**
  - `http://localhost:3000` (para desarrollo)
  - `https://tu-dominio.com` (para producción)
- **URI de redirección autorizados:**
  - `http://localhost:3000/api/auth/callback/google` (para desarrollo)
  - `https://tu-dominio.com/api/auth/callback/google` (para producción)

### **4. Obtener Credenciales**

1. **Copia el "ID de cliente"** → `GOOGLE_CLIENT_ID`
2. **Copia el "Secreto de cliente"** → `GOOGLE_CLIENT_SECRET`

### **5. Generar NEXTAUTH_SECRET**

```bash
# En tu terminal, ejecuta:
openssl rand -base64 32
```

Copia el resultado → `NEXTAUTH_SECRET`

## 🔑 **API Key (Opcional)**

La API Key solo es necesaria si planeas hacer llamadas directas a la API desde el servidor. Para nuestro caso de uso con OAuth2, **NO es necesaria**.

### **Si quieres obtenerla:**

1. En **"APIs y servicios" > "Credenciales"**
2. Haz clic en **"Crear credenciales" > "Clave de API"**
3. Copia la clave generada → `GOOGLE_CALENDAR_API_KEY`

## 📝 **Archivo .env Final**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Google Calendar API Configuration
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
NEXTAUTH_SECRET=tu_secreto_generado_aqui
NEXTAUTH_URL=http://localhost:3000

# Optional - Only if you need server-side API calls
# GOOGLE_CALENDAR_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

## ✅ **Verificación**

Una vez configurado, puedes probar la aplicación:

1. **Inicia el servidor de desarrollo:**

   ```bash
   pnpm dev
   ```

2. **Ve a** `http://localhost:3000`

3. **Haz clic en "Sign in with Google"**

4. **Autoriza los permisos de calendario**

5. **¡Listo!** Ya puedes usar el asistente de Google Calendar

## 🚨 **Troubleshooting**

### **Error: "redirect_uri_mismatch"**

- Verifica que las URIs de redirección en Google Cloud Console coincidan exactamente con las de tu aplicación

### **Error: "access_denied"**

- Asegúrate de que tu email esté en la lista de usuarios de prueba
- Verifica que los scopes estén configurados correctamente

### **Error: "invalid_client"**

- Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` sean correctos
- Asegúrate de que no haya espacios extra en las variables de entorno

## 🔒 **Seguridad**

- **Nunca** commits el archivo `.env.local` al repositorio
- Usa diferentes credenciales para desarrollo y producción
- Rota las credenciales regularmente
- Limita los orígenes JavaScript autorizados a tus dominios reales
