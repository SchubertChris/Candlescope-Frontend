// src/Pages/Dashboard/Components/DashboardInvoices.tsx
// NEU: Invoices-Component für Admin/Kunde Rechnungs-Management
import React, { useState, useMemo } from 'react';
import { 
  HiReceiptTax,
  HiEye,
  HiDownload,
  HiCreditCard,
  HiCash,
  HiCheck,
  HiClock,
  HiExclamation, // KORRIGIERT: HiExclamationTriangle → HiExclamation
  HiX,
  HiPlus,
  HiFilter,
  HiSearch,
  HiChevronDown,
  HiChevronUp,
  HiBriefcase,
  HiCalendar,
  HiCurrencyEuro
} from 'react-icons/hi';
import { DashboardInvoicesProps, Invoice, InvoiceStatus, formatCurrency, formatDate } from '../../Types/DashboardTypes';

const DashboardInvoices: React.FC<DashboardInvoicesProps> = ({
  invoices,
  userRole,
  onInvoiceUpdate,
  onCreateInvoice,
  onPayInvoice
}) => {
  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status' | 'dueDate'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // UI States
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Status-Konfigurationen
  const statusConfig = {
    draft: { 
      label: 'Entwurf', 
      color: '#6B7280', 
      icon: HiClock,
      description: 'Noch nicht versendet'
    },
    sent: { 
      label: 'Versendet', 
      color: '#3B82F6', 
      icon: HiClock,
      description: 'Wartet auf Zahlung'
    },
    paid: { 
      label: 'Bezahlt', 
      color: '#10B981', 
      icon: HiCheck,
      description: 'Vollständig bezahlt'
    },
    overdue: { 
      label: 'Überfällig', 
      color: '#EF4444', 
      icon: HiExclamation, // KORRIGIERT
      description: 'Zahlungsziel überschritten'
    },
    cancelled: { 
      label: 'Storniert', 
      color: '#6B7280', 
      icon: HiX,
      description: 'Rechnung storniert'
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedInvoices = useMemo(() => {
    let filtered = invoices;

    // Search Filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status Filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default: // date
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [invoices, searchTerm, statusFilter, sortBy, sortOrder]);

  // Statistics
  const statistics = useMemo(() => {
    const stats = {
      total: invoices.length,
      totalAmount: 0,
      paid: 0,
      paidAmount: 0,
      pending: 0,
      pendingAmount: 0,
      overdue: 0,
      overdueAmount: 0
    };

    invoices.forEach(invoice => {
      stats.totalAmount += invoice.totalAmount;
      
      switch (invoice.status) {
        case 'paid':
          stats.paid += 1;
          stats.paidAmount += invoice.totalAmount;
          break;
        case 'sent':
          stats.pending += 1;
          stats.pendingAmount += invoice.totalAmount;
          break;
        case 'overdue':
          stats.overdue += 1;
          stats.overdueAmount += invoice.totalAmount;
          break;
      }
    });

    return stats;
  }, [invoices]);

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    console.log('👁️ VIEW INVOICE:', invoiceId);
    // TODO: Implement invoice view modal
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('📄 DOWNLOAD INVOICE:', invoiceId);
    // TODO: Implement PDF download
  };

  const handlePayInvoice = (invoiceId: string) => {
    if (onPayInvoice) {
      onPayInvoice(invoiceId);
    }
  };

  const toggleInvoiceExpansion = (invoiceId: string) => {
    setExpandedInvoice(prev => prev === invoiceId ? null : invoiceId);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="view-content">
      <div className="view-header">
        <div className="view-title">
          <h1>
            <HiReceiptTax className="icon icon--action" />
            Rechnungen
          </h1>
          <p>
            {userRole === 'admin' 
              ? 'Verwalten Sie alle Kundenrechnungen' 
              : 'Übersicht Ihrer Rechnungen und Zahlungen'
            }
          </p>
        </div>
        
        {userRole === 'admin' && onCreateInvoice && (
          <button className="btn btn--primary" onClick={onCreateInvoice}>
            <HiPlus className="icon icon--btn" />
            Neue Rechnung
          </button>
        )}
      </div>

      {/* Statistiken */}
      <div className="invoice-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <HiReceiptTax className="icon icon--stat" />
            </div>
            <div className="stat-content">
              <h3>Gesamt</h3>
              <div className="stat-value">{statistics.total}</div>
              <div className="stat-secondary">{formatCurrency(statistics.totalAmount)}</div>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">
              <HiCheck className="icon icon--stat" />
            </div>
            <div className="stat-content">
              <h3>Bezahlt</h3>
              <div className="stat-value">{statistics.paid}</div>
              <div className="stat-secondary">{formatCurrency(statistics.paidAmount)}</div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">
              <HiClock className="icon icon--stat" />
            </div>
            <div className="stat-content">
              <h3>Ausstehend</h3>
              <div className="stat-value">{statistics.pending}</div>
              <div className="stat-secondary">{formatCurrency(statistics.pendingAmount)}</div>
            </div>
          </div>
          
          <div className="stat-card danger">
            <div className="stat-icon">
              <HiExclamation className="icon icon--stat" />
            </div>
            <div className="stat-content">
              <h3>Überfällig</h3>
              <div className="stat-value">{statistics.overdue}</div>
              <div className="stat-secondary">{formatCurrency(statistics.overdueAmount)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="invoice-controls">
        <div className="search-section">
          <div className="search-input">
            <HiSearch className="icon icon--detail" />
            <input
              type="text"
              placeholder="Rechnungsnummer oder Beschreibung suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <HiFilter className="icon icon--btn" />
            Filter
            {showFilters ? <HiChevronUp /> : <HiChevronDown />}
          </button>
        </div>
        
        {showFilters && (
          <div className="filter-section">
            <div className="filter-group">
              <label>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | 'all')}
              >
                <option value="all">Alle Status</option>
                <option value="draft">Entwurf</option>
                <option value="sent">Versendet</option>
                <option value="paid">Bezahlt</option>
                <option value="overdue">Überfällig</option>
                <option value="cancelled">Storniert</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sortierung</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy as typeof sortBy);
                  setSortOrder(newSortOrder as 'asc' | 'desc');
                }}
              >
                <option value="date-desc">Neueste zuerst</option>
                <option value="date-asc">Älteste zuerst</option>
                <option value="amount-desc">Höchster Betrag</option>
                <option value="amount-asc">Niedrigster Betrag</option>
                <option value="dueDate-asc">Fälligkeitsdatum</option>
                <option value="status-asc">Status A-Z</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Rechnungsliste */}
      <div className="invoice-list">
        {filteredAndSortedInvoices.length === 0 ? (
          <div className="empty-state">
            <HiReceiptTax className="icon icon--project-type" />
            <h3>Keine Rechnungen gefunden</h3>
            <p>
              {searchTerm || statusFilter !== 'all'
                ? 'Keine Rechnungen entsprechen den aktuellen Filterkriterien.'
                : 'Es sind noch keine Rechnungen vorhanden.'
              }
            </p>
            {userRole === 'admin' && onCreateInvoice && (
              <button className="btn btn--primary" onClick={onCreateInvoice}>
                <HiPlus className="icon icon--btn" />
                Erste Rechnung erstellen
              </button>
            )}
          </div>
        ) : (
          <div className="invoice-cards">
            {filteredAndSortedInvoices.map((invoice) => {
              const config = statusConfig[invoice.status];
              const StatusIcon = config.icon;
              const isExpanded = expandedInvoice === invoice.id;
              const isDue = isOverdue(invoice.dueDate) && invoice.status === 'sent';
              
              return (
                <div 
                  key={invoice.id} 
                  className={`invoice-card ${isDue ? 'overdue' : ''} ${isExpanded ? 'expanded' : ''}`}
                >
                  {/* Header */}
                  <div className="invoice-header" onClick={() => toggleInvoiceExpansion(invoice.id)}>
                    <div className="invoice-main-info">
                      <div className="invoice-number">
                        <h3>{invoice.invoiceNumber}</h3>
                        <span className={`status-badge status-${invoice.status}`}>
                          <StatusIcon className="icon icon--detail" />
                          {config.label}
                        </span>
                      </div>
                      
                      <div className="invoice-description">
                        <p>{invoice.description}</p>
                        {userRole === 'admin' && (
                          <small>Kunde-ID: {invoice.customerId}</small>
                        )}
                      </div>
                    </div>
                    
                    <div className="invoice-amount-info">
                      <div className="amount-display">
                        <span className="total-amount">{formatCurrency(invoice.totalAmount)}</span>
                        <span className="net-amount">Netto: {formatCurrency(invoice.amount)}</span>
                      </div>
                      
                      <div className="date-info">
                        <span className="created-date">
                          <HiCalendar className="icon icon--detail" />
                          {formatDate(invoice.createdAt)}
                        </span>
                        <span className={`due-date ${isDue ? 'overdue' : ''}`}>
                          Fällig: {formatDate(invoice.dueDate)}
                        </span>
                      </div>
                      
                      <button className="expand-button">
                        {isExpanded ? <HiChevronUp /> : <HiChevronDown />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="invoice-details">
                      {/* Rechnungsposten */}
                      <div className="invoice-items">
                        <h4>Rechnungsposten</h4>
                        <div className="items-table">
                          <div className="items-header">
                            <span>Beschreibung</span>
                            <span>Menge</span>
                            <span>Einzelpreis</span>
                            <span>Gesamt</span>
                          </div>
                          {invoice.items.map((item) => (
                            <div key={item.id} className="item-row">
                              <span className="item-description">{item.description}</span>
                              <span className="item-quantity">{item.quantity}</span>
                              <span className="item-price">{formatCurrency(item.unitPrice)}</span>
                              <span className="item-total">{formatCurrency(item.totalPrice)}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Summen */}
                        <div className="invoice-totals">
                          <div className="total-row">
                            <span>Nettobetrag:</span>
                            <span>{formatCurrency(invoice.amount)}</span>
                          </div>
                          <div className="total-row">
                            <span>MwSt. ({invoice.taxRate}%):</span>
                            <span>{formatCurrency(invoice.taxAmount)}</span>
                          </div>
                          <div className="total-row final">
                            <span>Gesamtbetrag:</span>
                            <span>{formatCurrency(invoice.totalAmount)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Zahlungsinformationen */}
                      {invoice.status === 'paid' && invoice.paidDate && (
                        <div className="payment-info">
                          <h4>Zahlungsinformationen</h4>
                          <div className="payment-details">
                            <span className="payment-date">
                              Bezahlt am: {formatDate(invoice.paidDate)}
                            </span>
                            {invoice.paymentMethod && (
                              <span className="payment-method">
                                Zahlungsart: {invoice.paymentMethod === 'bank_transfer' ? 'Überweisung' : 
                                              invoice.paymentMethod === 'paypal' ? 'PayPal' : 
                                              invoice.paymentMethod === 'stripe' ? 'Kreditkarte' : 'Bar'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notizen */}
                      {invoice.notes && (
                        <div className="invoice-notes">
                          <h4>Notizen</h4>
                          <p>{invoice.notes}</p>
                        </div>
                      )}

                      {/* Aktionen */}
                      <div className="invoice-actions">
                        <button 
                          className="btn btn--secondary"
                          onClick={() => handleViewInvoice(invoice.id)}
                        >
                          <HiEye className="icon icon--btn" />
                          Anzeigen
                        </button>
                        
                        <button 
                          className="btn btn--secondary"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <HiDownload className="icon icon--btn" />
                          PDF
                        </button>
                        
                        {userRole === 'kunde' && (invoice.status === 'sent' || invoice.status === 'overdue') && (
                          <button 
                            className="btn btn--primary"
                            onClick={() => handlePayInvoice(invoice.id)}
                          >
                            <HiCreditCard className="icon icon--btn" />
                            Jetzt bezahlen
                          </button>
                        )}
                        
                        {userRole === 'admin' && invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                          <button 
                            className="btn btn--success"
                            onClick={() => {
                              if (onInvoiceUpdate) {
                                onInvoiceUpdate({
                                  ...invoice,
                                  status: 'paid',
                                  paidDate: new Date().toISOString(),
                                  paymentMethod: 'bank_transfer'
                                });
                              }
                            }}
                          >
                            <HiCheck className="icon icon--btn" />
                            Als bezahlt markieren
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardInvoices;