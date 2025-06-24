
import { JobVacancy } from '@/types/job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface VacancyCardProps {
  vacancy: JobVacancy;
}

const VacancyCard = ({ vacancy }: VacancyCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="flex-grow">
        <CardTitle className="text-lg text-primary hover:text-accent transition-colors">
          {vacancy.puesto}
        </CardTitle>
        <div className="text-sm text-gray-600 font-medium mb-2">
          {vacancy.sector}
        </div>
        <CardDescription className="mt-2 line-clamp-3">
          {vacancy.descripcion}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Link to={`/postular/${vacancy.id}`}>
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

export default VacancyCard;
