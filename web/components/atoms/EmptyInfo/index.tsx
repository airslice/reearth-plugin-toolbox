import styled from "@emotion/styled";

export type Props = {
  text?: string;
  children?: React.ReactNode;
};

const EmptyInfo: React.FC<Props> = ({ text, children }) => {
  return (
    <Info>
      {text && <>text</>}
      {children && <>children</>}
    </Info>
  );
};

const Info = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 60px;
  padding: 2px 4px;
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
