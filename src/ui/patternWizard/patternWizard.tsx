import { type ReactNode, useCallback, useState } from "react";
import { PickPattern } from "./pick/pickPattern.tsx";
import { PlacePattern } from "./place/placePattern.tsx";

export function PatternWizard() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const handleKeyChange = useCallback((newKey: string) => {
    setSelectedKey(newKey);
  }, []);

  const visibleStep: ReactNode = selectedKey === null
    ? <PickPattern onChange={handleKeyChange} />
    : <PlacePattern />;

  return (
    <>
      {visibleStep}
    </>
  );
}
