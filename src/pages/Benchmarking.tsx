
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileNavigation from '@/components/MobileNavigation';
import Benchmarking from '@/components/Benchmarking';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BenchmarkingPage = () => {
  const { profile, user } = useAuth();
  const isPremium = profile?.subscription_tier === 'premium';

  // Show premium upgrade prompt for non-premium users
  if (!isPremium) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>Project Benchmarking - CarbonConstruct</title>
          <meta name="description" content="Compare your project performance against industry benchmarks and identify areas for improvement." />
        </Helmet>
        
        <Navbar />
        
        <main className="flex-1 pt-16 pb-20 sm:pb-0">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Project Benchmarking</h1>
              <p className="text-lg text-muted-foreground">
                Compare your project performance against industry standards and identify optimization opportunities.
              </p>
            </div>
            
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Crown className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                  <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4">Premium Feature</h2>
                <p className="text-muted-foreground mb-6">
                  Project benchmarking is available for Premium subscribers. 
                  Upgrade your account to access advanced performance analytics and industry comparisons.
                </p>
                
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link to="/pricing">
                      Upgrade to Premium
                    </Link>
                  </Button>
                  
                  {!user && (
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/auth">
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Project Benchmarking - CarbonConstruct</title>
        <meta name="description" content="Compare your project performance against industry benchmarks and identify areas for improvement." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1 pt-16 pb-20 sm:pb-0">
        <Benchmarking />
      </main>
      
      <Footer />
      <MobileNavigation />
    </div>
  );
};

export default BenchmarkingPage;
