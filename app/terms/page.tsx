import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos de Servicio - Google Calendar Assistant',
  description: 'Términos de servicio del Google Calendar Assistant',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Términos de Servicio
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            <strong>Última actualización:</strong>{' '}
            {new Date().toLocaleDateString('es-ES')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              1. Aceptación de los Términos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Al utilizar el Google Calendar Assistant, aceptas estar sujeto a
              estos Términos de Servicio y a nuestra Política de Privacidad. Si
              no estás de acuerdo con estos términos, no utilices nuestro
              servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              2. Descripción del Servicio
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              El Google Calendar Assistant es una aplicación que utiliza
              inteligencia artificial para ayudarte a gestionar tu Google
              Calendar. El servicio incluye:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Visualización y gestión de eventos de calendario</li>
              <li>Creación, edición y eliminación de eventos</li>
              <li>Verificación de disponibilidad (FreeBusy)</li>
              <li>Integración con Google Calendar API</li>
              <li>Interfaz conversacional con IA</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              3. Uso Aceptable
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Al usar nuestro servicio, te comprometes a:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Utilizar el servicio solo para fines legítimos</li>
              <li>No interferir con el funcionamiento del servicio</li>
              <li>No intentar acceder a cuentas de otros usuarios</li>
              <li>Respetar los derechos de propiedad intelectual</li>
              <li>No usar el servicio para actividades ilegales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              4. Cuenta de Usuario
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Para utilizar el servicio, debes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Tener una cuenta válida de Google</li>
              <li>Proporcionar información precisa y actualizada</li>
              <li>Mantener la confidencialidad de tus credenciales</li>
              <li>Ser responsable de todas las actividades en tu cuenta</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              5. Privacidad y Datos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tu privacidad es importante para nosotros. El manejo de tus datos
              personales se rige por nuestra Política de Privacidad, que forma
              parte integral de estos términos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              6. Limitación de Responsabilidad
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              El servicio se proporciona "tal como está". No garantizamos que:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>El servicio esté libre de errores o interrupciones</li>
              <li>Los resultados sean precisos o confiables</li>
              <li>El servicio satisfaga tus necesidades específicas</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              En ningún caso seremos responsables por daños indirectos,
              incidentales o consecuenciales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              7. Propiedad Intelectual
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              El Google Calendar Assistant y su contenido están protegidos por
              derechos de autor y otras leyes de propiedad intelectual.
              Conservamos todos los derechos sobre nuestro servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              8. Terminación
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Podemos suspender o terminar tu acceso al servicio en cualquier
              momento, con o sin previo aviso, por violación de estos términos o
              por cualquier otra razón a nuestra discreción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              9. Modificaciones
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Los cambios entrarán en vigor inmediatamente después de
              su publicación en la aplicación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              10. Ley Aplicable
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Estos términos se rigen por las leyes del Estado de California,
              Estados Unidos, sin consideración a sus principios de conflicto de
              leyes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              11. Contacto
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Si tienes preguntas sobre estos términos de servicio, puedes
              contactarnos en:
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Email:</strong> legal@front10devs.com
              <br />
              <strong>Dirección:</strong> Front10 Devs, San Francisco, CA, USA
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
