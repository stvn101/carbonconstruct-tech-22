import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe, Zap, Leaf, Building } from 'lucide-react';
import RegionalCarbonFactorsService from '@/services/international/RegionalCarbonFactors';

interface RegionSelectorProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedCountry,
  onCountryChange,
}) => {
  const regionalService = new RegionalCarbonFactorsService();
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const regions = regionalService.getAvailableRegions();
  const countries = selectedRegion ? 
    regionalService.getCountriesByRegion(selectedRegion) : 
    [];

  const selectedConfig = regionalService.getRegionalConfig(selectedCountry);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Regional Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Region</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Country</label>
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedConfig && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Grid Factor</p>
                <p className="font-medium">{selectedConfig.electricityFactor} kg CO₂e/kWh</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Renewable %</p>
                <p className="font-medium">{selectedConfig.renewablePercentage}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Standards</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedConfig.buildingStandards.slice(0, 2).map(standard => (
                    <Badge key={standard} variant="secondary" className="text-xs">
                      {standard}
                    </Badge>
                  ))}
                  {selectedConfig.buildingStandards.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedConfig.buildingStandards.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegionSelector;