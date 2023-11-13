import styled from "@emotion/styled";
import Icon from "@web/components/atoms/Icon";
import { ReactComponent as SubmitSuccessImg } from "@web/components/atoms/Icon/Icons/submitSuccess.svg";
import { postMsg } from "@web/utils/common";
import { useCallback, useEffect, useMemo, useState } from "react";
import { actHandles } from "src/type";

export type ModalSettings = {
  tacLink: string | undefined;
  uuid: string | undefined;
  cmsURL: string | undefined;
  cmsAPIKey: string | undefined;
  primaryColor: string | undefined;
};

const App: React.FC = () => {
  const [cmsURL, setCmsURL] = useState("");
  const [cmsAPIKey, setCmsAPIKey] = useState("");

  const [uuid, setUuid] = useState<string | undefined>();
  const [checked, setChecked] = useState(false);
  const [tacLink, setTACLink] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const [submitSucceeded, setSubmitSucceeded] = useState(false);

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress(e.target.value);
    },
    []
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    []
  );

  const handleCommentContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCommentContent(e.target.value);
    },
    []
  );

  const toggleChecked = useCallback(() => {
    setChecked(!checked);
  }, [checked]);

  const closeFormModal = useCallback(() => {
    postMsg("closeFormModal");
  }, []);

  const setSettings = useCallback((settings: ModalSettings) => {
    setCmsURL(settings.cmsURL ?? "");
    setCmsAPIKey(settings.cmsAPIKey ?? "");
    setTACLink(settings.tacLink ?? "");
    setUuid(settings.uuid ?? "");

    document.documentElement.style.setProperty(
      "--primary-color",
      settings.primaryColor ?? "#00BEBE"
    );
  }, []);

  const actHandles: actHandles = useMemo(() => {
    return {
      setSettings,
    };
  }, [setSettings]);

  useEffect(() => {
    const msgListener = (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    };
    (globalThis as any).addEventListener("message", msgListener);

    return () => {
      (globalThis as any).removeEventListener("message", msgListener);
    };
  }, [actHandles]);

  useEffect(() => {
    postMsg("updateSettingsForModal");
  }, []);

  const canSubmit = useMemo(() => {
    return uuid && address && name && commentContent && checked;
  }, [uuid, address, name, commentContent, checked]);

  const handleSubmit = useCallback(() => {
    // TODO: submit
    console.log(uuid, address, name, commentContent);
    setSubmitSucceeded(true);
  }, [uuid, address, name, commentContent]);

  return (
    <Form>
      <FormHeader>
        <FormTitle>{submitSucceeded ? "" : "Comment"}</FormTitle>
        <CloseButton onClick={closeFormModal}>
          <Icon icon="cancel" size={16} />
        </CloseButton>
      </FormHeader>
      <FormBody>
        {submitSucceeded ? (
          <SuccessWrapper>
            <StyledSubmitSuccessImg />
            <SuccessText>
              あなたのコメントは送信され、後ほどコメントリストに表示されます！
            </SuccessText>
          </SuccessWrapper>
        ) : (
          <>
            <FormItem>
              <FormItemLabel>おところ</FormItemLabel>
              <FormItemInput onChange={handleAddressChange} />
              <FormItemTip>
                ※必須：県と市、あるいは国と都市名の形で入力してください。
              </FormItemTip>
            </FormItem>
            <FormItem>
              <FormItemLabel>お名前</FormItemLabel>
              <FormItemInput onChange={handleNameChange} />
              <FormItemTip>
                ※必須：県と市、あるいは国と都市名の形で入力してください。
              </FormItemTip>
            </FormItem>
            <FormItem>
              <FormItemLabel>コメント</FormItemLabel>
              <FormItemTextarea onChange={handleCommentContentChange} />
              <FormItemTip>
                ※必須：県と市、あるいは国と都市名の形で入力してください。
              </FormItemTip>
            </FormItem>
            <TAC>
              <CheckButton onClick={toggleChecked}>
                {checked ? (
                  <Icon icon="checkboxChecked" size={16} />
                ) : (
                  <Icon icon="checkboxEmpty" size={16} />
                )}
              </CheckButton>
              <div>
                <CheckLink target="_blank" href={tacLink}>
                  個人情報の規約
                </CheckLink>
                <CheckText>を読み、同意します。</CheckText>
              </div>
            </TAC>
          </>
        )}
      </FormBody>
      {!submitSucceeded && (
        <FormFooter>
          <FormButton onClick={closeFormModal} secondary>
            キャンセル
          </FormButton>
          <FormButton disabled={!canSubmit} onClick={handleSubmit}>
            送る
          </FormButton>
        </FormFooter>
      )}
    </Form>
  );
};

const Form = styled.div`
  width: 572px;
  height: 546px;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: "Noto Sans", "hiragino sans", "hiragino kaku gothic proN",
    -apple-system, BlinkMacSystem, sans-serif;
  font-size: 12px;
  color: #262626;

  &,
  * {
    box-sizing: border-box;
  }
`;

const FormHeader = styled.div`
  display: flex;
  flex: 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  color: #2c2c2c;
  border-bottom: 1px solid #f4f4f4;
`;

const FormTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
`;

const CloseButton = styled.div`
  cursor: pointer;
`;

const FormBody = styled.div`
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormFooter = styled.div`
  flex: 0;
  padding: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #f4f4f4;
`;

const FormButton = styled.div<{ secondary?: boolean; disabled?: boolean }>`
  display: flex;
  height: 38px;
  min-width: 76px;
  padding: 4px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${({ secondary, disabled }) =>
    disabled ? "#C6C6C6" : secondary ? "none" : "var(--primary-color)"};
  border-radius: 6px;
  color: ${({ secondary }) => (secondary ? "#2C2C2C" : "#fff")};
  border: 1px solid
    ${({ secondary, disabled }) =>
      disabled ? "#C6C6C6" : secondary ? "#A8A8A8" : "var(--primary-color)"};
  transition: all 0.2s ease-in-out;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};

  &:hover {
    box-shadow: 0 0 4px 4px
      ${({ disabled }) => (disabled ? "rgba(0,0,0,0)" : "#ededed")};
  }
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormItemLabel = styled.div`
  font-size: 12px;
  font-weight: 400;
`;

const FormItemInput = styled.input`
  display: block;
  width: 100%;
  outline: none;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  padding: 4px 8px;
  line-height: 20px;
`;

const FormItemTextarea = styled.textarea`
  display: block;
  width: 100%;
  outline: none;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  padding: 4px 8px;
  line-height: 20px;
  height: 100px;
  resize: none;
`;

const FormItemTip = styled.div`
  font-size: 10px;
  font-weight: 400;
  color: #6f6f6f;
  line-height: 1.4;
`;

const TAC = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const CheckButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--primary-color);
`;

const CheckLink = styled.a`
  color: var(--primary-color);
  text-decoration: none;
`;

const CheckText = styled.span`
  color: #6f6f6f;
`;

const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 20px;
`;

const StyledSubmitSuccessImg = styled(SubmitSuccessImg)`
  width: 298px;
`;

const SuccessText = styled.div`
  text-align: center;
`;

export default App;
