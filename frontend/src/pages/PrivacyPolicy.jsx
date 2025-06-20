import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen mt-18 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-purple-900 mb-8 text-center">
            Privacy Policy
          </h1>

          <div className="text-gray-600 space-y-6">
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                1. Information We Collect
              </h2>
              <p className="mb-4">
                At EduHikerz, we collect information to provide better services
                to our users. We collect information in the following ways:
              </p>
              <div className="ml-4 space-y-2">
                <p>
                  <strong>Personal Information:</strong> When you create an
                  account, we may collect your name, email address, phone
                  number, and other contact details.
                </p>
                <p>
                  <strong>Educational Information:</strong> Course progress,
                  completion certificates, grades, and learning preferences.
                </p>
                <p>
                  <strong>Technical Information:</strong> Device information, IP
                  address, browser type, and usage analytics.
                </p>
                <p>
                  <strong>Communication Data:</strong> Messages, feedback, and
                  support inquiries you send to us.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <div className="ml-4 space-y-2">
                <p>• Provide, maintain, and improve our educational services</p>
                <p>
                  • Personalize your learning experience and recommend relevant
                  courses
                </p>
                <p>• Process payments and manage your account</p>
                <p>
                  • Send you important updates about courses and platform
                  changes
                </p>
                <p>• Respond to your questions and provide customer support</p>
                <p>• Analyze platform usage to enhance user experience</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                3. Information Sharing
              </h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <div className="ml-4 space-y-2">
                <p>• With your explicit consent</p>
                <p>• With service providers who help us operate our platform</p>
                <p>• When required by law or to protect our rights</p>
                <p>• In case of business transfers or mergers</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                4. Data Security
              </h2>
              <p>
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission
                over the internet is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                5. Your Rights
              </h2>
              <p className="mb-4">You have the right to:</p>
              <div className="ml-4 space-y-2">
                <p>• Access and update your personal information</p>
                <p>• Delete your account and associated data</p>
                <p>• Opt-out of marketing communications</p>
                <p>• Request a copy of your data</p>
                <p>• File a complaint with relevant authorities</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                6. Cookies and Tracking
              </h2>
              <p>
                We use cookies and similar technologies to enhance your
                experience, analyze usage patterns, and provide personalized
                content. You can control cookie settings through your browser
                preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                7. Children's Privacy
              </h2>
              <p>
                Our services are not directed to children under 13. We do not
                knowingly collect personal information from children under 13.
                If you believe we have collected such information, please
                contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                8. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                9. Contact Us
              </h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <div className="ml-4 space-y-2">
                <p>Email: privacy@eduhikerz.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Education Street, Learning City, LC 12345</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-600">
            <div className="flex justify-center space-x-6">
              <a
                href="/"
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Back to Home
              </a>
              <a
                href="/terms"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black bg-opacity-20 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 EduHikerz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
