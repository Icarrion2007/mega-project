import React from 'react';
import styled from 'styled-components';

const HowItWorksContainer = styled.section`
  padding: 4rem 2rem;
  background: #0A1D3F;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: #00E5FF;
  font-size: 2.2rem;
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled.p`
  color: #cccccc;
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StepCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #00E5FF;
    box-shadow: 0 10px 25px rgba(0, 229, 255, 0.15);
  }
`;

const StepNumber = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: #00E5FF;
  color: #0A1D3F;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
`;

const StepIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
`;

const StepTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 1.4rem;
`;

const StepDescription = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const StepDetails = styled.ul`
  color: #aaaaaa;
  text-align: left;
  padding-left: 1.2rem;
  margin: 0;
  font-size: 0.9rem;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
`;

const MethodologyNote = styled.div`
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  
  h4 {
    color: #00E5FF;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #cccccc;
    margin: 0;
    line-height: 1.6;
  }
`;

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      icon: '📥',
      title: 'Collect Data',
      description: 'Aggregate official government data from multiple sources',
      details: [
        'Federal Election Commission (FEC) contributions',
        'Congress.gov legislative tracking',
        'Lobbying disclosure databases',
        'State-level transparency portals'
      ]
    },
    {
      number: '2',
      icon: '🔍',
      title: 'Analyze Patterns',
      description: 'Apply the Triangulation Engine to identify systemic patterns',
      details: [
        'Compare money flows against legislative outcomes',
        'Track narrative vs. reality divergence',
        'Identify geographic and temporal patterns',
        'Score transparency and accountability'
      ]
    },
    {
      number: '3',
      icon: '📊',
      title: 'Visualize Insights',
      description: 'Present findings through interactive, accessible visualizations',
      details: [
        'Interactive charts and maps',
        'Exportable data for journalists',
        'API access for researchers',
        'Real-time updates as new data arrives'
      ]
    }
  ];

  return (
    <HowItWorksContainer id="how-it-works">
      <Container>
        <SectionHeader>
          <SectionTitle>How the Triangulation Engine Works</SectionTitle>
          <SectionSubtitle>
            A three-step methodology for tracking accountability across governments. 
            Open-source, verifiable, and designed for public audit.
          </SectionSubtitle>
        </SectionHeader>
        
        <StepsGrid>
          {steps.map((step, index) => (
            <StepCard key={index}>
              <StepNumber>{step.number}</StepNumber>
              <StepIcon>{step.icon}</StepIcon>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
              <StepDetails>
                {step.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </StepDetails>
            </StepCard>
          ))}
        </StepsGrid>
        
        <MethodologyNote>
          <h4>🔬 Methodology Transparency</h4>
          <p>
            All data sources, collection methods, and analysis algorithms are documented and open for review. 
            The project follows academic standards for data validation and maintains clear separation between 
            raw data, analysis, and visualization layers. This ensures findings are reproducible and verifiable.
          </p>
        </MethodologyNote>
      </Container>
    </HowItWorksContainer>
  );
};

export default HowItWorks;