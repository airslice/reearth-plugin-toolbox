import styled from "@emotion/styled";

type PaperProps = {
  children?: React.ReactNode;
};

export const Paper: React.FC<PaperProps> = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colors.background};
  color: #c7c5c5;
  border-radius: 4px;
  overflow: hidden;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
