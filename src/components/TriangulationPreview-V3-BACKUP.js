import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  background: '#0A1D3F';
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  color: #333333;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
`;

const Title = styled.h2`
  color: #1a237e;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
`;

const AnalysisSection = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f5f7fa;
  border-radius: 8px;
  border-left: 4px solid #3f51b5;
  color: #333333;
`;

const SectionTitle = styled.h3`
  color: #1a237e;
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #333333;
  
  th {
    background: #3f51b5;
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border: none;
  }
  
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e0e0e0;
    vertical-align: middle;
    color: #333333;
  }
  
  tr:hover {
    background: #f0f2f5;
  }
  
  tr:nth-child(even) {
    background: #f9f9f9;
  }
`;

const PartyBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  margin-left: 8px;
  background: ${props => 
    props.$party === 'Republican' ? '#d32f2f' :
    props.$party === 'Democrat' ? '#1976d2' :
    '#616161'
  };
  color: white;
  text-shadow: 0 1px 1px rgba(0,0,0,0.2);
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
  
  .pagination-button {
    padding: 8px 16px;
    border: 1px solid #bdbdbd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
    color: #333333;
    font-weight: 500;
    
    &:hover {
      background: #f5f5f5;
      border-color: #3f51b5;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &.active {
      background: #3f51b5;
      color: white;
      border-color: #3f51b5;
    }
  }
