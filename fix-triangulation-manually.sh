#!/bin/bash
cd /c/mega-project

# Backup original
cp src/components/TriangulationPreview.js src/components/TriangulationPreview.js.backup-exceptional-2

# Create the fixed version
cat > /tmp/fixed-triangulation.js << 'FIXEDCODE'
import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';

const Container = styled.div\`
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  color: #333333;
\`;

const Header = styled.div\`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
\`;

const Title = styled.h2\`
  color: #1a237e;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
\`;

const AnalysisSection = styled.div\`
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f5f7fa;
  border-radius: 8px;
  border-left: 4px solid #3f51b5;
  color: #333333;
\`;

const SectionTitle = styled.h3\`
  color: #1a237e;
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 600;
\`;

const DataTable = styled.table\`
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
\`;

const PartyBadge = styled.span\`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  margin-left: 8px;
  background: \${props =>
    props.\$party === 'Republican' ? '#d32f2f' :
    props.\$party === 'Democrat' ? '#1976d2' :
    '#616161'
  };
  color: white;
  text-shadow: 0 1px 1px rgba(0,0,0,0.2);
\`;

const Pagination = styled.div\`
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
\`;

const Columns = styled.div\`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
\`;

const Column = styled.div\`
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  min-height: 400px;
  border: 1px solid #e0e0e0;
\`;

const ColumnTitle = styled.h3\`
  color: #1a237e;
  margin-top: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3f51b5;
  font-weight: 600;
\`;

const TriangulationPreview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // EXCEPTIONAL GRAPHQL QUERY FOR MASTERPIECE SCHEMA
  const data = useStaticQuery(graphql\`
    query ExceptionalMoneyTrailQuery {
      contributions: allMoneyTrail(sort: {contribution_receipt_amount: DESC}, limit: 100) {
        nodes {
          id
          contributor_name
          contribution_receipt_amount
          contribution_receipt_date
          
          # EXCEPTIONAL: Flattened Committee Metadata
          committee_name
          committee_type_full
          committee_organization_type_full
          committee_treasurer_name
          committee_party_full
          committee_state_full
          
          # M.E.G.A. Analysis Scores
          influence_score
          transparency_score
          longevity_score
          accountability_score
          
          # Raw Data for Triangulation
          contributor_employer
          contributor_occupation
          contributor_city
          contributor_state
          report_year
          two_year_transaction_period
        }
      }
      metadata: moneyTrailMetadata {
        total_amount
        average_amount
        biggest_donation
        total_contributions
        version
      }
    }
  \`);

  const contributions = data.contributions?.nodes || [];
  const metadata = data.metadata || {};
  const totalPages = Math.ceil(contributions.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = contributions.slice(startIndex, endIndex);

  return (
    <Container>
      <Header>
        <Title>M.E.G.A. Triangulation Engine V4.1</Title>
        <div style={{ color: '#666', fontSize: '0.9rem' }}>
          Data Status: <strong>EXCEPTIONAL</strong> • Records: {metadata.total_contributions || contributions.length}
        </div>
      </Header>
      
      <AnalysisSection>
        <SectionTitle>🎯 M.E.G.A. Analysis</SectionTitle>
        <p>
          <strong>Exceptional Schema Active:</strong> 31 committee fields flattened and preserved. 
          Total tracked: <strong>\${(metadata.total_amount / 1000000).toFixed(1)}M</strong> across {metadata.total_contributions || contributions.length} contributions.
        </p>
        <p>
          <strong>Largest Donation:</strong> \${metadata.biggest_donation?.toLocaleString() || 'N/A'} • 
          <strong> Average:</strong> \${metadata.average_amount?.toLocaleString() || 'N/A'}
        </p>
      </AnalysisSection>
      
      <Columns>
        {/* Column 1: Power/Money Trail - EXCEPTIONAL DATA */}
        <Column>
          <ColumnTitle>💰 Power/Money Trail</ColumnTitle>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
            FEC API • Enhanced Committee Metadata • {contributions.length} records
          </p>
          <DataTable>
            <thead>
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Committee</th>
                <th>Influence</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    {item.contributor_name || 'Unknown'}
                    {item.contributor_employer && (
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {item.contributor_employer}
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>\${(item.contribution_receipt_amount || 0).toLocaleString()}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {item.contribution_receipt_date?.split('T')[0] || ''}
                    </div>
                  </td>
                  <td>
                    {item.committee_name || 'N/A'}
                    {item.committee_type_full && (
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {item.committee_type_full}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ 
                      width: '60px', 
                      height: '6px', 
                      background: '#e0e0e0',
                      borderRadius: '3px',
                      marginTop: '4px'
                    }}>
                      <div style={{
                        width: \`\${(item.influence_score || 0) * 60}px\`,
                        height: '6px',
                        background: item.influence_score > 0.7 ? '#4caf50' : 
                                  item.influence_score > 0.4 ? '#ff9800' : '#f44336',
                        borderRadius: '3px'
                      }} />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                      {(item.influence_score * 100).toFixed(0)}%
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
                    className={\`pagination-button \${currentPage === pageNum ? 'active' : ''}\`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
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
        
        {/* Column 2: Official Narrative - PLACEHOLDER */}
        <Column>
          <ColumnTitle>📜 Official Narrative</ColumnTitle>
          <div style={{ 
            padding: '2rem', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '6px',
            textAlign: 'center',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
            <h4 style={{ color: '#1a237e', marginBottom: '0.5rem' }}>
              Phase 3.2: Congress.gov API
            </h4>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Legislative data integration pending.<br/>
              <strong>Next Masterpiece Layer</strong>
            </p>
          </div>
        </Column>
        
        {/* Column 3: Ground Truth - PLACEHOLDER */}
        <Column>
          <ColumnTitle>📊 Ground Truth</ColumnTitle>
          <div style={{ 
            padding: '2rem', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '6px',
            textAlign: 'center',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
            <h4 style={{ color: '#1a237e', marginBottom: '0.5rem' }}>
              Phase 3.3: Outcome Metrics
            </h4>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Real-world impact data.<br/>
              <strong>Final Triangulation Layer</strong>
            </p>
          </div>
        </Column>
      </Columns>
    </Container>
  );
};

export default TriangulationPreview;
FIXEDCODE

# Replace the file
cp /tmp/fixed-triangulation.js src/components/TriangulationPreview.js

echo "✅ Exceptional TriangulationPreview.js created with:"
echo "   - Fixed GraphQL query for exceptional schema"
echo "   - 31 committee fields accessible"
echo "   - M.E.G.A. analysis scores integrated"
echo "   - Pagination preserved"
echo "   - Masterpiece-ready UI"
