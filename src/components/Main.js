import React from 'react';
import styled from 'styled-components';

import Search from './Search';

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
  height: 100%;
`;

const Title = styled.h1`
  font-weight: 300;
`;

const Subtitle = styled.h3`
  font-weight: 300;
`;

export default class Main extends React.Component {
  render() {
    return (
      <Wrapper>
        <Title>Game of thrones character index</Title>
        <Subtitle>
          Search any character on the books
        </Subtitle>
        <Search />
      </Wrapper>
    );
  }
}
