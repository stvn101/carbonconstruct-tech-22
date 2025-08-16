import { useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/HeroSection";
import ThemeToggle from "@/components/ThemeToggle";
import SEO from "@/components/SEO";
import CalculatorDemoVideo from "@/components/CalculatorDemoVideo";
import { useA11y } from "@/hooks/useA11y";
import Footer from "@/components/Footer";
import FeaturesSection from "@/components/FeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import CTASection from "@/components/CTASection";
import RegionSelector from "@/components/international/RegionSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendEmail } from "@/utils/email/emailService";

const Index = () => {
  useA11y({
    title: "CarbonConstruct Tech - Sustainable Carbon Management for Construction",
    announceRouteChanges: true
  });
  
  useEffect(() => {
    // Register an intersection observer to detect when sections come into view
    const sections = ['features', 'demo']; // Only observe sections that actually exist

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          console.log(`Section ${sectionId} is now visible`);
          if (typeof window !== 'undefined') {
            if ('requestIdleCallback' in window) {
              (window as any).requestIdleCallback(() => {
                if ((window as any).fbq) {
                  (window as any).fbq('trackCustom', `View${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}Section`);
                }
                if ((window as any).gtag) {
                  (window as any).gtag('event', 'section_view', {
                    section_name: sectionId
                  });
                }
              });
            } else {
              if ((window as any).fbq) {
                (window as any).fbq('trackCustom', `View${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}Section`);
              }
              if ((window as any).gtag) {
                (window as any).gtag('event', 'section_view', {
                  section_name: sectionId
                });
              }
            }
          }
        }
      });
    }, observerOptions);

    // Handle direct navigation to sections via hash
    if (window.location.hash) {
      requestAnimationFrame(() => {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth'
            });
            console.log(`Scrolled to hash target: #${id}`);
          }, 800);
        }
      });
    }

    // Start observing sections after a small delay to ensure they're rendered
    setTimeout(() => {
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          sectionObserver.observe(element);
          console.log(`Now observing section: #${sectionId}`);
        } else {
          console.warn(`Section #${sectionId} not found in DOM`);
        }
      });
    }, 500);
    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  // Dev tools toggle: add ?dev=1 to URL or set localStorage cc_dev_tools=1
  const devToolsEnabled = typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).has('dev') || localStorage.getItem('cc_dev_tools') === '1');

  const { toast } = useToast();

  const handleSendTestEmail = async () => {
    try {
      await sendEmail({
        to: 'info@carbonconstruct.com.au',
        subject: 'Edge Function Test: send-email',
        html: '<h2>Edge Function Test</h2><p>If you received this, hkgry functions are reachable.</p>'
      });
      toast({ title: 'Email sent', description: 'send-email edge function responded successfully.' });
    } catch (err: any) {
      console.error('Test email failed', err);
      toast({ title: 'Email failed', description: String(err?.message || err), variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col mobile-friendly-container bg-background overflow-x-hidden animate-fade-in">
      <SEO 
        title="CarbonConstruct Tech - Sustainable Carbon Management for Construction" 
        description="Track, manage, and reduce your construction project's carbon footprint with CarbonConstruct Tech. The first SaaS platform designed specifically for construction sustainability." 
        canonical="/" 
        keywords="carbon tracking, construction sustainability, green building, carbon footprint, construction management" 
        type="website" 
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 pt-16 md:pt-16 bg-background">
        <div className="overflow-x-hidden w-full">
          <HeroSection />
          <CalculatorDemoVideo />
          <FeaturesSection />

          {/* --- Begin Replacement for TestimonialsSection --- */}
          <section className="py-8 md:py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10 px-4">
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  What CarbonConstruct Tech Can Do for Your Company
                </h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  The all-in-one platform empowering construction companies to meet climate disclosure regulations and build a more sustainable future, starting now.
                </p>
              </div>
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-10 space-y-6 border border-carbon-100 dark:border-carbon-800 m-4">
                <h3 className="text-2xl font-semibold text-carbon-800 dark:text-white mb-2">
                  Smarter Carbon Tracking, Made for Construction
                </h3>
                <p className="text-md text-carbon-700 dark:text-carbon-100">
                  <strong>CarbonConstruct Tech</strong> is purpose-built for construction professionals—developers, builders, consultants, and contractors—who want to take charge of their carbon emissions. Our platform features the <strong>CarbonCalculator</strong>: an easy-to-use tool that lets you accurately measure, analyze, and reduce emissions from materials, transport, and energy use across your projects. Generate instant reports for Scope 1, 2, and 3 emissions, compare performance, and demonstrate progress to clients and auditors.
                </p>

                <h3 className="text-xl font-semibold text-carbon-800 dark:text-white mt-2">
                  Why You Need to Start Now
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-carbon-700 dark:text-carbon-200">
                  <li>The <b>Australian Federal Government</b> has introduced new laws <b>mandating climate-related financial disclosures</b> for large and medium-sized businesses, effective <span className="font-medium text-carbon-900 dark:text-carbon-100">January 1, 2025</span>.</li>
                  <li>
                    Under the{' '}
                    <span className="font-medium text-carbon-900 dark:text-carbon-100">
                      Treasury Laws Amendment (Financial Market Infrastructure and Other Measures) Bill 2024
                    </span>
                    , construction companies must report on climate-related risks, opportunities, and <b>Scope 1, 2, and 3 emissions</b>.
                  </li>
                  <li>Start today to streamline compliance, avoid penalties, and enhance your company's reputation as a leader in sustainability.</li>
                </ul>

                <h3 className="text-xl font-semibold text-carbon-800 dark:text-white mt-4">
                  Streamline Your Path to Compliance
                </h3>
                <p className="text-md text-carbon-700 dark:text-carbon-100">
                  Instead of scrambling to gather complex data, <strong>CarbonConstruct Tech</strong> simplifies everything—so you can focus on building, not bureaucracy. Our automated reports are audit-ready, aligned with the latest standards, and always up-to-date for regulatory changes. Rest easy knowing your emissions tracking and climate disclosures are handled—all in a secure, central platform made for the construction industry.<br /><br />
                  Don't wait for the deadline—get started now and turn compliance into a competitive advantage.
                </p>
              </div>
            </div>
          </section>
          {/* --- End Replacement for TestimonialsSection --- */}

          <BenefitsSection />
          
          {/* Production Launch Status Section */}
          <section className="py-8 md:py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  🚀 Now Live in Production
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  CarbonConstruct is Officially Launched!
                </h2>
                <p className="text-base md:text-lg text-muted-foreground mb-8">
                  Join thousands of construction professionals already using our platform to track, manage, and reduce their carbon footprint across global projects.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">🌍</div>
                    <div className="text-lg font-semibold">7 Countries</div>
                    <div className="text-sm text-muted-foreground">Global Support</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">🛡️</div>
                    <div className="text-lg font-semibold">Enterprise</div>
                    <div className="text-sm text-muted-foreground">Security Ready</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* International Features Testing Section */}
          <section className="py-8 md:py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-8">
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  🌍 International Capabilities
                </h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  CarbonConstruct now supports global construction standards and regional compliance
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <RegionSelector selectedCountry="Australia" onCountryChange={country => console.log('Selected country:', country)} />
              </div>
            </div>
          </section>
          
          {/* Dev tools: Send Email Test */}
          {devToolsEnabled && (
            <section className="py-6">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between border rounded-lg p-4 bg-background">
                  <div>
                    <h3 className="text-lg font-semibold">Edge Function Test</h3>
                    <p className="text-sm text-muted-foreground">Calls send-email on hkgry project.</p>
                  </div>
                  <Button onClick={handleSendTestEmail}>Send Test Email</Button>
                </div>
              </div>
            </section>
          )}
          
          <CTASection />
        </div>
      </main>
      <div className="fixed bottom-4 right-4 z-40">
        <ThemeToggle />
      </div>
      <Footer />
    </div>
  );
};

export default Index;

