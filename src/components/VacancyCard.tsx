
import { JobVacancy } from '@/types/job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface VacancyCardProps {
  vacancy: JobVacancy;
}

const VacancyCard = ({ vacancy }: VacancyCardProps) => {
  return (
    <Card className="bg-white border border-line hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="flex-grow">
        <CardTitle className="text-lg text-primary hover:text-accent transition-colors">
          {vacancy.puesto}
        </CardTitle>
        <div className="text-sm text-text/70 font-medium mb-2">
          {vacancy.sector}
        </div>
        <CardDescription className="mt-2 line-clamp-3 text-text/70">
          {vacancy.descripcion}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Link to={`/postular/${vacancy.id}`}>
          <Button 
            className="w-full bg-primary hover:bg-accent text-white"
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
