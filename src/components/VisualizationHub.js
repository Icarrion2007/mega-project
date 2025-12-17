import React from 'react';
import styled from 'styled-components';
import ContributionSizeChart from './visualizations/ContributionSizeChart';
import RecipientFlowChart from './visualizations/RecipientFlowChart';
import GeographicMap from './visualizations/GeographicMap';

const HubContainer = styled.section`
  padding: 4rem 2rem;
  background: #ffffff;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 2.2rem;
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

const VisualizationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const VizCard = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const VizHeader = styled.div`
  padding: 1.5rem;
  background: ${props => props.color || '#4a6fa5'};
  color: white;
`;

const VizTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VizDescription = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
  opacity: 0.9;
`;

const VizContent = styled.div`
  padding: 1.5rem;
`;

const InsightBox = styled.div`
  background: #f0f7ff;
  border-left: 4px solid #4a6fa5;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  
  h4 {
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #555;
    line-height: 1.6;
    margin: 0;
  }
`;

const VisualizationHub = ({ data }) => {
  return (
    <HubContainer>
      <Container>
        <SectionHeader>
          <SectionTitle>Data Visualizations</SectionTitle>
          <SectionSubtitle>
            Interactive charts revealing patterns in campaign finance data. 
            Hover over elements for details or click to explore further.
          </SectionSubtitle>
        </SectionHeader>
        
        <VisualizationGrid>
          <VizCard>
            <VizHeader color="#2e7d32">
              <VizTitle>
                <span>💰</span> Contribution Size Distribution
              </VizTitle>
              <VizDescription>
                How political money flows by donation size categories
              </VizDescription>
            </VizHeader>
            <VizContent>
              <ContributionSizeChart data={data} />
            </VizContent>
          </VizCard>
          
          <VizCard>
            <VizHeader color="#c62828">
              <VizTitle>
                <span>🏛️</span> Top Recipients
              </VizTitle>
              <VizDescription>
                Where the money flows - committees receiving most contributions
              </VizDescription>
            </VizHeader>
            <VizContent>
              <RecipientFlowChart data={data} />
            </VizContent>
          </VizCard>
          
          <VizCard>
            <VizHeader color="#4a6fa5">
              <VizTitle>
                <span>📍</span> Geographic Flow
              </VizTitle>
              <VizDescription>
                Political contributions by state - geographic concentration
              </VizDescription>
            </VizHeader>
            <VizContent>
              <GeographicMap data={data} />
            </VizContent>
          </VizCard>
        </VisualizationGrid>
        
        <InsightBox>
          <h4>📊 Key Insight: Scale Matters</h4>
          <p>
            The data reveals that a small number of massive contributions (often from Super PACs 
            and political committees) dominate the political finance landscape. 
            The <strong>${(934553461.79/1000000).toFixed(0)}M total</strong> includes contributions averaging 
            <strong> ${(37418213.47/1000000).toFixed(1)}M each</strong>, indicating institutional rather than 
            grassroots funding patterns.
          </p>
        </InsightBox>
      </Container>
    </HubContainer>
  );
};

export default VisualizationHub;