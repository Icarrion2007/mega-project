import React, { useState } from 'react';
import styled from 'styled-components';
import moneyTrail from '../data/moneyTrail.json';

// Styled Components
const Container = styled.div`
  margin: 3rem 0;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e8eaf6;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #1a237e;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VersionBadge = styled.span`
  background: #283593;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const DataStatus = styled.div`
  background: ${props => props.status === 'LIVE' ? '#e8f5e9' : '#fff3cd'};
  color: ${props => props.status === 'LIVE' ? '#2e7d32' : '#856404'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid ${props => props.status === 'LIVE' ? '#c8e6c9' : '#ffeaa7'};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
`;

const Column = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid ${props => 
    props.column === 1 ? '#e53935' : 
    props.column === 2 ? '#3949ab' : 
    '#43a047'};
`;

const ColumnTitle = styled.h3`
  font-size: 1.3rem;
  color: ${props => 
    props.column === 1 ? '#c62828' : 
    props.column === 2 ? '#283593' : 
    '#2e7d32'};
  margin: 0;
`;

const ColumnNumber = styled.span`
  background: ${props => 
    props.column === 1 ? '#ef5350' : 
    props.column === 2 ? '#5c6bc0' : 
    '#66bb6a'};
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const DataTable = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
`;

const DataRow = styled.div`
  padding: 0.8rem;
  border-bottom: 1px solid #eee;
  background: ${props => props.isHeader ? '#e3f2fd' : 'white'};
  font-weight: ${props => props.isHeader ? '600' : '400'};
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  align-items: center;
  
  &:hover {
    background: ${props => props.isHeader ? '#e3f2fd' : '#f5f5f5'};
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #3949ab;
    box-shadow: 0 0 0 2px rgba(57, 73, 171, 0.1);
  }
`;

const ClearButton = styled.button`
  padding: 0.6rem 1rem;
  background: #f5f5f5;
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #757575;
  padding: 2rem;
  font-style: italic;
`;

const TriangulationPreview = () => {
  const { results = [], _mega_metadata = {} } = moneyTrail;
  const { data_status = 'UNKNOWN' } = _mega_metadata;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'amount', direction: 'desc' });

  // Filter and sort data for Column 1
  const filteredData = results.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.contributor_name && item.contributor_name.toLowerCase().includes(searchLower)) ||
      (item.committee_name && item.committee_name.toLowerCase().includes(searchLower)) ||
      (item.contributor_state && item.contributor_state.toLowerCase().includes(searchLower))
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key === 'amount') {
      return sortConfig.direction === 'asc' 
        ? (a.contribution_receipt_amount || 0) - (b.contribution_receipt_amount || 0)
        : (b.contribution_receipt_amount || 0) - (a.contribution_receipt_amount || 0);
    } else if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc'
        ? new Date(a.contribution_receipt_date || 0) - new Date(b.contribution_receipt_date || 0)
        : new Date(b.contribution_receipt_date || 0) - new Date(a.contribution_receipt_date || 0);
    }
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>
            Triangulation Engine <VersionBadge>v3.1</VersionBadge>
          </Title>
          <p style={{ color: '#546e7a', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Compare the money trail against official narratives and ground truth
          </p>
        </div>
        <DataStatus status={data_status}>
          {data_status === 'LIVE' ? '✅ Live FEC Data' : '📚 Educational Data'}
        </DataStatus>
      </Header>

      <Grid>
        {/* Column 1: Money Trail */}
        <Column>
          <ColumnHeader column={1}>
            <ColumnTitle column={1}>Power/Money Trail</ColumnTitle>
            <ColumnNumber column={1}>1</ColumnNumber>
          </ColumnHeader>
          
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search contributors, committees, states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <ClearButton onClick={() => setSearchTerm('')}>
                Clear
              </ClearButton>
            )}
          </SearchContainer>

          <DataTable>
            <DataRow isHeader>
              <div>Contributor</div>
              <div 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('amount')}
              >
                Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </div>
              <div 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('date')}
              >
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </div>
            </DataRow>
            
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <DataRow key={index}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{item.contributor_name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {item.committee_name || 'No committee'} • {item.contributor_state || 'Unknown state'}
                    </div>
                  </div>
                  <div style={{ color: '#c62828', fontWeight: '500' }}>
                    ${(item.contribution_receipt_amount || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>
                    {item.contribution_receipt_date || 'Unknown date'}
                  </div>
                </DataRow>
              ))
            ) : (
              <EmptyState>
                {searchTerm ? 'No matches found' : 'No contribution data available'}
              </EmptyState>
            )}
          </DataTable>
          
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Showing {sortedData.length} of {results.length} contributions
            {data_status === 'EDUCATIONAL_FALLBACK' && (
              <div style={{ marginTop: '0.5rem', color: '#f57c00' }}>
                ⚠️ Educational data. Real FEC data requires API key upgrade.
              </div>
            )}
          </div>
        </Column>

        {/* Column 2: Official Narrative */}
        <Column>
          <ColumnHeader column={2}>
            <ColumnTitle column={2}>Official Narrative</ColumnTitle>
            <ColumnNumber column={2}>2</ColumnNumber>
          </ColumnHeader>
          
          <DataTable>
            <div style={{ padding: '1rem', lineHeight: '1.6' }}>
              <h4 style={{ color: '#3949ab', marginBottom: '1rem' }}>Congressional Activity</h4>
              <p>Sample legislative narratives that would correlate with contributions:</p>
              
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#e8eaf6', borderRadius: '6px' }}>
                <strong>Campaign Finance Reform Bill HR 1234</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  "This bill promotes transparency in political donations..." 
                  (Sponsored by representatives receiving PAC funds)
                </p>
              </div>
              
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#e8eaf6', borderRadius: '6px' }}>
                <strong>Tax Legislation SB 5678</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  "Corporate tax provisions benefiting major campaign contributors..."
                </p>
              </div>
            </div>
          </DataTable>
          
          <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
            Phase 3.2: Placeholder for Congress.gov API integration
          </div>
        </Column>

        {/* Column 3: Ground Truth */}
        <Column>
          <ColumnHeader column={3}>
            <ColumnTitle column={3}>Ground Truth</ColumnTitle>
            <ColumnNumber column={3}>3</ColumnNumber>
          </ColumnHeader>
          
          <DataTable>
            <div style={{ padding: '1rem', lineHeight: '1.6' }}>
              <h4 style={{ color: '#43a047', marginBottom: '1rem' }}>Systemic Analysis</h4>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Pattern Detection:</strong>
                <ul style={{ marginLeft: '1.5rem', fontSize: '0.9rem' }}>
                  <li>Recurring donors to multiple committees</li>
                  <li>Industry concentration in contributions</li>
                  <li>Timing correlations with legislation</li>
                </ul>
              </div>
              
              <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '6px' }}>
                <strong>Example Insight:</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  When comparing Column 1 (money) with Column 2 (narratives), 
                  look for legislation that benefits major contributors.
                </p>
              </div>
            </div>
          </DataTable>
          
          <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
            Phase 3.3: Placeholder for statistical API integration
          </div>
        </Column>
      </Grid>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#f3e5f5', 
        borderRadius: '8px',
        borderLeft: '4px solid #7b1fa2'
      }}>
        <strong>How to Use the Triangulation Engine:</strong>
        <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>Search and sort contributions in Column 1 to identify patterns</li>
          <li>Compare with official narratives in Column 2 (legislation, speeches)</li>
          <li>Analyze systemic connections in Column 3</li>
          <li>Look for alignment or misalignment between money flows and stated purposes</li>
        </ol>
      </div>
    </Container>
  );
};

export default TriangulationPreview;
