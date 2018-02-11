import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import Fuse from 'fuse.js';

import Loading from '../icons/Loading';
import { search } from '../ducks/characters';

const orange = 'rgb(255, 98, 0)';
const hover = 'rgb(226, 237, 245)';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SearchInput = styled.input`
  line-height: 1.5em;
  font-size: 24px;
  font-family: inherit;
  width: 100%;
  margin: 0;
  padding: 10px;
`;

const InputDiv = styled.div`
  width: 50%;
  margin-right: 30px;
  align-self: center;
  @media (max-width: 880px) {
    width: 90%;
  }
`;

const ErrorDiv = styled.div`
  text-align: left;
  margin-top: 5px;
`;

const ErrorText = styled.span`
  color: ${orange};
`;

const IconDiv = styled.div`
  width: 70px;
`;

const SuggestionWrapper = styled.div`
  border: 1px solid lightgray;
  text-align: left;
  padding: 0;
  margin-top: 0;
`;

const Suggestion = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
  :hover {
    background-color: ${hover};
    cursor: pointer;
  }
`;

class Search extends React.Component {
  _debouceTimer = null;
  _debouceMs = 500;
  _suggestionRef = null;

  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      valid: true,
      showSuggest: false,
    };
  }

  render() {
    const filteredCharacters = this.state.valid
      ? this._fuzzyFindCharacters()
      : [];
    const shouldShowSuggestions =
      this.state.showSuggest && filteredCharacters.length > 0;
    return (
      <Wrapper>
        <InputDiv>
          <SearchInput
            placeholder="Search..."
            value={this.state.searchString}
            onChange={this._onChange}
            onKeyDown={this._onSearchKeyDown}
          />
          {!this.state.valid && (
            <ErrorDiv>
              <ErrorText>Type at least 4 characters</ErrorText>
            </ErrorDiv>
          )}
          {shouldShowSuggestions && (
            <SuggestionWrapper>
              <ul
                ref={r => {
                  this._suggestionRef = r;
                }}
                style={{
                  listStyle: 'none',
                }}
              >
                {filteredCharacters.slice(0, 6).map(name => {
                  return (
                    <li
                      key={'suggestion-' + name}
                      tabindex="0"
                      onClick={() => this._onSuggestSelect(name)}
                      onKeyDown={event => this._onSuggestKeyUp(event, name)}
                    >
                      <Suggestion>
                        <h4>{name}</h4>
                      </Suggestion>
                    </li>
                  );
                })}
              </ul>
            </SuggestionWrapper>
          )}
        </InputDiv>

        <IconDiv>{this.props.loading && <Loading color={orange} />}</IconDiv>
      </Wrapper>
    );
  }

  _validateSearch = text => {
    return text.length > 3;
  };

  _onSuggestKeyUp = (event, name) => {
    if (event.key === 'Enter') {
      this._onSuggestSelect(name)
    } else if (event.key === 'ArrowDown' && event.target.nextSibling) {
      event.target.nextSibling.focus()
    } else if (event.key === 'ArrowUp' && event.target.previousSibling) {
      event.target.previousSibling.focus()
    }
  };

  _onSearchKeyDown = event => {
    if (
      event.key === 'ArrowDown' &&
      this._suggestionRef &&
      this._suggestionRef.firstChild
    ) {
      this._suggestionRef.firstChild.focus();
    }
  };

  _onSuggestSelect = name => {
    this.setState({ searchString: name, showSuggest: false });
  };

  _onChange = event => {
    clearTimeout(this._debouceTimer);
    const searchString = event.target.value;

    const valid = this._validateSearch(searchString);
    if (valid) {
      this._debouceTimer = setTimeout(() => {
        this.props.search(searchString);
      }, this._debouceMs);
    }

    this.setState({ searchString, valid, showSuggest: true });
  };

  _fuzzyFindCharacters = () => {
    const fuse = new Fuse(this.props.characters, {
      keys: ['name'],
      id: 'name',
    });
    return fuse.search(this.state.searchString);
  };
}

function mapStateToProps(state) {
  const { loading, items: characters } = state.characters;
  return {
    loading,
    characters,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      search,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
