
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from 'sonner';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/auth';
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { EnhancedProfileForm } from "@/components/profile/EnhancedProfileForm";
import { PersonalizationDashboard } from "@/components/profile/PersonalizationDashboard";
import { PersonalizationSettings } from "@/components/profile/PersonalizationSettings";
import { usePersonalization } from "@/hooks/usePersonalization";

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const personalization = usePersonalization(user?.id);

  const handleProfileUpdate = async (formData: any) => {
    try {
      if (!user?.id || !profile) {
        throw new Error('User ID or profile not found');
      }
      
      const updatedProfile = {
        ...profile,
        ...formData
      };
      
      await updateProfile(updatedProfile);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error("Failed to update profile");
    }
  };

  // Show loading state if user data is not yet available
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-carbon-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Helmet>
        <title>My Profile | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Manage your CarbonConstruct account profile and preferences."
        />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow content-top-spacing px-4 pb-12">
        <ErrorBoundaryWrapper feature="User Profile">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your account settings and preferences to get the most out of CarbonConstruct.
              </p>
            </div>
            
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700">
              <ProfileHeader
                fullName={profile?.full_name || ''}
                email={user.email || ''}
                avatarUrl={profile?.avatar_url}
              />
              <CardContent>
                <Tabs defaultValue="dashboard" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="personalization">Personalization</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dashboard" className="space-y-6">
                    <PersonalizationDashboard
                      profile={profile}
                      calculationHistory={personalization.calculationHistory}
                      complianceAlerts={personalization.complianceAlerts}
                      favoriteMaterials={personalization.favoriteMaterials}
                    />
                  </TabsContent>
                  
                  <TabsContent value="profile" className="space-y-6">
                    <EnhancedProfileForm 
                      profile={profile!}
                      onSubmit={handleProfileUpdate}
                    />
                  </TabsContent>
                  
                  <TabsContent value="personalization" className="space-y-6">
                    <PersonalizationSettings
                      profile={profile}
                      onUpdateSettings={handleProfileUpdate}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </ErrorBoundaryWrapper>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
