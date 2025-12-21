// File: src/components/TriangulationPreview.js
import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eaeaea;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
`;

const Metadata = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid #3498db;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const MetaItem = styled.div`
  p {
    margin: 0.25rem 0;
    color: #555;
  }
  strong {
    color: #2c3e50;
    display: block;
    margin-bottom: 0.25rem;
  }
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.95rem;
  
  th {
    background: #2c3e50;
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border: none;
  }
  
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #eaeaea;
    vertical-align: middle;
  }
  
  tr:hover {
    background: #f8f9fa;
  }
  
  tr:last-child td {
    border-bottom: none;
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
    props.party === 'Republican' ? '#e74c3c' : 
    props.party === 'Democrat' ? '#3498db' : 
    props.party === 'Independent' ? '#2ecc71' : 
    '#7f8c8d'
  };
  color: white;
`;

const AmountCell = styled.td`
  font-weight: bold;
  color: ${props => props.amount > 10000000 ? '#27ae60' : '#e67e22'};
  font-size: 1.1rem;
`;

const ContributorCell = styled.td`
  font-weight: 600;
  color: #2c3e50;
`;

const TriangulationPreview = () => {
  const data = useStaticQuery(graphql`
    query EnhancedMoneyTrailQuery {
      contributions: allMoneyTrail(sort: {amount: DESC}, limit: 25) {
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

  const contributions = data.contributions.nodes;
  const metadata = data.metadata.nodes[0] || {};

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

  return (
    <Container>
      <Header>
        <Title>💰 Power/Money Trail Analysis</Title>
        <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
          Data Source: {metadata.data_source || 'FEC API'}
        </div>
      </Header>

      <Metadata>
        <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Dataset Summary</h3>
        <MetaGrid>
          <MetaItem>
            <strong>Total Contributions</strong>
            <p>${metadata.total_amount?.toLocaleString() || '0'}</p>
          </MetaItem>
          <MetaItem>
            <strong>Number of Contributions</strong>
            <p>{metadata.total_contributions || 0}</p>
          </MetaItem>
          <MetaItem>
            <strong>Largest Donation</strong>
            <p>${metadata.biggest_donation?.toLocaleString() || '0'}</p>
          </MetaItem>
          <MetaItem>
            <strong>Average Donation</strong>
            <p>${metadata.average_amount?.toLocaleString() || '0'}</p>
          </MetaItem>
          <MetaItem>
            <strong>Political Parties</strong>
            <p>{metadata.parties_present?.join(', ') || 'Not detected'}</p>
          </MetaItem>
          <MetaItem>
            <strong>Last Updated</strong>
            <p>{metadata.timestamp ? formatDate(metadata.timestamp) : 'Unknown'}</p>
          </MetaItem>
        </MetaGrid>
        {metadata.enhanced && (
          <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#e8f4fd', borderRadius: '4px', fontSize: '0.9rem' }}>
            🔍 <strong>Enhanced Data:</strong> Candidate names and party affiliations added using donor mapping patterns.
          </div>
        )}
      </Metadata>

      <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Top Campaign Contributions</h3>
      
      <DataTable>
        <thead>
          <tr>
            <th>Contributor</th>
            <th>Candidate/Committee</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Location</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {contributions.map((item) => (
            <tr key={item.id}>
              <ContributorCell>
                {item.contributor}
                {item.party && item.party !== 'Unknown' && (
                  <PartyBadge party={item.party}>{item.party}</PartyBadge>
                )}
              </ContributorCell>
              <td>
                {item.candidate}
                {item.committee && item.committee !== 'Unknown Committee' && (
                  <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginTop: '2px' }}>
                    {item.committee}
                  </div>
                )}
              </td>
              <AmountCell amount={item.amount}>
                {formatCurrency(item.amount)}
              </AmountCell>
              <td>{formatDate(item.date)}</td>
              <td>{item.location}</td>
              <td>{item.type}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem' }}>
        <strong>Analysis Insight:</strong> This data shows individual contributions over $100,000 to political committees. 
        The patterns reveal concentration of political influence among major donors and partisan alignment of large contributions.
      </div>
    </Container>
  );
};

export default TriangulationPreview;