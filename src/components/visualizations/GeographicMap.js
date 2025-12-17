import React from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const MapTitle = styled.h3`
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #4a6fa5;
  padding-bottom: 0.75rem;
  font-size: 1.3rem;
`;

const MapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StateCard = styled.div`
  padding: 1rem;
  background: ${props => getStateColor(props.amount)};
  border-radius: 8px;
  color: white;
  text-align: center;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`;

const StateName = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const StateAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 900;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
`;

const StateCount = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 0.5rem;
`;

const getStateColor = (amount) => {
  if (amount > 200000000) return '#c62828'; // Red for huge (>$200M)
  if (amount > 100000000) return '#f57c00'; // Orange for large ($100-200M)
  if (amount > 50000000) return '#ffeb3b'; // Yellow for medium ($50-100M)
  if (amount > 10000000) return '#4caf50'; // Green for smaller ($10-50M)
  return '#2196f3'; // Blue for small (<$10M)
};

const formatAmount = (amount) => {
  if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount}`;
};

const GeographicMap = ({ data }) => {
  // Use the actual data from your analysis
  const topStates = [
    { state: 'DC', total: 294000000, count: 7 },
    { state: 'TX', total: 145495178, count: 5 },
    { state: 'FL', total: 135058283.79, count: 2 },
    { state: 'WY', total: 125000000, count: 3 },
    { state: 'NV', total: 75000000, count: 3 },
    { state: 'NY', total: 50000000, count: 1 },
    { state: 'CA', total: 40000000, count: 2 },
    { state: 'IL', total: 25000000, count: 1 },
  ];

  return (
    <MapContainer>
      <MapTitle>📍 Geographic Money Flow</MapTitle>
      <p>Political contributions by state (Top 8 states by total amount)</p>
      
      <MapGrid>
        {topStates.map((stateData, index) => (
          <StateCard 
            key={index} 
            amount={stateData.total}
            title={`${stateData.state}: $${stateData.total.toLocaleString()} (${stateData.count} contributions)`}
          >
            <StateName>{stateData.state}</StateName>
            <StateAmount>{formatAmount(stateData.total)}</StateAmount>
            <StateCount>{stateData.count} contribution{stateData.count !== 1 ? 's' : ''}</StateCount>
          </StateCard>
        ))}
      </MapGrid>
      
      <div style={{ 
        marginTop: '1.5rem', 
        paddingTop: '1rem', 
        borderTop: '1px solid #eee',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        <strong>Analysis:</strong> Contributions are geographically concentrated in 
        political and financial hubs. DC leads with ${(294000000/1000000).toFixed(0)}M, 
        revealing the lobbying-industrial complex.
      </div>
    </MapContainer>
  );
};

export default GeographicMap;