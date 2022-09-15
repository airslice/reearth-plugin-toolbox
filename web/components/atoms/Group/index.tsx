import styled from "@emotion/styled";

export type Props = {
  title?: string;
  children?: React.ReactNode;
  noBorder?: boolean;
};

const Group: React.FC<Props> = ({ title, children, noBorder = false }) => {
  return (
    <Wrapper noBorder={noBorder}>
      {title && <Title>{title}</Title>}
      <Content noBorder={noBorder}>{children}</Content>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ noBorder: boolean }>`
  border: ${(props) =>
    props.noBorder ? "none" : `1px solid  ${props.theme.colors.weakest}`};
  border-radius: 4px;
  overflow: hidden;
`;

const Title = styled.div`
  display: inline-block;
  padding: 2px 8px;
  height: 25px;
  border-radius: 4px 0px;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: ${(props) => props.theme.colors.main};
`;

const Content = styled.div<{ noBorder: boolean }>`
  padding: ${({ noBorder }) => (noBorder ? "0" : "8px")};
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export default Group;
