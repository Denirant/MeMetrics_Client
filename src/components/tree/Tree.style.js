import styled from "styled-components";

export const INDENT = 10;

export const StyledTree = styled.div`
  line-height: 1.75;
  z-index: 1;

  .tree__input {
    width: auto;
  }
`;
export const StyledFile = styled.div`
  flex-wrap: nowrap;
  display: flex;
  align-items: center;
  font-weight: normal;
  margin-left: ${INDENT}px;
`;
export const StyledFolder = styled.div`
  margin-left: 20px;

  position: relative;

  overflow: visible;

  .tree__file {
    margin-left: ${INDENT * 2}px;
  }
`;

export const ActionsWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;

  overflow: hidden;

  .actions {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: space-between;
    opacity: 0;
    pointer-events: none;
    transition: 0.2s;

    > svg {
      cursor: pointer;
      margin-left: 10px;
      transform: scale(1);
      transition: 0.2s;

      :hover {
        transform: scale(1.1);
      }
    }
  }

  &:hover .actions {
    opacity: 1;
    pointer-events: all;
    transition: 0.2s;
  }
`;

export const StyledName = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  cursor: pointer;

  width: 100%;
  overflow: hidden;
`;

export const Collapse = styled.div`
  height: max-content;
  max-height: ${p => (p.isOpen ? "fit-content" : "0px")};
  overflow: hidden;
  transition: 0.3s ease-in-out;
`;

export const VerticalLine = styled.section`
  position: relative;
  
`;
