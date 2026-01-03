import React from "react";
import styled from "styled-components";

const ChartContainer = styled.div`
  background: rgba(0, 229, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(0, 229, 255, 0.2);
  color: #FFFFFF;
  height: 200px;
  overflow-y: auto;
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(0, 229, 255, 0.1);
`;

const BarLabel = styled.div`
  width: 150px;
  font-size: 0.9rem;
  color: #FFFFFF;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BarFill = styled.div`
  flex: 1;
  height: 20px;
  background: rgba(0, 229, 255, 0.1);
  border-radius: 10px;
  margin: 0 1rem;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.percentage}%;
    background: linear-gradient(90deg, #00E5FF, #4CAF50);
    border-radius: 10px;
    transition: width 0.5s ease;
  }
`;

const BarValue = styled.div`
  width: 80px;
  text-align: right;
  font-size: 0.9rem;
  color: #00E5FF;
  font-weight: 600;
`;

const RecipientFlowChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <ChartContainer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#00E5FF' }}>
          <div style={{ fontSize: '2rem' }}>📊</div>
          <div>Loading recipient data...</div>
        </div>
      </ChartContainer>
    );
  }

  // Convert to array and sort
  const dataArray = Object.entries(data)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  const maxAmount = Math.max(...dataArray.map(d => d.amount));

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  return (
    <ChartContainer>
      {dataArray.map((item, index) => (
        <Bar key={index}>
          <BarLabel title={item.name}>
            {item.name || 'Unknown Committee'}
          </BarLabel>
          <BarFill percentage={(item.amount / maxAmount) * 100} />
          <BarValue>
            {formatCurrency(item.amount)}
          </BarValue>
        </Bar>
      ))}
      
      {Object.keys(data).length > 8 && (
        <div style={{ 
          textAlign: 'center', 
          fontSize: '0.8rem', 
          color: '#CCCCCC',
          marginTop: '0.5rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          ... and {Object.keys(data).length - 8} more recipients
        </div>
      )}
    </ChartContainer>
  );
};

export default RecipientFlowChart;