// src/Pages/Dashboard/Invoices/Invoices.tsx
// Updated für neue SCSS-Struktur und Context

import React, { useState, useMemo } from 'react';
import { 
  HiPlus, 
  HiSearch, 
  HiEye,
  HiPencil,
  HiTrash,
  HiDocumentDownload,
  HiFilter,
  HiReceiptTax
} from 'react-icons/hi';
import { useDashboard } from '../Context/DashboardContext';
import { Invoice } from '../Types/DashboardTypes';
import './Invoices.scss';

const Invoices: React.FC = () => {
const { invoices, onCreateInvoice, onInvoiceUpdate, onPayInvoice } = useDashboard();
const userRole = 'admin'; // Temporärer Fallback für Deployment
  
  // Local state für Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'number'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered and sorted invoices
  const filteredInvoices = useMemo(() => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sortierung
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'number':
          aValue = a.invoiceNumber;
          bValue = b.invoiceNumber;
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [invoices, searchTerm, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSort = (column: 'date' | 'amount' | 'number') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    console.log('View invoice:', invoice.id);
    // TODO: Implement view modal
  };

  const handleEditInvoice = (invoice: Invoice) => {
    console.log('Edit invoice:', invoice.id);
    // TODO: Implement edit modal
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    if (confirm(`Rechnung ${invoice.invoiceNumber} löschen?`)) {
      console.log('Delete invoice:', invoice.id);
      // TODO: Implement delete
    }
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    console.log('Download PDF:', invoice.id);
    // TODO: Implement PDF download
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const getStatusClass = (status: Invoice['status']) => {
    return `invoice-status invoice-status--${status}`;
  };

  const getStatusLabel = (status: Invoice['status']) => {
    const labels = {
      draft: 'Entwurf',
      sent: 'Versendet',
      paid: 'Bezahlt',
      overdue: 'Überfällig',
      cancelled: 'Storniert'
    };
    return labels[status] || status;
  };

  const getDueDateClass = (dueDate: string, status: Invoice['status']) => {
    if (status === 'paid') return '';
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 7) return 'due-soon';
    return '';
  };

  if (filteredInvoices.length === 0 && searchTerm === '' && statusFilter === 'all') {
    return (
      <div className="invoices-page">
        <div className="invoices-empty">
          <div className="empty-icon">
            <HiReceiptTax />
          </div>
          <h3>Noch keine Rechnungen</h3>
          <p>Erstellen Sie Ihre erste Rechnung, um loszulegen.</p>
          <button className="create-first-btn" onClick={onCreateInvoice}>
            <HiPlus /> Erste Rechnung erstellen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="invoices-page">
      {/* Page Header */}
      <div className="invoices-header">
        <div className="header-title">
          <h1>Rechnungen</h1>
          <p className="subtitle">
            {filteredInvoices.length} von {invoices.length} Rechnungen
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn--primary" onClick={onCreateInvoice}>
            <HiPlus className="icon--btn" />
            Neue Rechnung
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="invoices-filters">
        <div className="search-box">
          <HiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechnungsnummer oder Beschreibung suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <div className="filter-select">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Alle Status</option>
              <option value="draft">Entwurf</option>
              <option value="sent">Versendet</option>
              <option value="paid">Bezahlt</option>
              <option value="overdue">Überfällig</option>
              <option value="cancelled">Storniert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="invoices-table-container">
        <div className="table-wrapper">
          <table className="invoices-table">
            <thead>
              <tr>
                <th 
                  className={`sortable ${sortBy === 'number' ? `sort-${sortOrder}` : ''}`}
                  onClick={() => handleSort('number')}
                >
                  Rechnungsnummer
                </th>
                <th>Kunde</th>
                <th 
                  className={`sortable ${sortBy === 'amount' ? `sort-${sortOrder}` : ''}`}
                  onClick={() => handleSort('amount')}
                >
                  Betrag
                </th>
                <th>Status</th>
                <th>Fälligkeitsdatum</th>
                <th 
                  className={`sortable ${sortBy === 'date' ? `sort-${sortOrder}` : ''}`}
                  onClick={() => handleSort('date')}
                >
                  Erstellt
                </th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="invoice-number" onClick={() => handleViewInvoice(invoice)}>
                    {invoice.invoiceNumber}
                  </td>
                  <td>
                    {/* TODO: Customer name from customerId */}
                    Kunde #{invoice.customerId.substring(0, 8)}
                  </td>
                  <td className="amount">
                    {formatCurrency(invoice.totalAmount)}
                  </td>
                  <td>
                    <span className={getStatusClass(invoice.status)}>
                      {getStatusLabel(invoice.status)}
                    </span>
                  </td>
                  <td className={`due-date ${getDueDateClass(invoice.dueDate, invoice.status)}`}>
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td>{formatDate(invoice.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="action-btn view-btn"
                        onClick={() => handleViewInvoice(invoice)}
                        title="Anzeigen"
                      >
                        <HiEye />
                      </button>
                      {userRole === 'admin' && (
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEditInvoice(invoice)}
                          title="Bearbeiten"
                        >
                          <HiPencil />
                        </button>
                      )}
                      <button 
                        className="action-btn pdf-btn"
                        onClick={() => handleDownloadPDF(invoice)}
                        title="PDF herunterladen"
                      >
                        <HiDocumentDownload />
                      </button>
                      {userRole === 'admin' && (
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteInvoice(invoice)}
                          title="Löschen"
                        >
                          <HiTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="invoices-pagination">
          <div className="pagination-info">
            Zeige {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} von {filteredInvoices.length} Einträgen
          </div>
          
          <div className="pagination-controls">
            <button 
              className="page-btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Zurück
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="page-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Weiter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;