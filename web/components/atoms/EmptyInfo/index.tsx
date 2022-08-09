import styled from "@emotion/styled";

export type Props = {
  text?: string;
  children?: React.ReactNode;
};

const EmptyInfo: React.FC<Props> = ({ text, children }) => {
  return (
    <Info>
      {text && <div>{text}</div>}
      {children}
    </Info>
  );
};

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  gap: 10px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  color: #4a4a4a;
  user-select: none;
`;

export default EmptyInfo;
