import type { Lead } from '../../types';
import { X, Calendar, Mail, Share2, User, Clock } from 'lucide-react';
import clsx from 'clsx';

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const LeadDetailsModal = ({ isOpen, onClose, lead }: LeadDetailsModalProps) => {
  if (!isOpen || !lead) return null;

  const statusColors = {
    New: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Qualified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Lost: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="bg-background w-full max-w-lg rounded-2xl shadow-2xl border border-muted relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="h-24 bg-primary relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 rounded-2xl bg-background border-4 border-background shadow-lg flex items-center justify-center text-primary font-bold text-3xl">
              {lead.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="pt-14 pb-8 px-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{lead.name}</h2>
              <div className="flex items-center text-muted-foreground mt-1">
                <Mail size={14} className="mr-2" />
                <span className="text-sm">{lead.email}</span>
              </div>
            </div>
            <span className={clsx(
              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
              statusColors[lead.status]
            )}>
              {lead.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              <div className="flex items-center group">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground mr-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Share2 size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Source</p>
                  <p className="text-sm font-semibold text-foreground">{lead.source}</p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground mr-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Assigned To</p>
                  <p className="text-sm font-semibold text-foreground">{lead.createdBy.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center group">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground mr-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Created Date</p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground mr-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Last Updated</p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(lead.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-muted flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;
