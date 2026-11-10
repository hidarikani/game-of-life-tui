import { type ReactNode, useCallback, useState } from "react";
import { PickPattern } from "../pick/pick/pickPattern.tsx";
import { PlacePattern } from "../place/placePattern.tsx";

export function PatternWizard() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(
    null,
  );

  const handleCancel = useCallback(() => {
    // TODO: implement cancel
  }, []);

  const handleKeyChange = useCallback(
    (key: string, generation: number) => {
      setSelectedKey(key);
      setSelectedGeneration(generation);
    },
    [],
  );

  const isSelectionComplete = selectedKey !== null &&
    selectedGeneration !== null;

  const visibleStep: ReactNode = isSelectionComplete
    ? <PlacePattern />
    : <PickPattern onCancel={handleCancel} onSubmit={handleKeyChange} />;

  return (
    <>
      {visibleStep}
    </>
  );
}
