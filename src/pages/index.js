import React from "react"
import styled from "styled-components"
import Header from "../components/Header"
import Hero from "../components/Hero"
import TriangulationPreview from "../components/TriangulationPreview"
import Vision from "../components/Vision"
import Footer from "../components/Footer"

const Container = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  color: #f0f0f0;
  background: #0A1D3F;
  min-height: 100vh;
`

const IndexPage = () => {
  return (
    <Container>
      <Header />
      <Hero />
      <TriangulationPreview />
      <Vision />
      <Footer />
    </Container>
  )
}

export default IndexPage