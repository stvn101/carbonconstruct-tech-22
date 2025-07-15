import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

const PrivacyPolicy = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title="Privacy Policy - CarbonConstruct"
        description="Our Privacy Policy regarding data collection and usage at CarbonConstruct, compliant with Australian Privacy Act 1988."
        canonical="/privacy-policy"
        type="article"
      />
      <Navbar />
      <main id="main-content" className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              🇦🇺 <strong>Australian Privacy Act 1988 Compliance</strong>
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
              This privacy policy complies with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth) and includes mandatory data breach notification procedures.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            CarbonConstruct Pty Ltd (ACN: [TO BE INSERTED], ABN: [TO BE INSERTED]) ("we", "us", or "our") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, store, disclose and protect your personal information in accordance with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth).
          </p>
          <p className="mt-4">
            <strong>Our Contact Details:</strong>
            <br />Email: privacy@carbonconstruct.com
            <br />Address: [TO BE INSERTED - Australian Business Address]
            <br />Phone: [TO BE INSERTED - Australian Contact Number]
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Personal Information We Collect</h2>
          <p><strong>2.1 Information you provide directly:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>Name, email address, phone number</li>
            <li>Company name, job title, business address</li>
            <li>Professional certifications and qualifications</li>
            <li>Construction project data and carbon calculations</li>
            <li>Payment and billing information</li>
            <li>Communications with our support team</li>
          </ul>
          
          <p><strong>2.2 Information we collect automatically:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>Device and browser information</li>
            <li>IP address and location data (city/state level)</li>
            <li>Usage analytics and platform interactions</li>
            <li>Cookies and similar technologies (see our Cookie Policy)</li>
          </ul>

          <p><strong>2.3 Sensitive Information:</strong></p>
          <p>We do not knowingly collect sensitive information as defined under the Privacy Act 1988, unless required for specific compliance purposes with your explicit consent.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information (APPs 3 & 6)</h2>
          <p><strong>Primary Purposes:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>Provide carbon calculation and construction sustainability services</li>
            <li>Process payments and manage subscriptions</li>
            <li>Provide customer support and technical assistance</li>
            <li>Comply with Australian building compliance requirements (NCC, NABERS)</li>
            <li>Fulfill legal and regulatory obligations</li>
          </ul>
          
          <p><strong>Secondary Purposes:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>Improve our services and develop new features</li>
            <li>Send relevant industry updates and service notifications</li>
            <li>Conduct research for construction industry sustainability improvements</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Disclosure of Personal Information (APP 8)</h2>
          <p>We may disclose your personal information to:</p>
          <ul className="list-disc pl-6 my-4">
            <li><strong>Service Providers:</strong> Cloud hosting (AWS Australia), payment processing (Stripe), analytics services</li>
            <li><strong>Professional Advisors:</strong> Lawyers, accountants, auditors (subject to confidentiality)</li>
            <li><strong>Regulatory Bodies:</strong> When required by Australian law or court order</li>
            <li><strong>Business Partners:</strong> Construction industry software integrations (with your consent)</li>
          </ul>
          
          <p><strong>Overseas Disclosure (APP 8.1):</strong></p>
          <p>Some of our service providers may store data outside Australia (primarily USA - AWS, Stripe). We ensure appropriate safeguards are in place and will notify you of specific countries upon request.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security (APP 11)</h2>
          <p>We implement comprehensive security measures including:</p>
          <ul className="list-disc pl-6 my-4">
            <li>256-bit SSL encryption for data transmission</li>
            <li>Multi-factor authentication for user accounts</li>
            <li>Regular security audits and penetration testing</li>
            <li>Staff training on privacy and security protocols</li>
            <li>Incident response procedures for data breaches</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights (APPs 12 & 13)</h2>
          <p>Under the Privacy Act 1988, you have the right to:</p>
          <ul className="list-disc pl-6 my-4">
            <li><strong>Access:</strong> Request copies of your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate information</li>
            <li><strong>Complaints:</strong> Lodge complaints about privacy breaches</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Data Portability:</strong> Request transfer of your data</li>
          </ul>
          
          <p>To exercise these rights, contact us at privacy@carbonconstruct.com. We will respond within 30 days.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Data Breach Notification</h2>
          <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">
              ⚠️ <strong>Mandatory Breach Notification</strong>
            </p>
            <p className="text-xs text-red-800 dark:text-red-200 mt-1">
              In accordance with the Notifiable Data Breaches scheme, we will notify the Office of the Australian Information Commissioner (OAIC) and affected individuals within 72 hours of becoming aware of any eligible data breach.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Retention and Deletion</h2>
          <p>We retain personal information only as long as necessary:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Account data: Until account deletion + 7 years (tax obligations)</li>
            <li>Project data: As per construction industry record-keeping requirements</li>
            <li>Support communications: 3 years from last contact</li>
            <li>Analytics data: Aggregated and anonymized after 2 years</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Children's Privacy</h2>
          <p>Our services are not intended for individuals under 18 years. We do not knowingly collect personal information from children. If we become aware we have collected information from a child, we will delete it immediately.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of material changes via email or prominent notice on our platform at least 30 days before changes take effect.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Complaints Process</h2>
          <p>If you have concerns about our privacy practices:</p>
          <ol className="list-decimal pl-6 my-4">
            <li>Contact our Privacy Officer at privacy@carbonconstruct.com</li>
            <li>We will acknowledge your complaint within 5 business days</li>
            <li>We will investigate and respond within 30 days</li>
            <li>If unsatisfied, you may lodge a complaint with the OAIC at oaic.gov.au</li>
          </ol>
          
          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 mt-8 rounded-r-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              📞 <strong>Contact Information</strong>
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-200 mt-2">
              Privacy Officer: privacy@carbonconstruct.com<br/>
              General Inquiries: support@carbonconstruct.com<br/>
              Australian Business Address: [TO BE INSERTED]<br/>
              ABN: [TO BE INSERTED] | ACN: [TO BE INSERTED]
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default PrivacyPolicy;