import { type ReactNode, useCallback, useState } from "react";
import { Step1 } from "./Step1/step1.tsx";
import { Step2 } from "./place/step2.tsx";

export function PatternWizard() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const handleKeyChange = useCallback((newKey: string) => {
    setSelectedKey(newKey);
  }, []);

  const visibleStep: ReactNode = selectedKey === null
    ? <Step1 onChange={handleKeyChange} />
    : <Step2 />;

  return (
    <>
      {visibleStep}
    </>
  );
}
