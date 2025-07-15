import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, User, Shield, Database } from 'lucide-react';

interface AdminStatus {
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  profileRole: string | null;
  isInAdminsTable: boolean;
  hasJWTAdminRole: boolean;
  adminTableEmails: string[];
}

export const AdminStatusChecker: React.FC = () => {
  const { user, profile, session } = useAuth();
  const [adminStatus, setAdminStatus] = useState<AdminStatus>({
    isAuthenticated: false,
    userId: null,
    userEmail: null,
    profileRole: null,
    isInAdminsTable: false,
    hasJWTAdminRole: false,
    adminTableEmails: []
  });
  const [loading, setLoading] = useState(false);

  const checkAdminStatus = async () => {
    setLoading(true);
    
    try {
      // Check if user is in admins table
      const { data: adminEmails } = await supabase
        .from('admins')
        .select('email');
      
      const adminEmailList = adminEmails?.map(a => a.email).filter(Boolean) || [];
      
      // Check JWT metadata for admin role
      const jwtPayload = session?.access_token ? 
        JSON.parse(atob(session.access_token.split('.')[1])) : null;
      const hasJWTAdmin = jwtPayload?.app_metadata?.role === 'admin';
      
      setAdminStatus({
        isAuthenticated: !!user,
        userId: user?.id || null,
        userEmail: user?.email || null,
        profileRole: profile?.role || null,
        isInAdminsTable: adminEmailList.includes(user?.email || ''),
        hasJWTAdminRole: hasJWTAdmin,
        adminTableEmails: adminEmailList
      });
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToAdminsTable = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase
        .from('admins')
        .insert([{ email: user.email, id: user.id }]);
      
      if (error) throw error;
      
      checkAdminStatus();
      alert('Added to admins table successfully!');
    } catch (error) {
      console.error('Error adding to admins:', error);
      alert('Error adding to admins table. Check console for details.');
    }
  };

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user, session]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Status Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Authentication Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Authentication Status</span>
          </div>
          {adminStatus.isAuthenticated ? (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              Authenticated
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Not Authenticated
            </Badge>
          )}
        </div>

        {adminStatus.isAuthenticated && (
          <>
            {/* User Details */}
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <p><strong>User ID:</strong> {adminStatus.userId}</p>
              <p><strong>Email:</strong> {adminStatus.userEmail}</p>
              <p><strong>Profile Role:</strong> {adminStatus.profileRole || 'None'}</p>
            </div>

            {/* Admin Table Status */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>In Admins Table</span>
              </div>
              {adminStatus.isInAdminsTable ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  No
                </Badge>
              )}
            </div>

            {/* JWT Admin Role */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>JWT Admin Role</span>
              </div>
              {adminStatus.hasJWTAdminRole ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Has Admin Role
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  No Admin Role
                </Badge>
              )}
            </div>

            {/* Admin Emails List */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium mb-2">Emails in Admins Table:</p>
              {adminStatus.adminTableEmails.length > 0 ? (
                <ul className="list-disc list-inside text-sm">
                  {adminStatus.adminTableEmails.map((email, index) => (
                    <li key={index}>{email}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No admin emails found</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={checkAdminStatus} disabled={loading}>
                {loading ? 'Checking...' : 'Refresh Status'}
              </Button>
              
              {!adminStatus.isInAdminsTable && (
                <Button onClick={addToAdminsTable} variant="outline">
                  Add Myself to Admins Table
                </Button>
              )}
            </div>

            {/* Summary */}
            <div className="p-4 border-2 rounded-lg">
              <p className="font-medium mb-2">Admin Access Summary:</p>
              {adminStatus.isInAdminsTable || adminStatus.hasJWTAdminRole ? (
                <p className="text-green-600">✅ You have admin access!</p>
              ) : (
                <p className="text-red-600">❌ You do not have admin access. Add yourself to the admins table above.</p>
              )}
            </div>
          </>
        )}

        {!adminStatus.isAuthenticated && (
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800">Please sign in first to check your admin status.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};