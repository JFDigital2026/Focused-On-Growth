import React from "react";
import Hero from "../components/Hero";
import Stages from "../components/Stages";
import WhyUs from "../components/WhyUs";
import Process from "../components/Process";
import Challenges from "../components/Challenges";
import Partners from "../components/Partners";
import Button from "../components/Button";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

interface HomeProps {
  onOpenContact: () => void;
}

export default function Home({ onOpenContact }: HomeProps) {
  return (
    <main className="relative">
      <Hero onOpenContact={onOpenContact} />
      <Stages />
      <WhyUs />
      <Process />
      <Challenges />
      <Partners />
      
      {/* Final CTA Section */}
      <section className="py-24 text-white text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #191919 0%, #1999f0 100%)" }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="container mx-auto px-6 relative z-10"
        >
          <h2 className="text-white mb-6 text-2xl md:text-4xl">Ready to Take Control of Your Financial Future?</h2>
          <p className="text-white/80 text-lg md:text-2xl mb-10 max-w-2xl mx-auto">
            Schedule your complementary strategy session today and start your journey towards financial freedom.
          </p>
          <div className="flex flex-row justify-center gap-3 md:gap-6">
            <Button onClick={onOpenContact} className="px-4 py-2 text-xs md:text-base" showIcon={false}>Get Started</Button>
            <Link to="/advisors">
              <Button variant="secondary" className="px-4 py-2 text-xs md:text-base" showIcon={false}>Our Advisors</Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </section>
    </main>
  );
}
