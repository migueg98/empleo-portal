
import { JobPosition } from '@/types/job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: JobPosition;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="flex-grow">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg text-primary hover:text-accent transition-colors">
            {job.title}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {job.business}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Building size={14} />
            <span>{job.area}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{job.city}</span>
          </div>
        </div>
        <CardDescription className="mt-2 line-clamp-3">
          {job.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Link to={`/postular/${job.id}`}>
          <Button 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            size="sm"
          >
            Quiero postularme
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default JobCard;
