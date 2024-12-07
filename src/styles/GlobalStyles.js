import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    background-color: #f9f9f9;
    color: #333;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: bold;
  }

  p {
    margin: 0;
  }

  section {
    padding: 8rem 5rem; /* Vertical and horizontal padding for sections */
  }

  @media (max-width: 768px) {
    section {
      padding: 6rem 2rem; /* Adjust for smaller screens */
    }
  }
`;

export default GlobalStyles;
