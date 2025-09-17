import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Google Calendar Assistant',
  description: 'Terms of service for Google Calendar Assistant',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Terms of Service
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            <strong>Last updated:</strong>{' '}
            {new Date().toLocaleDateString('en-US')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              By using the Google Calendar Assistant, you agree to be bound by
              these Terms of Service and our Privacy Policy. If you do not agree
              to these terms, do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              2. Service Description
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Google Calendar Assistant is an application that uses
              artificial intelligence to help you manage your Google Calendar.
              The service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Calendar event visualization and management</li>
              <li>Event creation, editing, and deletion</li>
              <li>Availability checking (FreeBusy)</li>
              <li>Google Calendar API integration</li>
              <li>Conversational AI interface</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              3. Acceptable Use
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              When using our service, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Use the service only for legitimate purposes</li>
              <li>Not interfere with the service operation</li>
              <li>Not attempt to access other users&apos; accounts</li>
              <li>Respect intellectual property rights</li>
              <li>Not use the service for illegal activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              4. User Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              To use the service, you must:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Have a valid Google account</li>
              <li>Provide accurate and up-to-date information</li>
              <li>Maintain the confidentiality of your credentials</li>
              <li>Be responsible for all activities on your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              5. Privacy and Data
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your privacy is important to us. The handling of your personal
              data is governed by our Privacy Policy, which forms an integral
              part of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The service is provided &quot;as is&quot;. We do not guarantee
              that:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>The service is free from errors or interruptions</li>
              <li>Results are accurate or reliable</li>
              <li>The service meets your specific needs</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              In no event shall we be liable for indirect, incidental, or
              consequential damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Google Calendar Assistant and its content are protected by
              copyright and other intellectual property laws. We retain all
              rights to our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              8. Termination
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We may suspend or terminate your access to the service at any
              time, with or without notice, for violation of these terms or for
              any other reason at our discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              9. Modifications
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We reserve the right to modify these terms at any time. Changes
              will take effect immediately after publication in the application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              10. Governing Law
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              These terms are governed by the laws of the State of California,
              United States, without regard to its conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              11. Contact
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you have questions about these terms of service, you can
              contact us at:
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Email:</strong> legal@front10devs.com
              <br />
              <strong>Address:</strong> Front10 Devs, San Francisco, CA, USA
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
