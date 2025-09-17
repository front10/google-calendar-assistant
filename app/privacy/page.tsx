import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Google Calendar Assistant',
  description: 'Privacy policy for Google Calendar Assistant',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Privacy Policy
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            <strong>Last updated:</strong>{' '}
            {new Date().toLocaleDateString('en-US')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Google Calendar Assistant collects the following information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Google authentication information (email, name, user ID)</li>
              <li>Calendar event data that you authorize us to share</li>
              <li>Application usage information (interaction logs)</li>
              <li>Session data and cookies necessary for functionality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Provide calendar management functionality</li>
              <li>Improve user experience</li>
              <li>Process event requests and availability</li>
              <li>Maintain application security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              3. Information Sharing
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We do not sell, rent, or share your personal information with
              third parties, except when necessary for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Legal compliance</li>
              <li>Protecting our rights and security</li>
              <li>Providing services through trusted providers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We implement technical and organizational security measures to
              protect your information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              5. Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Access your personal information</li>
              <li>Rectify inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent at any time</li>
              <li>Disconnect your Google account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              6. Cookies and Similar Technologies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We use cookies and similar technologies to improve application
              functionality and remember your preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              7. Changes to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We may update this privacy policy occasionally. We will notify you
              about significant changes through the application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              8. Contact
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you have questions about this privacy policy, you can contact
              us at:
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Email:</strong> privacy@front10devs.com
              <br />
              <strong>Address:</strong> Front10 Devs, San Francisco, CA, USA
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
