import styled from "styled-components";

export const AboutUs = () => {
  return (
    <Section>
        <h1>About Us 🙂</h1>
        <p>
            At Our Store, we are passionate about delivering quality products and top-notch customer service.
            Since our founding in 2020, we’ve been committed to helping customers find the right products at the best prices.
        </p>
        <p>
            Whether you’re shopping for rackets, fashion, or shoes and all neccessary thing for badminton life 😁, we aim to make your shopping experience fast,
            easy, and enjoyable.
        </p>
    </Section>
  );
};

const Section = styled.div`
    margin-top: 5vh;
    h1 {
        text-align: center;
        font-size: 2.5rem;
        letter-spacing: 3px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-decoration: underline;
    }

    p {
        margin-top: 1vh;
        font-size: 1.5rem;
        color: gray;
        font-style: italic;
        letter-spacing: 1px;
    }
`
