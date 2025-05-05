import styled from "styled-components";

export const Banner = () => {
    return (
        <Section>
          <h1>Welcome to Our Store!</h1>
          <p style={{color: 'GrayText'}} >Find the best products at unbeatable prices. 😁</p>
        </Section>
      );
}

const Section = styled.section`
    width: 100%;
    padding: 60px 20px;
    text-align: center;
    font-size: 3rem;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    color: crimson;
    font-style: italic;
    word-spacing: 3px;
`