#!/usr/bin/env node

// Script para verificar las variables de entorno necesarias
console.log('🔍 Verificando variables de entorno...\n');

const requiredVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

let allPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
    allPresent = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPresent) {
  console.log('✅ Todas las variables de entorno están configuradas');
} else {
  console.log('❌ Faltan variables de entorno');
  console.log('\n📝 Para configurar las variables:');
  console.log('1. Crea un archivo .env.local en la raíz del proyecto');
  console.log('2. Agrega las variables faltantes con sus valores');
  console.log('3. Reinicia el servidor de desarrollo');
}

console.log('\n🔗 Para obtener las credenciales de Google:');
console.log('1. Ve a https://console.cloud.google.com/');
console.log('2. Crea un nuevo proyecto o selecciona uno existente');
console.log('3. Habilita la Google Calendar API');
console.log('4. Crea credenciales OAuth 2.0');
console.log('5. Configura las URLs de redirección autorizadas');
