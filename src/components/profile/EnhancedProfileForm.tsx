
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Bell, Settings, Briefcase, Target } from "lucide-react";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  company_name: z.string().optional(),
  role: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  job_title: z.string().optional(),
  industry: z.string().optional(),
  years_experience: z.string().optional(),
  project_size_preference: z.string().optional(),
  focus_areas: z.array(z.string()).optional(),
  notification_email: z.boolean().optional(),
  notification_browser: z.boolean().optional(),
  notification_reports: z.boolean().optional(),
  preferred_units: z.string().optional(),
  default_region: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EnhancedProfileFormProps {
  profile: any;
  onSubmit: (data: ProfileFormData) => Promise<void>;
}

const INDUSTRIES = [
  "Construction & Building",
  "Architecture",
  "Engineering",
  "Project Management",
  "Sustainability Consulting",
  "Real Estate Development",
  "Government & Public Sector",
  "Education & Research",
  "Other"
];

const PROJECT_SIZES = [
  "Small (< $1M)",
  "Medium ($1M - $10M)",
  "Large ($10M - $50M)",
  "Major ($50M+)",
  "Mixed Portfolio"
];

const FOCUS_AREAS = [
  "Carbon Footprint Reduction",
  "Green Star Certification",
  "NABERS Rating",
  "Material Sustainability",
  "Energy Efficiency",
  "Water Management",
  "Waste Reduction",
  "Indoor Air Quality",
  "Renewable Energy Integration"
];

export const EnhancedProfileForm = ({ profile, onSubmit }: EnhancedProfileFormProps) => {
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>(
    profile?.focus_areas || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      company_name: profile?.company_name || "",
      role: profile?.role || "",
      website: profile?.website || "",
      job_title: profile?.job_title || "",
      industry: profile?.industry || "",
      years_experience: profile?.years_experience || "",
      project_size_preference: profile?.project_size_preference || "",
      focus_areas: profile?.focus_areas || [],
      notification_email: profile?.notification_email ?? true,
      notification_browser: profile?.notification_browser ?? true,
      notification_reports: profile?.notification_reports ?? true,
      preferred_units: profile?.preferred_units || "metric",
      default_region: profile?.default_region || "Australia",
    }
  });

  const handleFormSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, focus_areas: selectedFocusAreas });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFocusArea = (area: string) => {
    setSelectedFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                {...register("full_name")}
                placeholder="Enter your full name"
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                {...register("job_title")}
                placeholder="e.g., Senior Project Manager"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select onValueChange={(value) => setValue("industry", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(industry => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Select onValueChange={(value) => setValue("years_experience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11-15">11-15 years</SelectItem>
                  <SelectItem value="16+">16+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                {...register("company_name")}
                placeholder="Enter your company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role/Department</Label>
              <Input
                id="role"
                {...register("role")}
                placeholder="e.g., Sustainability, Operations"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Company Website</Label>
            <Input
              id="website"
              {...register("website")}
              placeholder="https://example.com"
              type="url"
            />
            {errors.website && (
              <p className="text-sm text-red-500">{errors.website.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Project Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_size_preference">Typical Project Size</Label>
            <Select onValueChange={(value) => setValue("project_size_preference", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select typical project size" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_SIZES.map(size => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Focus Areas</Label>
            <p className="text-sm text-gray-600">Select areas most relevant to your work:</p>
            <div className="flex flex-wrap gap-2">
              {FOCUS_AREAS.map(area => (
                <Badge
                  key={area}
                  variant={selectedFocusAreas.includes(area) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => toggleFocusArea(area)}
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_units">Preferred Units</Label>
              <Select onValueChange={(value) => setValue("preferred_units", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (kg, m³, etc.)</SelectItem>
                  <SelectItem value="imperial">Imperial (lbs, ft³, etc.)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_region">Default Region</Label>
              <Select onValueChange={(value) => setValue("default_region", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select default region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="New Zealand">New Zealand</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification_email">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <Switch
              id="notification_email"
              checked={watch("notification_email")}
              onCheckedChange={(checked) => setValue("notification_email", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification_browser">Browser Notifications</Label>
              <p className="text-sm text-gray-600">Get notified in your browser</p>
            </div>
            <Switch
              id="notification_browser"
              checked={watch("notification_browser")}
              onCheckedChange={(checked) => setValue("notification_browser", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification_reports">Weekly Reports</Label>
              <p className="text-sm text-gray-600">Receive weekly sustainability insights</p>
            </div>
            <Switch
              id="notification_reports"
              checked={watch("notification_reports")}
              onCheckedChange={(checked) => setValue("notification_reports", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!isDirty || isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
