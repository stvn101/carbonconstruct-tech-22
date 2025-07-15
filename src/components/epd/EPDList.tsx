import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Send, MoreHorizontal, Search, Filter, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { EPDService } from '@/services/epdService';
import { EPDExportService } from '@/services/epdExportService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface EPD {
  id: string;
  product_name: string;
  manufacturer_name: string;
  functional_unit: string;
  status: string;
  total_co2e: number;
  version_number: number;
  created_at: string;
  updated_at: string;
  verification_status: string;
}

export const EPDList: React.FC = () => {
  const [epds, setEpds] = useState<EPD[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadEPDs();
  }, []);

  const loadEPDs = async () => {
    try {
      const { data, error } = await EPDService.getUserEPDs();
      if (error) {
        toast.error(`Failed to load EPDs: ${  error}`);
        return;
      }
      setEpds((data as EPD[]) || []);
    } catch (error) {
      toast.error('An error occurred while loading EPDs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await EPDService.updateEPDStatus(id, newStatus);
      if (error) {
        toast.error(`Failed to update status: ${  error}`);
        return;
      }
      
      toast.success('Status updated successfully');
      loadEPDs(); // Refresh the list
    } catch (error) {
      toast.error('An error occurred while updating status');
      console.error(error);
    }
  };

  const handleSubmitForVerification = async (id: string) => {
    try {
      const { error } = await EPDService.submitForVerification(id);
      if (error) {
        toast.error(`Failed to submit for verification: ${  error}`);
        return;
      }
      
      toast.success('EPD submitted for verification');
      loadEPDs(); // Refresh the list
    } catch (error) {
      toast.error('An error occurred while submitting for verification');
      console.error(error);
    }
  };

  const handleExport = async (epd: EPD, format: 'pdf' | 'csv' | 'json') => {
    try {
      // For now, create a simple export of the basic EPD data
      // In the future, we can fetch the full EPD record from the database
      const exportData = {
        product_name: epd.product_name,
        manufacturer_name: epd.manufacturer_name,
        functional_unit: epd.functional_unit,
        total_co2e: epd.total_co2e,
        status: epd.status,
        version_number: epd.version_number,
        created_at: epd.created_at,
        verification_status: epd.verification_status
      };

      const fileName = `EPD_${epd.product_name.replace(/[^a-zA-Z0-9]/g, '_')}_v${epd.version_number}`;

      switch (format) {
        case 'json':
          const jsonContent = JSON.stringify(exportData, null, 2);
          downloadFile(jsonContent, `${fileName}.json`, 'application/json');
          toast.success('JSON exported successfully');
          break;
        case 'csv':
          const csvContent = convertToCSV(exportData);
          downloadFile(csvContent, `${fileName}.csv`, 'text/csv');
          toast.success('CSV exported successfully');
          break;
        case 'pdf':
          toast.info('PDF export coming soon - JSON export generated instead');
          const pdfJsonContent = JSON.stringify(exportData, null, 2);
          downloadFile(pdfJsonContent, `${fileName}.json`, 'application/json');
          break;
      }
    } catch (error) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
      console.error(error);
    }
  };

  const convertToCSV = (data: any): string => {
    const headers = Object.keys(data);
    const values = Object.values(data);
    return `${headers.join(',')}\n${values.join(',')}`;
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft', icon: Clock },
      submitted_for_review: { variant: 'outline' as const, label: 'Under Review', icon: AlertCircle },
      verified: { variant: 'default' as const, label: 'Verified', icon: CheckCircle },
      published: { variant: 'default' as const, label: 'Published', icon: CheckCircle },
      archived: { variant: 'secondary' as const, label: 'Archived', icon: Clock }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredEPDs = epds.filter(epd => {
    const matchesSearch = epd.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         epd.manufacturer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || epd.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading EPDs...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (epds.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No EPDs Created Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start creating your first Environmental Product Declaration to track and verify environmental impacts.
            </p>
            <Button onClick={() => navigate('/epd/create')}>Create Your First EPD</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search EPDs by product or manufacturer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted_for_review">Under Review</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EPDs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Product Declarations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Functional Unit</TableHead>
                <TableHead>Total CO₂e</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEPDs.map((epd) => (
                <TableRow key={epd.id}>
                  <TableCell className="font-medium">{epd.product_name}</TableCell>
                  <TableCell>{epd.manufacturer_name}</TableCell>
                  <TableCell>{epd.functional_unit}</TableCell>
                  <TableCell>
                    {epd.total_co2e ? `${epd.total_co2e.toFixed(2)} kg` : 'Calculating...'}
                  </TableCell>
                  <TableCell>{getStatusBadge(epd.status)}</TableCell>
                  <TableCell>v{epd.version_number}</TableCell>
                  <TableCell>{new Date(epd.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/epd/${epd.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleExport(epd, 'pdf')}>
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleExport(epd, 'csv')}>
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleExport(epd, 'json')}>
                          <Download className="w-4 h-4 mr-2" />
                          Export JSON
                        </DropdownMenuItem>
                        
                        {epd.status === 'draft' && (
                          <DropdownMenuItem onClick={() => handleSubmitForVerification(epd.id)}>
                            <Send className="w-4 h-4 mr-2" />
                            Submit for Review
                          </DropdownMenuItem>
                        )}
                        
                        {epd.status === 'draft' && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(epd.id, 'archived')}>
                            Archive
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {filteredEPDs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{filteredEPDs.length}</p>
                <p className="text-sm text-muted-foreground">Total EPDs</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {filteredEPDs.filter(epd => epd.status === 'draft').length}
                </p>
                <p className="text-sm text-muted-foreground">In Draft</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {filteredEPDs.filter(epd => epd.status === 'verified').length}
                </p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {filteredEPDs.reduce((sum, epd) => sum + (epd.total_co2e || 0), 0).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Total kg CO₂e</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};