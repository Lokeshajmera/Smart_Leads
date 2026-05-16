import { Search, Download } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  sourceFilter: string;
  setSourceFilter: (v: string) => void;
  sortBy: 'Latest' | 'Oldest';
  setSortBy: (v: 'Latest' | 'Oldest') => void;
  onExport: () => void;
}

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sourceFilter,
  setSourceFilter,
  sortBy,
  setSortBy,
  onExport,
}: FilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-background border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 bg-background border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'Latest' | 'Oldest')}
          className="px-3 py-2 bg-background border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
        >
          <option value="Latest">Latest First</option>
          <option value="Oldest">Oldest First</option>
        </select>

        <button
          onClick={onExport}
          className="flex items-center space-x-2 px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors border border-muted"
        >
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
