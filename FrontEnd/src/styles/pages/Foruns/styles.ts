import styled from 'styled-components'

export const Container = styled.div`
  padding: 2rem;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #1e1e1e;
  padding: 0.5rem 1rem;
  border-radius: 8px;

  input {
    border: none;
    background: transparent;
    color: #fff;
    outline: none;
    margin-right: 0.5rem;
  }
`

export const NewForumButton = styled.button`
  background: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
`

export const ForumList = styled.div`
  display: grid;
  gap: 1rem;
`

export const ForumCard = styled.div`
  background: #2c2c2c;
  padding: 1rem;
  border-radius: 8px;
`

export const ForumMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #aaa;
  margin-top: 0.5rem;
`

export const Loading = styled.div`
  text-align: center;
`

export const Error = styled.div`
  color: red;
  text-align: center;
`

export const NoResults = styled.div`
  text-align: center;
  color: #ccc;
`