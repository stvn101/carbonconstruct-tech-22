import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, CheckCircle, AlertTriangle, Clock, Shield } from 'lucide-react';

const complianceReports = [
  {
    id: 1,
    name: 'Climate Risk Financial Disclosure',
    standard: 'TCFD',
    dueDate: '2024-12-31',
    status: 'draft',
    completion: 85,
    lastUpdated: '2024-07-01'
  },
  {
    id: 2,
    name: 'Scope 1-3 Emissions Report',
    standard: 'GHG Protocol',
    dueDate: '2024-08-15',
    status: 'ready',
    completion: 100,
    lastUpdated: '2024-07-05'
  },
  {
    id: 3,
    name: 'Green Building Certification',
    standard: 'Green Star',
    dueDate: '2024-09-30',
    status: 'in-progress',
    completion: 60,
    lastUpdated: '2024-07-03'
  },
  {
    id: 4,
    name: 'Energy Efficiency Compliance',
    standard: 'NABERS',
    dueDate: '2024-10-15',
    status: 'not-started',
    completion: 0,
    lastUpdated: null
  }
];

const regulatoryRequirements = [
  {
    requirement: 'Australian Climate Disclosure',
    deadline: '2025-01-01',
    status: 'compliant',
    description: 'Mandatory climate-related financial disclosures for large entities'
  },
  {
    requirement: 'TCFD Reporting',
    deadline: '2024-12-31',
    status: 'in-progress',
    description: 'Task Force on Climate-related Financial Disclosures reporting'
  },
  {
    requirement: 'Carbon Neutral Certification',
    deadline: '2024-11-30',
    status: 'at-risk',
    description: 'Carbon neutral certification for construction operations'
  },
  {
    requirement: 'Energy Performance Rating',
    deadline: '2024-10-15',
    status: 'compliant',
    description: 'Building energy performance disclosure requirements'
  }
];

export const ComplianceReporting: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState('all');
  const [reportType, setReportType] = useState('regulatory');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'at-risk':
      case 'draft':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
      case 'compliant':
        return <Badge variant="default">Compliant</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'at-risk':
        return <Badge variant="destructive">At Risk</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedStandard} onValueChange={setSelectedStandard}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Standards</SelectItem>
              <SelectItem value="tcfd">TCFD</SelectItem>
              <SelectItem value="ghg">GHG Protocol</SelectItem>
              <SelectItem value="greenstar">Green Star</SelectItem>
              <SelectItem value="nabers">NABERS</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regulatory">Regulatory</SelectItem>
              <SelectItem value="voluntary">Voluntary</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Generate Report Package
        </Button>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold text-primary">12</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliant</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">3</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold text-destructive">1</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Active Compliance Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(report.status)}
                    <div>
                      <h3 className="font-medium">{report.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{report.standard}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(report.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm">Progress:</span>
                      <Progress value={report.completion} className="flex-1 h-2 max-w-xs" />
                      <span className="text-sm font-medium">{report.completion}%</span>
                    </div>
                    {report.lastUpdated && (
                      <span className="text-xs text-muted-foreground">
                        Updated: {new Date(report.lastUpdated).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(report.status)}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {report.status === 'ready' && (
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Regulatory Requirements Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regulatoryRequirements.map((req, index) => (
              <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  {getStatusIcon(req.status)}
                  <div>
                    <h3 className="font-medium">{req.requirement}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{req.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Deadline: {new Date(req.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(req.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'TCFD Climate Report', description: 'Task Force on Climate-related Financial Disclosures', icon: FileText },
              { name: 'GHG Emissions Report', description: 'Comprehensive Scope 1-3 emissions reporting', icon: FileText },
              { name: 'Green Star Assessment', description: 'Sustainability certification documentation', icon: FileText },
              { name: 'NABERS Rating Report', description: 'Energy performance assessment report', icon: FileText },
              { name: 'Carbon Neutral Report', description: 'Carbon neutrality certification documentation', icon: FileText },
              { name: 'ESG Summary Report', description: 'Environmental, Social, and Governance overview', icon: FileText }
            ].map((template, index) => (
              <Card key={index} className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <template.icon className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};