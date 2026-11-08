import { useCallback, useState } from "react";
import { Step1 } from "./Step1/step1.tsx";

export function PatternWizard() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const handleKeyChange = useCallback((newKey: string) => {
    setSelectedKey(newKey);
  }, []);

  return (
    <>
      <Step1 onChange={handleKeyChange} />
    </>
  );
}
