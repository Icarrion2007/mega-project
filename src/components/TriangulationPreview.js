import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  background: #0A1D3F;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 229, 255, 0.2);
  margin: 2rem 0;
  color: #ffffff;
  border: 1px solid rgba(0, 229, 255, 0.3);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(0, 229, 255, 0.5);
`;

const Title = styled.h2`
  color: #00E5FF;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
`;

const AnalysisSection = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(0, 229, 255, 0.1);
  border-radius: 8px;
  border-left: 4px solid #00E5FF;
  color: #ffffff;
`;

const SectionTitle = styled.h3`
  color: #00E5FF;
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #ffffff;

  th {
    background: rgba(0, 229, 255, 0.2);
    color: #00E5FF;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border: 1px solid rgba(0, 229, 255, 0.3);
  }

  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    vertical-align: middle;
    color: #ffffff;
  }

  tr:hover {
    background: rgba(0, 229, 255, 0.05);
  }

  tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;

  .pagination-button {
    padding: 8px 16px;
    border: 1px solid rgba(0, 229, 255, 0.5);
    background: rgba(0, 229, 255, 0.1);
    cursor: pointer;
    border-radius: 4px;
    color: #ffffff;
    font-weight: 500;

    &:hover {
      background: rgba(0, 229, 255, 0.2);
      border-color: #00E5FF;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.active {
      background: #00E5FF;
      color: #0A1D3F;
      border-color: #00E5FF;
    }
  }
`;

const ColumnContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  min-height: 500px;
  border: 1px solid rgba(0, 229, 255, 0.2);
  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled.h3`
  color: #00E5FF;
  margin-top: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #00E5FF;
  font-size: 1.2rem;
`;

const ScoreBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-top: 4px;
  overflow: hidden;

  .score-fill {
    height: 100%;
    background: ${props => 
      props.score > 0.7 ? '#4caf50' : 
      props.score > 0.4 ? '#ff9800' : '#f44336'
    };
    width: ${props => `${props.score * 100}%`};
    border-radius: 3px;
    transition: width 0.3s ease;
  }
