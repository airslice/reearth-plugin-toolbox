import styled from "@emotion/styled";

const StyledLoading = styled.div`
  display: inline-block;
  position: relative;
  width: 16px;
  height: 16px;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 12px;
    height: 12px;
    margin: 2px;
    border: 2px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  div:nth-child(1) {
    animation-delay: -0.45s;
  }
  div:nth-child(2) {
    animation-delay: -0.3s;
  }
  div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Loading: React.FC = () => {
  return (
    <StyledLoading>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </StyledLoading>
  );
};

export default Loading;
