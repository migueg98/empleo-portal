
import { Button } from '@/components/ui/button';

interface BusinessFilterProps {
  selectedBusiness: string | null;
  onBusinessChange: (business: string | null) => void;
}

const businesses = ['Negocio A', 'Negocio B', 'Negocio C'];

const BusinessFilter = ({ selectedBusiness, onBusinessChange }: BusinessFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        variant={selectedBusiness === null ? "default" : "outline"}
        onClick={() => onBusinessChange(null)}
        className="min-w-24"
        aria-pressed={selectedBusiness === null}
      >
        Todos
      </Button>
      {businesses.map((business) => (
        <Button
          key={business}
          variant={selectedBusiness === business ? "default" : "outline"}
          onClick={() => onBusinessChange(business)}
          className="min-w-24"
          aria-pressed={selectedBusiness === business}
        >
          {business}
        </Button>
      ))}
    </div>
  );
};

export default BusinessFilter;
