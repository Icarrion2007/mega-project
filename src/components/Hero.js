import React from "react"
import styled from "styled-components"

const HeroSection = styled.section`
  position: relative;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  overflow: hidden;
  background: linear-gradient(rgba(10, 29, 63, 0.9), rgba(10, 29, 63, 0.95)),
              url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80');
  background-size: cover;
  background-position: center;
  border-bottom: 3px solid #00E5FF;
`

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
  line-height: 1.1;
  
  span {
    color: #00E5FF;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

const Subtitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 400;
  color: #cccccc;
  margin-bottom: 2rem;
  max-width: 800px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`

const CTAGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`

const PrimaryButton = styled.button`
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0A1D3F;
  background: #00E5FF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 229, 255, 0.4);
  
  &:hover {
    background: #ffffff;
    box-shadow: 0 6px 20px rgba(0, 229, 255, 0.6);
    transform: translateY(-3px);
  }
`

const SecondaryButton = styled.button`
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  background: transparent;
  border: 2px solid #00E5FF;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 229, 255, 0.1);
    transform: translateY(-3px);
  }
`

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: #00E5FF;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  &:after {
    content: '↓';
    font-size: 1.5rem;
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-10px);}
    60% {transform: translateY(-5px);}
  }
`

const Hero = () => {
  const handleExploreData = () => {
    document.getElementById('global-roadmap')?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleLearnMore = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <HeroSection>
      <Title>Make Every Government <span>Accountable</span></Title>
      <Subtitle>
        An open-source platform tracking money, rhetoric, and outcomes across governments. 
        Starting with US campaign finance transparency. Built for journalists, researchers, and citizens.
      </Subtitle>
      
      <CTAGrid>
        <PrimaryButton onClick={handleExploreData}>
          Explore US Campaign Data
        </PrimaryButton>
        <SecondaryButton onClick={handleLearnMore}>
          How It Works
        </SecondaryButton>
      </CTAGrid>
      
      <ScrollIndicator>Explore the data</ScrollIndicator>
    </HeroSection>
  )
}

export default Hero