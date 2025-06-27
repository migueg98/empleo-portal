
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Business } from '@/types/job';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard = ({ business }: BusinessCardProps) => {
  return (
    <Card className="bg-white border border-line hover:shadow-lg transition-shadow duration-200 h-full">
      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center border-b border-line">
        <img 
          src={business.imageUrl} 
          alt={business.name}
          className="w-full h-full object-cover"
        /> 
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary">{business.name}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-text/70">
          <MapPin size={14} />
          <span>{business.address}</span>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-text/70">
          {business.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;
