
import { motion } from "framer-motion";

const ContactHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-heading">
        Contact Us
      </h1>
      <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
        Get in touch with our team for support, partnerships, or any questions about sustainable construction solutions.
      </p>
    </motion.div>
  );
};

export default ContactHeader;