`;

const StatItem = styled.div`
  margin-bottom: 0.75rem;
  
  strong {
    display: block;
    color: #1a237e;
    margin-bottom: 0.25rem;
    font-size: 0.95rem;
  }
  
  p {
    margin: 0;
    color: #333333;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const InsightBox = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #e8eaf6;
  border-radius: 8px;
  border-left: 4px solid #5c6bc0;
  color: #333333;
  font-size: 0.95rem;
  
  strong {
    color: #1a237e;
  }
`;

const TriangulationPreview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  const data = useStaticQuery(graphql`
    query EnhancedMoneyTrailQuery {
      contributions: allMoneyTrail(sort: {amount: DESC}) {
        nodes {
          id
          candidate
          contributor
          amount
          date
          employer
          location
          committee
          type
          party
        }
      }
      metadata: allMoneyTrailMetadata {
        nodes {
          total_amount
          average_amount
          biggest_donation
          total_contributions
          data_source
          timestamp
          parties_present
          enhanced
        }
      }
    }
  `);

  const allContributions = data.contributions.nodes;
  const metadata = data.metadata.nodes[0] || {};
  
  console.log('🔍 Current data:', {
    totalRecords: allContributions.length,
    committeeNames: allContributions.map(c => c.committee),
    amounts: allContributions.map(c => c.amount)
  });
  
  // Pagination - adjusted for 5 records
  const totalPages = Math.ceil(allContributions.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = allContributions.slice(startIndex, startIndex + recordsPerPage);
  
  // Top Recipients analysis - NOW WITH REAL COMMITTEE DATA
  const recipientAnalysis = allContributions.reduce((acc, item) => {
    const committeeName = item.committee || 'Unknown Committee';
    
    if (!acc[committeeName]) {
      acc[committeeName] = { 
        total: item.amount, 
        count: 1, 
        primaryParty: item.party,
        contributors: [item.contributor || 'Anonymous']
      };
    } else {
      acc[committeeName].total += item.amount;
      acc[committeeName].count += 1;
      acc[committeeName].contributors.push(item.contributor || 'Anonymous');
    }
    
    return acc;
  }, {});

  // Get all recipients sorted by total
  const allRecipients = Object.entries(recipientAnalysis)
    .map(([committeeName, data]) => {
      // Find most common contributor
      const contributorCounts = data.contributors.reduce((acc, contributor) => {
        acc[contributor] = (acc[contributor] || 0) + 1;
        return acc;
      }, {});
      
      const topContributor = Object.entries(contributorCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Various';
      
      return {
        name: committeeName,
        total: data.total,
        count: data.count,
        primaryParty: data.primaryParty,
        topContributor: topContributor,
        isUnknown: committeeName.includes('Unknown')
      };
    })
    .sort((a, b) => b.total - a.total);

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <Container>
      <Header>
        <Title>💰 Power/Money Trail Analysis</Title>
        <div style={{ color: '#666666', fontSize: '0.9rem' }}>
          Showing {allContributions.length} committee records • Candidate-focused data
        </div>
      </Header>

      <AnalysisSection>
        <SectionTitle>📊 Dataset Overview</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <StatItem>
            <strong>Total Receipts</strong>
            <p style={{ color: '#2e7d32', fontSize: '1.3rem' }}>
              ${metadata.total_amount?.toLocaleString() || '0'}
            </p>
          </StatItem>
          <StatItem>
            <strong>Number of Committees</strong>
            <p>{metadata.total_contributions || allContributions.length}</p>
          </StatItem>
          <StatItem>
            <strong>Largest Committee</strong>
            <p style={{ color: '#d32f2f' }}>
              ${metadata.biggest_donation?.toLocaleString() || '0'}
            </p>
          </StatItem>
          <StatItem>
            <strong>Average Receipts</strong>
            <p>${metadata.average_amount?.toLocaleString() || '0'}</p>
          </StatItem>
        </div>
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          background: '#e8f5e9', 
          borderRadius: '6px',
          borderLeft: '3px solid #4caf50',
          color: '#2e7d32',
          fontSize: '0.9rem'
        }}>
          ✅ <strong>Data Source Updated:</strong> Now showing candidate committee receipts from FEC /candidates/ endpoint
        </div>
      </AnalysisSection>

      {/* FIXED: Top Recipients Section - NOW WITH REAL DATA */}
      <AnalysisSection style={{ 
        background: '#ffffff', 
        border: '2px solid #e0e0e0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <SectionTitle style={{ 
          color: '#0A1D3F', 
          borderBottom: '3px solid #00E5FF', 
          paddingBottom: '0.5rem',
          fontSize: '1.4rem',
          fontWeight: '700',
          marginBottom: '1.5rem'
        }}>
          🏛️ Where the Money Flows - Top Recipient Committees
        </SectionTitle>
        
        <div style={{ 
          marginBottom: '1.5rem', 
          color: '#555555',
          fontSize: '0.95rem',
          lineHeight: '1.5',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid #e9ecef'
        }}>
          <strong style={{ color: '#0A1D3F', display: 'block', marginBottom: '0.25rem' }}>
            Committee Receipts Analysis:
          </strong>
          Showing total funds received by candidate committees in the 2024 election cycle.
        </div>
        
        {allRecipients.length > 0 ? (
          <>
            <DataTable>
              <thead>
                <tr>
                  <th style={{ 
                    background: 'linear-gradient(135deg, #0A1D3F 0%, #1a237e 100%)', 
                    color: '#FFFFFF', 
                    fontSize: '1rem',
                    padding: '1.25rem 1rem'
                  }}>Committee</th>
                  <th style={{ 
                    background: 'linear-gradient(135deg, #0A1D3F 0%, #1a237e 100%)', 
                    color: '#FFFFFF', 
                    fontSize: '1rem',
                    padding: '1.25rem 1rem'
                  }}>Total Receipts</th>
                  <th style={{ 
                    background: 'linear-gradient(135deg, #0A1D3F 0%, #1a237e 100%)', 
                    color: '#FFFFFF', 
                    fontSize: '1rem',
                    padding: '1.25rem 1rem'
                  }}>Record Count</th>
                  <th style={{ 
                    background: 'linear-gradient(135deg, #0A1D3F 0%, #1a237e 100%)', 
                    color: '#FFFFFF', 
                    fontSize: '1rem',
                    padding: '1.25rem 1rem'
                  }}>Party</th>
                  <th style={{ 
                    background: 'linear-gradient(135deg, #0A1D3F 0%, #1a237e 100%)', 
                    color: '#FFFFFF', 
                    fontSize: '1rem',
                    padding: '1.25rem 1rem'
                  }}>Primary Contributor Group</th>
                </tr>
              </thead>
              <tbody>
                {allRecipients.map((recipient, index) => {
                  // Determine party color
                  let partyColor = '#757575';
                  if (recipient.primaryParty === 'Republican') partyColor = '#d32f2f';
                  if (recipient.primaryParty === 'Democrat') partyColor = '#1976d2';
                  
                  return (
                    <tr key={`${recipient.name}-${index}`} style={{ 
                      background: index % 2 === 0 ? '#FFFFFF' : '#F8F9FA',
                      borderLeft: `5px solid ${partyColor}`,
                      transition: 'background-color 0.2s'
                    }}>
                      <td style={{ 
                        fontWeight: '700', 
                        color: '#0A1D3F',
                        padding: '1.25rem 1rem',
                        fontSize: '1.05rem',
                        verticalAlign: 'top'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{recipient.name}</span>
                          <span style={{ 
                            fontSize: '0.85rem', 
                            color: '#666666',
                            fontWeight: 'normal',
                            marginTop: '0.25rem'
                          }}>
                            Candidate Committee
                          </span>
                        </div>
                      </td>
                      <td style={{ 
                        fontWeight: '800', 
                        fontSize: '1.2rem',
                        color: '#2E7D32',
                        padding: '1.25rem 1rem',
                        verticalAlign: 'top'
                      }}>
                        {formatCurrency(recipient.total)}
                        <div style={{ 
                          fontSize: '0.85rem', 
                          color: '#666666',
                          fontWeight: 'normal',
                          marginTop: '0.25rem'
                        }}>
                          {(recipient.total / 1000000).toFixed(1)} million
                        </div>
                      </td>
                      <td style={{ 
                        color: '#5A5A5A', 
                        fontWeight: '600',
                        padding: '1.25rem 1rem',
                        fontSize: '1rem',
                        verticalAlign: 'top'
                      }}>
                        {recipient.count} record{recipient.count !== 1 ? 's' : ''}
                      </td>
                      <td style={{ 
                        padding: '1.25rem 1rem',
                        verticalAlign: 'top'
                      }}>
                        {recipient.primaryParty && recipient.primaryParty !== 'Unknown' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <PartyBadge $party={recipient.primaryParty}>{recipient.primaryParty}</PartyBadge>
                            <span style={{ 
                              fontSize: '0.85rem', 
                              color: '#666666',
                              fontStyle: 'italic'
                            }}>
                              {recipient.primaryParty === 'Republican' ? 'GOP' : 
                               recipient.primaryParty === 'Democrat' ? 'Dem' : 'Other'}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#757575', fontStyle: 'italic' }}>Unknown</span>
                        )}
                      </td>
                      <td style={{ 
                        fontSize: '0.95rem', 
                        color: '#424242',
                        padding: '1.25rem 1rem',
                        verticalAlign: 'top'
                      }}>
                        {recipient.topContributor}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
            
            {/* Insight Box */}
            <div style={{ 
              marginTop: '2rem', 
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)',
              border: '2px solid #cce5ff',
              borderRadius: '10px',
              color: '#004085',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ 
                  background: '#004085', 
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 4px rgba(0,64,133,0.2)'
                }}>
                  🔍
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    color: '#004085', 
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem'
                  }}>
                    Analytical Insight: Committee Concentration
                  </div>
                  <div style={{ color: '#0056b3' }}>
                    {allRecipients.length > 0 ? (
                      <>
                        The <strong style={{ color: '#0A1D3F' }}>{allRecipients[0].name}</strong> leads with{' '}
                        <strong style={{ color: '#2E7D32' }}>{formatCurrency(allRecipients[0].total)}</strong> in receipts{' '}
                        ({((allRecipients[0].total / metadata.total_amount) * 100).toFixed(1)}% of total).{' '}
                        This data shows candidate committee fundraising for the 2024 election cycle.
                      </>
                    ) : (
                      'No committee data available for analysis.'
                    )}
                  </div>
                </div>
              </div>
              
              <div style={{ 
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(0,64,133,0.1)',
                fontSize: '0.9rem',
                color: '#0056b3',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>
                  <strong>Data Source:</strong> FEC /candidates/ endpoint • {metadata.data_source || 'Candidate Committee Data'}
                </span>
                <span style={{ 
                  background: 'rgba(0,64,133,0.1)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem'
                }}>
                  {allRecipients.length} committees tracked
                </span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '2px dashed #dee2e6',
            color: '#6c757d'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#495057' }}>
              No Committee Data Available
            </div>
          </div>
        )}
      </AnalysisSection>

      {/* All Committee Records */}
      <AnalysisSection>
        <SectionTitle>📋 All Committee Records ({allContributions.length} total)</SectionTitle>
        <DataTable>
          <thead>
            <tr>
              <th>Committee</th>
              <th>Candidate/Description</th>
              <th>Total Receipts</th>
              <th>Primary Contributor Group</th>
              <th>Party</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: '600', color: '#0A1D3F' }}>{item.committee}</td>
                <td>{item.candidate || 'Candidate Committee'}</td>
                <td style={{ 
                  fontWeight: 'bold', 
                  color: item.amount > 100000000 ? '#2e7d32' : '#1a237e',
                  fontSize: item.amount > 100000000 ? '1.1rem' : '1rem'
                }}>
                  {formatCurrency(item.amount)}
                </td>
                <td style={{ color: '#555555' }}>{item.contributor}</td>
                <td>
                  {item.party && item.party !== 'Unknown' ? (
                    <PartyBadge $party={item.party}>{item.party}</PartyBadge>
                  ) : (
                    <span style={{ color: '#757575', fontStyle: 'italic' }}>Unknown</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>

        {totalPages > 1 && (
          <Pagination>
            <button 
              className="pagination-button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ← Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className="pagination-button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next →
            </button>
          </Pagination>
        )}
      </AnalysisSection>

      <InsightBox>
        <strong>Analysis Insight:</strong> Candidate committee fundraising data reveals the institutional financial infrastructure of political campaigns. The shift from individual contributor data to committee receipts provides a clearer picture of where campaign funds are centralized and controlled.
        {allRecipients.length > 0 && (
          <span>
            {' '}The top committee (<strong>{allRecipients[0].name}</strong>) represents{' '}
            <strong>{((allRecipients[0].total / metadata.total_amount) * 100).toFixed(1)}%</strong> of all committee receipts tracked.
          </span>
        )}
      </InsightBox>
    </Container>
  );
};

export default TriangulationPreview;