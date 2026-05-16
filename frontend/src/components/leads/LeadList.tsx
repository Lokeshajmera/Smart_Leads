import type { Lead } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Edit2, Trash2, Mail, Globe, Share2, Users, Eye } from 'lucide-react';
import clsx from 'clsx';
import LeadDetailsModal from './LeadDetailsModal';

interface LeadListProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Qualified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Lost: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const SourceIcon = ({ source }: { source: string }) => {
  if (source === 'Website') return <Globe size={14} className="inline mr-1" />;
  if (source === 'Instagram') return <Share2 size={14} className="inline mr-1" />;
  return <Users size={14} className="inline mr-1" />;
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);

const LeadList = ({ leads, loading, onEdit, onDelete }: LeadListProps) => {
  const { user } = useAuth();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted">
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Users size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No leads found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters or add a new lead.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Source</th>
            <th className="px-6 py-3">Created</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="hover:bg-muted/40 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                {lead.name}
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                <a href={`mailto:${lead.email}`} className="flex items-center hover:text-primary transition-colors">
                  <Mail size={14} className="mr-1.5" />
                  {lead.email}
                </a>
              </td>
              <td className="px-6 py-4">
                <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold', statusColors[lead.status])}>
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-4 text-muted-foreground text-sm">
                <SourceIcon source={lead.source} />
                {lead.source}
              </td>
              <td className="px-6 py-4 text-muted-foreground text-sm">
                {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleView(lead)}
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => onDelete(lead._id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <LeadDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        lead={selectedLead}
      />
    </div>
  );
};

export default LeadList;
