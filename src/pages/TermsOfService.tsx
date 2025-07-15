import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

const TermsOfService = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title="Terms of Service - CarbonConstruct"
        description="Terms and conditions for using the CarbonConstruct platform, compliant with Australian Consumer Law."
        canonical="/terms-of-service"
        type="article"
      />
      <Navbar />
      <main id="main-content" className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              🇦🇺 <strong>Australian Consumer Law Protection</strong>
            </p>
            <p className="text-xs text-green-800 dark:text-green-200 mt-1">
              These terms comply with the Australian Consumer Law (ACL) and include consumer guarantee protections. Your rights under Australian consumer law cannot be excluded or limited.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. About CarbonConstruct</h2>
          <p>
            CarbonConstruct Pty Ltd (ACN: [TO BE INSERTED], ABN: [TO BE INSERTED]) ("we", "us", "our", or "CarbonConstruct") provides software-as-a-service (SaaS) solutions for construction sustainability, carbon footprint management, and building compliance in Australia.
          </p>
          <p className="mt-4">
            <strong>Business Details:</strong>
            <br />Registered Office: [TO BE INSERTED - Australian Address]
            <br />ABN: [TO BE INSERTED]
            <br />Contact: legal@carbonconstruct.com
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Acceptance and Scope</h2>
          <p>
            By accessing or using CarbonConstruct's services, you agree to these Terms of Service and all applicable Australian laws and regulations. These terms apply to all users, including construction professionals, architects, engineers, and building consultants.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Service Description</h2>
          <p><strong>3.1 Our Services Include:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>Carbon footprint calculation tools for construction projects</li>
            <li>NCC 2025 and NABERS compliance checking</li>
            <li>Material database and sustainability analytics</li>
            <li>Project management and reporting tools</li>  
            <li>Integration with construction management software</li>
          </ul>
          
          <p><strong>3.2 Service Availability:</strong></p>
          <p>We aim for 99.5% uptime but cannot guarantee uninterrupted service. Scheduled maintenance will be notified 48 hours in advance.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Construction Industry Disclaimers</h2>
          <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 mb-4 rounded-r-lg">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              ⚠️ <strong>Professional Responsibility Notice</strong>
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
              CarbonConstruct provides calculation tools and guidance only. All final building compliance decisions, certifications, and professional judgments remain your responsibility as the qualified professional.
            </p>
          </div>
          
          <p><strong>4.1 NCC Compliance:</strong></p>
          <p>Our NCC compliance tools provide guidance based on current standards, however:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Final compliance determinations must be made by qualified professionals</li>
            <li>Building certifiers and relevant authorities have final approval authority</li>
            <li>Standards may change - always verify against current NCC provisions</li>
            <li>Local variations and performance solutions require professional assessment</li>
          </ul>
          
          <p><strong>4.2 Carbon Calculations:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>Calculations use industry-standard methodologies and data sources</li>
            <li>Results are estimates - actual emissions may vary</li>
            <li>Third-party data sources may contain inaccuracies</li>
            <li>Professional verification required for official reporting</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Obligations</h2>
          <p><strong>5.1 Acceptable Use:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>Use services only for legitimate construction/sustainability purposes</li>
            <li>Maintain confidentiality of your account credentials</li>
            <li>Provide accurate project information and data</li>
            <li>Comply with all applicable Australian laws and regulations</li>
          </ul>
          
          <p><strong>5.2 Prohibited Activities:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>Reverse engineering or attempting to extract source code</li>
            <li>Sharing accounts or sublicensing services without permission</li>
            <li>Using services for illegal activities or circumventing building codes</li>
            <li>Transmitting malicious code or attempting to breach security</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Australian Consumer Law Rights</h2>
          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              🛡️ <strong>Your Consumer Rights Cannot Be Excluded</strong>
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
              Under Australian Consumer Law, you have guaranteed rights that cannot be excluded or limited by these terms, including the right to a refund for major failures.
            </p>
          </div>
          
          <p><strong>6.1 Consumer Guarantees:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>Services will be provided with due care and skill</li>
            <li>Services will be fit for their disclosed purpose</li>
            <li>Services will be provided within a reasonable time</li>
            <li>You will receive a refund if there is a major failure</li>
          </ul>
          
          <p><strong>6.2 Remedies for Service Failures:</strong></p>
          <p>For major failures: Right to cancel service and receive a refund, or obtain compensation for loss/damage</p>
          <p>For minor failures: Right to have the problem fixed within a reasonable time</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Subscription and Payment Terms</h2>
          <p><strong>7.1 Subscription Plans:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>Monthly and annual subscription options available</li>
            <li>Prices displayed include GST where applicable</li>
            <li>Automatic renewal unless cancelled 24 hours before renewal</li>
            <li>Pro-rata refunds available under consumer law</li>
          </ul>
          
          <p><strong>7.2 Free Trial Terms:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>14-day free trial available for new users</li>
            <li>Full service access during trial period</li>
            <li>Cancel anytime during trial with no charges</li>
            <li>Automatic conversion to paid plan unless cancelled</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Intellectual Property</h2>
          <p><strong>8.1 Our IP:</strong></p>
          <p>CarbonConstruct retains all rights to our software, algorithms, databases, and content. You receive a limited license to use our services during your subscription.</p>
          
          <p><strong>8.2 Your Data:</strong></p>
          <p>You retain ownership of your project data and information. We may use aggregated, anonymized data for service improvement and industry research.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Data Security and Privacy</h2>
          <p>We implement enterprise-grade security measures including:</p>
          <ul className="list-disc pl-6 my-4">
            <li>256-bit SSL encryption and secure Australian data centers</li>
            <li>Regular security audits and compliance monitoring</li>
            <li>Staff background checks and confidentiality agreements</li>
            <li>Incident response procedures for data breaches</li>
          </ul>
          <p>See our Privacy Policy for complete data handling details.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Limitation of Liability</h2>
          <p><strong>Subject to Australian Consumer Law:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>Our liability is limited to the maximum extent permitted by law</li>
            <li>For business users: Liability limited to the cost of re-supplying services</li>
            <li>We exclude liability for indirect, consequential, or business losses</li>
            <li>Nothing limits liability for personal injury or death</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Termination</h2>
          <p><strong>11.1 By You:</strong></p>
          <p>Cancel subscription anytime through your account settings. Cancellation takes effect at the end of the current billing period.</p>
          
          <p><strong>11.2 By Us:</strong></p>
          <p>We may suspend or terminate accounts for breach of terms, with 30 days notice for non-urgent matters.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Dispute Resolution</h2>
          <p><strong>12.1 Internal Resolution:</strong></p>
          <ol className="list-decimal pl-6 my-4">
            <li>Contact our support team at support@carbonconstruct.com</li>
            <li>Escalate to management if not resolved within 5 business days</li>
            <li>Senior management response within 10 business days</li>
          </ol>
          
          <p><strong>12.2 External Options:</strong></p>
          <ul className="list-disc pl-6 my-4">
            <li>Australian Consumer Law complaints: ACCC or relevant state body</li>
            <li>Privacy complaints: Office of the Australian Information Commissioner</li>
            <li>Industry disputes: Relevant professional body or ombudsman</li>
            <li>Legal action: Australian courts have jurisdiction (user's choice of state)</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">13. Updates to Terms</h2>
          <p>We may update these terms with 30 days notice for material changes. Continued use constitutes acceptance of updated terms. For significant changes affecting your rights, we may require explicit consent.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">14. Governing Law</h2>
          <p>These terms are governed by Australian law. You may choose to bring legal action in the courts of your state or territory, or in New South Wales.</p>
          
          <div className="bg-gray-50 dark:bg-gray-950/50 border-l-4 border-gray-500 p-4 mt-8 rounded-r-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              📞 <strong>Contact Information</strong>
            </p>
            <p className="text-xs text-gray-800 dark:text-gray-200 mt-2">
              Legal Department: legal@carbonconstruct.com<br/>
              Customer Support: support@carbonconstruct.com<br/>
              Business Address: [TO BE INSERTED]<br/>
              ABN: [TO BE INSERTED] | ACN: [TO BE INSERTED]<br/>
              Phone: [TO BE INSERTED]
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default TermsOfService;