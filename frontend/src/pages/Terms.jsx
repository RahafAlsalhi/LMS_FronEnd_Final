import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen mt-18 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-purple-900 mb-8 text-center">
            Terms of Service
          </h1>

          <div className="text-gray-600 space-y-6">
            <div className="mb-6">
              <p className="text-sm text-gray-300">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using EduHikerz ("the Platform"), you accept
                and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                2. Description of Service
              </h2>
              <p className="mb-4">
                EduHikerz is an online learning management system that provides:
              </p>
              <div className="ml-4 space-y-2">
                <p>• Access to educational courses and content</p>
                <p>• Interactive learning tools and assessments</p>
                <p>• Progress tracking and certification</p>
                <p>• Community features and instructor support</p>
                <p>• Mobile and web-based learning platforms</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                3. User Accounts
              </h2>
              <p className="mb-4">
                To access certain features, you must create an account. You
                agree to:
              </p>
              <div className="ml-4 space-y-2">
                <p>• Provide accurate and complete registration information</p>
                <p>• Maintain the security of your account credentials</p>
                <p>
                  • Accept responsibility for all activities under your account
                </p>
                <p>• Notify us immediately of any unauthorized use</p>
                <p>• Use only one account per person</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                4. Payment and Refunds
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Payment Terms:
                  </h3>
                  <div className="ml-4 space-y-2">
                    <p>• All fees are in USD unless otherwise specified</p>
                    <p>• Payment is due at the time of enrollment</p>
                    <p>• We accept major credit cards and PayPal</p>
                    <p>• Subscription fees are billed automatically</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Refund Policy:
                  </h3>
                  <div className="ml-4 space-y-2">
                    <p>• 30-day money-back guarantee for course purchases</p>
                    <p>• Refunds processed within 5-7 business days</p>
                    <p>• Subscription cancellations effective at period end</p>
                    <p>
                      • No refunds for completed courses with certificates
                      issued
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                5. User Conduct
              </h2>
              <p className="mb-4">You agree not to:</p>
              <div className="ml-4 space-y-2">
                <p>• Share account credentials with others</p>
                <p>• Upload malicious code or harmful content</p>
                <p>• Harass, abuse, or harm other users</p>
                <p>• Violate intellectual property rights</p>
                <p>• Use the platform for illegal activities</p>
                <p>• Attempt to reverse engineer our software</p>
                <p>• Create duplicate accounts or false identities</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                6. Intellectual Property
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Our Content:
                  </h3>
                  <p>
                    All course materials, videos, text, graphics, and software
                    are owned by EduHikerz or our content partners and are
                    protected by copyright and other intellectual property laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Your Content:
                  </h3>
                  <p>
                    You retain ownership of content you submit but grant us a
                    license to use, display, and distribute it as necessary to
                    provide our services.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                7. Privacy and Data
              </h2>
              <p>
                Your privacy is important to us. Our Privacy Policy explains how
                we collect, use, and protect your information. By using our
                services, you consent to the collection and use of information
                as outlined in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                8. Course Access and Availability
              </h2>
              <div className="ml-4 space-y-2">
                <p>
                  • Course access is granted for the duration specified at
                  purchase
                </p>
                <p>• We reserve the right to modify or discontinue courses</p>
                <p>
                  • Technical requirements must be met for optimal experience
                </p>
                <p>
                  • Course completion certificates are issued upon meeting
                  requirements
                </p>
                <p>
                  • Lifetime access courses remain available as long as we
                  operate
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                9. Disclaimers and Limitations
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Service Availability:
                  </h3>
                  <p>
                    We strive for 99.9% uptime but cannot guarantee
                    uninterrupted service. Maintenance and updates may
                    temporarily affect availability.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Educational Outcomes:
                  </h3>
                  <p>
                    While we provide high-quality educational content, we cannot
                    guarantee specific learning outcomes or career advancement.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                10. Termination
              </h2>
              <p className="mb-4">
                We may terminate or suspend your account if you violate these
                terms. Upon termination:
              </p>
              <div className="ml-4 space-y-2">
                <p>• Your access to courses will be revoked</p>
                <p>• Outstanding payments remain due</p>
                <p>• You must cease using our intellectual property</p>
                <p>• Applicable refund policies will apply</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                11. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Changes
                will be posted on this page with an updated revision date.
                Continued use of the service after changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                12. Governing Law
              </h2>
              <p>
                These terms are governed by the laws of [Your Jurisdiction]. Any
                disputes will be resolved through binding arbitration in
                accordance with the rules of the American Arbitration
                Association.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                13. Contact Information
              </h2>
              <p className="mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="ml-4 space-y-2">
                <p>Email: legal@eduhikerz.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Education Street, Learning City, LC 12345</p>
                <p>Business Hours: Monday-Friday, 9:00 AM - 6:00 PM EST</p>
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
                href="/privacy"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Privacy Policy
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

export default Terms;
