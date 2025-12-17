import React from 'react';
import styled from 'styled-components';

const PrinciplesContainer = styled.section`
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #0A1D3F 0%, #152642 100%);
  text-align: center;
`;

const PrincipleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 2rem auto;
`;

const PrincipleCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #00E5FF;
    box-shadow: 0 10px 25px rgba(0, 229, 255, 0.15);
  }
`;

const PrincipleIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const PrincipleTitle = styled.h3`
  color: #00E5FF;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

const PrincipleText = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin: 0;
`;

const Principles = () => {
  const principles = [
    {
      icon: '☀️',
      title: 'Sunlight Disinfects',
      text: 'Transparency is non-negotiable. Hidden power corrupts; visible power can be held accountable.'
    },
    {
      icon: '🌍',
      title: 'Thriving Earth Goal',
      text: 'All accountability serves one purpose: a healthy, sustainable planet for all life.'
    },
    {
      icon: '⚖️',
      title: 'Non-Partisan Integrity',
      text: 'We track systems, not parties. Corruption wears many masks; our lens detects the pattern.'
    }
  ];

  return (
    <PrinciplesContainer>
      <h2 style={{ color: '#ffffff', fontSize: '2rem', marginBottom: '1rem' }}>
        Core Principles
      </h2>
      <p style={{ color: '#cccccc', maxWidth: '800px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
        These are not slogans. They are the operational axioms of the Triangulation Engine.
      </p>
      
      <PrincipleGrid>
        {principles.map((principle, index) => (
          <PrincipleCard key={index}>
            <PrincipleIcon>{principle.icon}</PrincipleIcon>
            <PrincipleTitle>{principle.title}</PrincipleTitle>
            <PrincipleText>{principle.text}</PrincipleText>
          </PrincipleCard>
        ))}
      </PrincipleGrid>
      
      <div style={{ 
        marginTop: '2rem', 
        paddingTop: '1.5rem', 
        borderTop: '1px solid rgba(0, 229, 255, 0.2)',
        color: '#aaa',
        fontStyle: 'italic',
        fontSize: '0.95rem'
      }}>
        "Accountability is not an end in itself. It is the first, non‑negotiable step toward a positive future."
      </div>
    </PrinciplesContainer>
  );
};

export default Principles;