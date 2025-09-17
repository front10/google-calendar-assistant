import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad - Google Calendar Assistant',
  description: 'Política de privacidad del Google Calendar Assistant',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Política de Privacidad
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            <strong>Última actualización:</strong>{' '}
            {new Date().toLocaleDateString('es-ES')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              1. Información que Recopilamos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              El Google Calendar Assistant recopila la siguiente información:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>
                Información de autenticación de Google (email, nombre, ID de
                usuario)
              </li>
              <li>Datos de eventos de calendario que autorizas compartir</li>
              <li>
                Información de uso de la aplicación (logs de interacciones)
              </li>
              <li>
                Datos de sesión y cookies necesarias para el funcionamiento
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              2. Cómo Utilizamos tu Información
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Utilizamos tu información para:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Proporcionar funcionalidades de gestión de calendario</li>
              <li>Mejorar la experiencia del usuario</li>
              <li>Procesar solicitudes de eventos y disponibilidad</li>
              <li>Mantener la seguridad de la aplicación</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              3. Compartir Información
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No vendemos, alquilamos ni compartimos tu información personal con
              terceros, excepto cuando sea necesario para:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Cumplir con obligaciones legales</li>
              <li>Proteger nuestros derechos y seguridad</li>
              <li>Proporcionar servicios a través de proveedores confiables</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              4. Seguridad de Datos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tu información contra acceso no autorizado, alteración,
              divulgación o destrucción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              5. Tus Derechos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tienes derecho a:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Acceder a tu información personal</li>
              <li>Rectificar datos inexactos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Retirar el consentimiento en cualquier momento</li>
              <li>Desconectar tu cuenta de Google</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              6. Cookies y Tecnologías Similares
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Utilizamos cookies y tecnologías similares para mejorar la
              funcionalidad de la aplicación y recordar tus preferencias.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              7. Cambios a esta Política
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Podemos actualizar esta política de privacidad ocasionalmente. Te
              notificaremos sobre cambios significativos a través de la
              aplicación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              8. Contacto
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Si tienes preguntas sobre esta política de privacidad, puedes
              contactarnos en:
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Email:</strong> privacy@front10devs.com
              <br />
              <strong>Dirección:</strong> Front10 Devs, San Francisco, CA, USA
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
