
import { JobPosition } from '@/types/job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: JobPosition;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="flex-grow">
        <CardTitle className="text-lg text-primary hover:text-accent transition-colors">
          {job.title}
        </CardTitle>
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
            Postularme
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default JobCard;
