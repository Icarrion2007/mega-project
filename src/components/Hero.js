import React from "react"
import styled from "styled-components"

const HeroSection = styled.section`
  position: relative;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  overflow: hidden;
  background: linear-gradient(rgba(10, 29, 63, 0.85), rgba(10, 29, 63, 0.95)),
              url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80');
  background-size: cover;
  background-position: center;
`

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`

const Subtitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #00E5FF;
  margin-bottom: 1.5rem;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`

const Tagline = styled.p`
  font-size: 1.2rem;
  color: #cccccc;
  max-width: 700px;
  margin-bottom: 3rem;
  line-height: 1.6;
`

const CTAButton = styled.button`
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0A1D3F;
  background: #00E5FF;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
  &:hover {
    background: #ffffff;
    box-shadow: 0 0 30px rgba(0, 229, 255, 0.8);
    transform: translateY(-3px);
  }
`

const Hero = () => {
  const handleCTAClick = () => {
    alert("Triangulation Engine will launch here in the next build phase.");
  }

  return (
    <HeroSection>
      <Title>M.E.G.A.</Title>
      <Subtitle>Make Every Government Accountable. Make Earth Great Again.</Subtitle>
      <Tagline>Sunlight is the best disinfectant. A thriving Earth is the only goal.</Tagline>
      <CTAButton onClick={handleCTAClick}>BEGIN TRIANGULATION</CTAButton>
    </HeroSection>
  )
}

export default Hero