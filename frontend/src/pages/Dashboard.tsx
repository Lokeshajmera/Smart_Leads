import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Lead, Pagination } from '../types';
import LeadList from '../components/leads/LeadList';
import FilterBar from '../components/leads/FilterBar';
import PaginationControls from '../components/leads/PaginationControls';
import LeadFormModal from '../components/leads/LeadFormModal';
import { useDebounceValue } from 'usehooks-ts';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounceValue(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortBy, setSortBy] = useState<'Latest' | 'Oldest'>('Latest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy,
      });

      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter) params.append('status', statusFilter);
      if (sourceFilter) params.append('source', sourceFilter);

      const response = await api.get(`/leads?${params.toString()}`);
      setLeads(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, debouncedSearch, statusFilter, sourceFilter, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sourceFilter, sortBy]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Failed to delete lead. You might not have permission.');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter) params.append('status', statusFilter);
      if (sourceFilter) params.append('source', sourceFilter);

      const response = await api.get(`/leads/export?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Leads Overview</h2>
        <button
          onClick={() => {
            setEditingLead(null);
            setIsModalOpen(true);
          }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Add Lead
        </button>
      </div>

      <div className="bg-background rounded-xl shadow-sm border border-muted p-4">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sourceFilter={sourceFilter}
          setSourceFilter={setSourceFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onExport={handleExportCSV}
        />

        <div className="mt-6">
          <LeadList
            leads={leads}
            loading={loading}
            onEdit={(lead) => {
              setEditingLead(lead);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6">
            <PaginationControls
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lead={editingLead}
        onSuccess={fetchLeads}
      />
    </div>
  );
};

export default Dashboard;
