import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { Container } from '@/components/layout/Container';

interface SearchPageProps {
  searchParams: { q?: string | string[] };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  // Handle both string and string[] cases for query parameters
  const rawSearchTerm = searchParams.q;
  const searchTerm = (Array.isArray(rawSearchTerm) ? rawSearchTerm[0] : rawSearchTerm)?.trim() || '';

  return (
    <Container>
      <div className="space-y-8 py-8">
        <div className="space-y-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold">البحث عن البودكاست</h1>
            <p className="text-muted-foreground">
              ابحث بين الآلاف من البودكاست من مكتبة iTunes مع خيارات فلترة متقدمة
            </p>
          </div>
          <SearchBar defaultValue={searchTerm} />
        </div>

        <SearchResults initialSearchTerm={searchTerm} />
      </div>
    </Container>
  );
}

