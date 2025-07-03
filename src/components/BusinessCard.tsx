
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Business } from '@/types/job';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard = ({ business }: BusinessCardProps) => {
  return (
    <Card className="bg-white border border-line hover:shadow-lg hover:-translate-y-1 transition-all duration-150 h-full group">
      <div className="aspect-[4/3] bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center border-b border-line">
        <img 
          src={business.imageUrl} 
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        /> 
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary font-medium">{business.name}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={14} />
          <span>{business.address}</span>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-text/70 leading-relaxed">
          {business.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;
