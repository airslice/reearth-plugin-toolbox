import styled from "@emotion/styled";
import Button from "@web/components/atoms/Button";
import Group from "@web/components/atoms/Group";
import Line from "@web/components/atoms/Line";
import Table from "@web/components/atoms/Table";

type Props = {
  headers?: string[];
  items?: { [key: string]: string }[];
};
const InfoCard: React.FC<Props> = ({ headers, items }) => {
  return (
    <CardWrapper>
      <Table
        headers={headers}
        items={items}
        tableAlignment={"Vertical"}
        textSize={12}
      />
      <GroupWrapper noBorder={true}>
        <Line>
          <Button text="Fly to" buttonStyle="secondary" extendWidth />
          <Button text="Follow" buttonStyle="secondary" extendWidth />
        </Line>
      </GroupWrapper>
    </CardWrapper>
  );
};
export default InfoCard;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 16.34px;
`;
const GroupWrapper = styled(Group)`
  margin-bottom: 12px;
`;
