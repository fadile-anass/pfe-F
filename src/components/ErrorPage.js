import React from 'react';
import styled from 'styled-components';

const ErrorPage = () => {
    return (
        <Container>
            <Content>
                <Heading>Oups, quelque chose s'est mal passé</Heading>
                <Text>
                    Nous nous excusons pour la gêne occasionnée. Notre site web rencontre actuellement des difficultés techniques. Veuillez revenir plus tard.
                </Text>
            </Content>
        </Container>
    );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: "Josefin Sans", sans-serif;
  color: white;
  background-image: url('https://images.pexels.com/photos/593158/pexels-photo-593158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'); /* Image de fond */
  background-size: cover;
  background-position: center;
`;

const Content = styled.div`
  max-width: 800px;
  padding: 20px;
  text-align: center;
`;

const Heading = styled.h1`
  margin-bottom: 40px;
  font-size: 32px;
  font-weight: bold;
  color: rgb(77, 9, 9); /* Rouge foncé */
`;

const Text = styled.p`
  font-size: 18px;
  line-height: 1.5;
`;

export default ErrorPage;
