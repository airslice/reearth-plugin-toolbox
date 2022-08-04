import styled from "@emotion/styled";

export type Props = {
  title?: string;
  children?: React.ReactNode;
};

const Group: React.FC<Props> = ({ title, children }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #141414;
  border: 1px solid #262626;
  border-radius: 4px;
  overflow: hidden;
`;

const Title = styled.div`
  display: inline-block;
  padding: 2px 8px;
  height: 25px;
  background: #262626;
  border-radius: 4px 0px;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: #bfbfbf;
`;

const Content = styled.div`
  margin-top: 8px;
  padding: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export default Group;
