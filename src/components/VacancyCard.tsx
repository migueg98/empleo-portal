
import { JobVacancy } from '@/types/job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VacancyCardProps {
  vacancy: JobVacancy;
}

const VacancyCard = ({ vacancy }: VacancyCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="flex-grow">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {vacancy.sector}
          </Badge>
        </div>
        <CardTitle className="text-lg text-primary hover:text-accent transition-colors">
          {vacancy.puesto}
        </CardTitle>
        <CardDescription className="mt-2 line-clamp-3">
          {vacancy.descripcion}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          size="sm"
        >
          Postularme
        </Button>
      </CardContent>
    </Card>
  );
};

export default VacancyCard;
