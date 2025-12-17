import React from 'react';
import styled from 'styled-components';

const FlowContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const FlowTitle = styled.h3`
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #c62828;
  padding-bottom: 0.75rem;
`;

const RecipientRow = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(4px);
    background: #e9ecef;
  }
`;

const RecipientName = styled.div`
  flex: 2;
  font-weight: bold;
  color: #2c3e50;
`;

const AmountBar = styled.div`
  flex: 3;
  height: 24px;
  background: #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const AmountFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: ${props => props.percentage}%;
  border-radius: 12px;
  transition: width 0.5s ease;
`;

const AmountText = styled.div`
  flex: 1;
  text-align: right;
  font-weight: bold;
  color: #764ba2;
  font-size: 1.1rem;
`;

const RecipientFlowChart = ({ data }) => {
  // Aggregate by recipient
  const recipientMap = {};
  data?.forEach(contrib => {
    const recipient = contrib.recipient || 'Unknown';
    if (!recipientMap[recipient]) {
      recipientMap[recipient] = { total: 0, count: 0 };
    }
    recipientMap[recipient].total += contrib.amount || 0;
    recipientMap[recipient].count++;
  });

  const recipients = Object.entries(recipientMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const maxAmount = recipients.length > 0 ? recipients[0].total : 1;

  return (
    <FlowContainer>
      <FlowTitle>🏛️ Top Recipients by Total Amount</FlowTitle>
      <p>Where the money flows (Top 8 recipients)</p>
      
      {recipients.map((recipient, index) => {
        const percentage = (recipient.total / maxAmount) * 100;
        return (
          <RecipientRow key={index}>
            <RecipientName>
              {recipient.name}
              <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>
                {recipient.count} contribution{recipient.count !== 1 ? 's' : ''}
              </div>
            </RecipientName>
            <AmountBar>
              <AmountFill percentage={percentage} />
            </AmountBar>
            <AmountText>
              ${(recipient.total / 1000000).toFixed(1)}M
            </AmountText>
          </RecipientRow>
        );
      })}
      
      {recipients.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          No recipient data available
        </div>
      )}
    </FlowContainer>
  );
};

export default RecipientFlowChart;