`;

const TriangulationPreview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCongressPage, setCurrentCongressPage] = useState(1);
  const recordsPerPage = 10;
  const congressRecordsPerPage = 5;

  // ENHANCED GraphQL query with Congress.gov data
  const data = useStaticQuery(graphql`
    query MoneyTrailQueryV43 {
      # Money Trail Data (Column 1)
      allMoneyTrail(sort: {contribution_receipt_amount: DESC}) {
        nodes {
          id
          contributor_name
          contribution_receipt_amount
          contribution_receipt_date
          contributor_employer
          contributor_occupation
          contributor_city
          contributor_state
          committee_name
          committee_type_full
          committee_id
          treasurer_name
          party_full
          state_full
          influence_score
          transparency_score
          longevity_score
          accountability_score
          report_year
          two_year_transaction_period
        }
      }
      
      metadata: moneyTrailMetadata {
        total_amount
        total_contributions
        parties_present
        parties_full_present
        enhanced
        timestamp
      }
      
      # Congress.gov Data (Column 2 - NEW Phase 3.2)
      allCongressNarrative(sort: {introduced_date: DESC}) {
        nodes {
          id
          bill_id
          bill_number
          bill_type
          congress
          title
          introduced_date
          latest_action
          policy_area
          sponsor_name
          sponsor_party
          sponsor_state
          cosponsor_count
          influence_score
          transparency_score
          progress_score
          donor_state_alignment
          status
          last_action_date
        }
      }
      
      congressMetadata: congressNarrativeMetadata {
        bill_count
        data_source
        timestamp
        version
        triangulation_ready
        note
      }
    }
  `);

  const contributions = data.allMoneyTrail?.nodes || [];
  const metadata = data.metadata || {};
  const congressBills = data.allCongressNarrative?.nodes || [];
  const congressMeta = data.congressMetadata || {};
  
  // Sort by influence score if available
  const sortedContributions = [...contributions].sort((a, b) => 
    (b.influence_score || 0) - (a.influence_score || 0)
  );
  
  // Sort Congress bills by date
  const sortedCongressBills = [...congressBills].sort((a, b) => 
    new Date(b.introduced_date) - new Date(a.introduced_date)
  );
  
  // Pagination calculations
  const totalPages = Math.ceil(sortedContributions.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = sortedContributions.slice(startIndex, endIndex);
  
  const congressTotalPages = Math.ceil(sortedCongressBills.length / congressRecordsPerPage);
  const congressStartIndex = (currentCongressPage - 1) * congressRecordsPerPage;
  const congressEndIndex = congressStartIndex + congressRecordsPerPage;
  const currentCongressRecords = sortedCongressBills.slice(congressStartIndex, congressEndIndex);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'passed':
      case 'enacted':
      case 'signed':
        return '#4CAF50';
      case 'failed':
      case 'vetoed':
        return '#F44336';
      case 'in committee':
      case 'referred':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <Container>
      <Header>
        <Title>M.E.G.A. Triangulation Engine V4.3</Title>
        <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>
          <strong>STATUS: OPERATIONAL</strong> • 
          Records: {metadata.total_contributions || contributions.length} • 
          Congress Bills: {congressMeta.bill_count || congressBills.length}
        </div>
      </Header>
      
      <AnalysisSection>
        <SectionTitle>🎯 M.E.G.A. V4.3 Enhanced Analysis</SectionTitle>
        <p style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
          <strong>Phase 3.2 Active:</strong> Congress.gov API integration complete. Triangulating campaign finance against legislative actions.
        </p>
        <p style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
          <strong>Money Trail:</strong> {formatCurrency(metadata.total_amount)} across {metadata.total_contributions || contributions.length} contributions.
        </p>
        <p style={{ color: '#ffffff' }}>
          <strong>Official Narrative:</strong> {congressMeta.bill_count || congressBills.length} bills tracked from {congressMeta.data_source || 'Congress.gov'}.
          {congressMeta.triangulation_ready && <span style={{ color: '#4CAF50', marginLeft: '1rem' }}>• TRIANGULATION READY</span>}
        </p>
      </AnalysisSection>
      
      <ColumnContainer>
        {/* Column 1: Power/Money Trail */}
        <Column>
          <ColumnTitle>
            💰 Power/Money Trail
            <div style={{ fontSize: '0.8rem', color: '#cccccc', marginTop: '0.25rem' }}>
              FEC API • {contributions.length} records
            </div>
          </ColumnTitle>
          
          <DataTable>
            <thead>
              <tr>
                <th>Donor/Committee</th>
                <th>Amount</th>
                <th>Influence</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>
                      {item.contributor_name || item.committee_name || 'Unknown'}
                    </div>
                    {item.contributor_employer && (
                      <div style={{ fontSize: '0.8rem', color: '#cccccc' }}>
                        {item.contributor_employer}
                        {item.contributor_occupation && ` • ${item.contributor_occupation}`}
                      </div>
                    )}
                    {item.committee_type_full && (
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>
                        {item.committee_type_full}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#00E5FF' }}>
                      {formatCurrency(item.contribution_receipt_amount)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#cccccc' }}>
                      {formatDate(item.contribution_receipt_date)}
                      {item.contributor_state && ` • ${item.contributor_state}`}
                    </div>
                  </td>
                  <td>
                    <ScoreBar score={item.influence_score || 0}>
                      <div className="score-fill" />
                    </ScoreBar>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      fontSize: '0.8rem',
                      marginTop: '2px'
                    }}>
                      <span style={{ color: '#cccccc' }}>Influence</span>
                      <span style={{ color: '#ffffff', fontWeight: '600' }}>
                        {((item.influence_score || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr',
                      gap: '4px',
                      marginTop: '8px',
                      fontSize: '0.7rem'
                    }}>
                      <div>
                        <div style={{ color: '#888' }}>Transparency</div>
                        <div style={{ color: '#4caf50' }}>
                          {((item.transparency_score || 0) * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#888' }}>Accountability</div>
                        <div style={{ color: '#ff9800' }}>
                          {((item.accountability_score || 0) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          
          {totalPages > 1 && (
            <Pagination>
              <button
                className="pagination-button"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span style={{ color: '#cccccc', padding: '8px' }}>...</span>
                  <button
                    className="pagination-button"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                className="pagination-button"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </Pagination>
          )}
        </Column>
        
        {/* Column 2: Official Narrative (NOW WITH CONGRESS.GOV DATA) */}
        <Column>
          <ColumnTitle>
            📜 Official Narrative
            <div style={{ fontSize: '0.8rem', color: '#cccccc', marginTop: '0.25rem' }}>
              Congress.gov API • Phase 3.2 • {congressBills.length} bills
            </div>
          </ColumnTitle>
          
          {currentCongressRecords.length > 0 ? (
            <>
              {currentCongressRecords.map((bill, index) => (
                <div key={bill.id} style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${bill.sponsor_party === 'R' ? '#d32f2f' : '#1976d2'}`,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '700', 
                        color: '#FFFFFF',
                        fontSize: '1rem',
                        marginBottom: '0.25rem'
                      }}>
                        {bill.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#00E5FF', marginBottom: '0.5rem' }}>
                        {bill.bill_type.toUpperCase()}{bill.bill_number} • {bill.congress}th Congress
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.8rem',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ color: '#CCCCCC' }}>
                          <strong>Sponsor:</strong> {bill.sponsor_name || 'Unknown'} ({bill.sponsor_party}-{bill.sponsor_state})
                        </span>
                        <span style={{ 
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: bill.donor_state_alignment === 'High-Donor State' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(158, 158, 158, 0.2)',
                          color: bill.donor_state_alignment === 'High-Donor State' ? '#FFC107' : '#9E9E9E',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {bill.donor_state_alignment}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '0.8rem', color: '#CCCCCC', marginBottom: '0.5rem' }}>
                        <strong>Policy:</strong> {bill.policy_area}
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '0.75rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px' }}>
                            Legislative Influence
                          </div>
                          <ScoreBar score={bill.influence_score || 0}>
                            <div className="score-fill" />
                          </ScoreBar>
                          <div style={{ fontSize: '0.7rem', color: '#FFFFFF', textAlign: 'right' }}>
                            {((bill.influence_score || 0) * 100).toFixed(0)}%
                          </div>
                        </div>
                        
                        <div style={{ 
                          padding: '4px 12px',
                          borderRadius: '20px',
                          background: getStatusColor(bill.status),
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {bill.status}
                        </div>
                      </div>
                      
                      <div style={{ 
                        fontSize: '0.7rem', 
                        color: '#888',
                        marginTop: '0.5rem',
                        fontStyle: 'italic'
                      }}>
                        Introduced: {formatDate(bill.introduced_date)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {congressTotalPages > 1 && (
                <Pagination style={{ marginTop: '1rem' }}>
                  <button
                    className="pagination-button"
                    onClick={() => setCurrentCongressPage(prev => Math.max(1, prev - 1))}
                    disabled={currentCongressPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(3, congressTotalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-button ${currentCongressPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentCongressPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    className="pagination-button"
                    onClick={() => setCurrentCongressPage(prev => Math.min(congressTotalPages, prev + 1))}
                    disabled={currentCongressPage === congressTotalPages}
                  >
                    Next
                  </button>
                </Pagination>
              )}
            </>
          ) : (
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{ 
                fontSize: '3rem',
                marginBottom: '1rem',
                color: '#00E5FF',
                opacity: 0.7
              }}>
                ⚖️
              </div>
              <h4 style={{ 
                color: '#00E5FF', 
                marginBottom: '1rem',
                fontSize: '1.3rem'
              }}>
                Congress.gov Data Loading
              </h4>
              <div style={{ 
                color: '#cccccc', 
                lineHeight: '1.6',
                maxWidth: '400px',
                marginBottom: '2rem'
              }}>
                <p>
                  <strong>Phase 3.2 Implementation:</strong> Legislative data integration in progress.
                </p>
                <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
                  Ensure <code>fetch-congress-narrative.js</code> is running and API key is configured.
                </p>
              </div>
            </div>
          )}
          
          {congressBills.length > 0 && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'rgba(0, 229, 255, 0.1)',
              borderRadius: '6px',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              fontSize: '0.8rem',
              color: '#00E5FF'
            }}>
              <strong>Data Source:</strong> {congressMeta.data_source || 'Congress.gov'} • 
              <strong> Version:</strong> {congressMeta.version || '1.0'} • 
              <strong> Last Fetch:</strong> {congressMeta.timestamp ? formatDate(congressMeta.timestamp) : 'N/A'}
            </div>
          )}
        </Column>
        
        {/* Column 3: Ground Truth */}
        <Column>
          <ColumnTitle>
            📊 Ground Truth
            <div style={{ fontSize: '0.8rem', color: '#cccccc', marginTop: '0.25rem' }}>
              Outcome Metrics • Phase 3.3
            </div>
          </ColumnTitle>
          
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{ 
              fontSize: '3rem',
              marginBottom: '1rem',
              color: '#00E5FF',
              opacity: 0.7
            }}>
              📈
            </div>
            
            <h4 style={{ 
              color: '#00E5FF', 
              marginBottom: '1rem',
              fontSize: '1.3rem'
            }}>
              Impact & Outcome Analysis
            </h4>
            
            <div style={{ 
              color: '#cccccc', 
              lineHeight: '1.6',
              maxWidth: '400px',
              marginBottom: '2rem'
            }}>
              <p>
                <strong>Final Triangulation Layer:</strong> Measuring real-world impact of political contributions.
              </p>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
                Planned data sources: World Bank API, Government outcome metrics, policy implementation tracking.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(0, 229, 255, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              width: '100%'
            }}>
              <div style={{ 
                color: '#00E5FF',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                📋 PLANNED METRICS
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.85rem'
              }}>
                <div style={{ color: '#cccccc', textAlign: 'left' }}>• Policy Outcomes</div>
                <div style={{ color: '#888', textAlign: 'right' }}>World Bank</div>
                <div style={{ color: '#cccccc', textAlign: 'left' }}>• Economic Impact</div>
                <div style={{ color: '#888', textAlign: 'right' }}>OECD Data</div>
                <div style={{ color: '#cccccc', textAlign: 'left' }}>• Social Outcomes</div>
                <div style={{ color: '#888', textAlign: 'right' }}>UN Stats</div>
                <div style={{ color: '#cccccc', textAlign: 'left' }}>• Environmental</div>
                <div style={{ color: '#888', textAlign: 'right' }}>EPA Reports</div>
              </div>
            </div>
            
            <div style={{
              marginTop: '1.5rem',
              padding: '0.75rem',
              background: 'rgba(255, 193, 7, 0.1)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '6px',
              fontSize: '0.8rem',
              color: '#ffc107',
              width: '100%'
            }}>
              <strong>Development Priority:</strong> After Column 2 Stabilization
            </div>
          </div>
        </Column>
      </ColumnContainer>
      
      {/* Overall Status Footer */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        border: '1px solid rgba(0, 229, 255, 0.2)',
        fontSize: '0.85rem',
        color: '#cccccc',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#4caf50',
            animation: 'pulse 2s infinite'
          }} />
          <span><strong>Column 1:</strong> Operational with {contributions.length} records</span>
          <span style={{ margin: '0 0.5rem' }}>•</span>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#4caf50',
            animation: 'pulse 2s infinite'
          }} />
          <span><strong>Column 2:</strong> Congress.gov LIVE with {congressBills.length} bills</span>
          <span style={{ margin: '0 0.5rem' }}>•</span>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#ff9800',
            animation: 'pulse 2s infinite'
          }} />
          <span><strong>Column 3:</strong> Planned (Phase 3.3)</span>
        </div>
      </div>
    </Container>
  );
};

export default TriangulationPreview;