
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactInformation from "@/components/contact/ContactInformation";
import ContactForm from "@/components/contact/ContactForm";

const Contact = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Contact Us | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Get in touch with CarbonConstruct for support, inquiries, or partnerships. Contact us via email or phone for sustainable construction solutions."
        />
      </Helmet>
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="py-16 md:py-24 container mx-auto px-4">
          <ContactHeader />

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <ContactInformation />
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Contact;
