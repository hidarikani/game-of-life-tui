import { type ReactNode, useCallback, useState } from "react";
import { PickPattern } from "../pick/pick/pickPattern.tsx";
import { PlacePattern } from "../place/place/placePattern.tsx";
import { Grid, type IGrid } from "@cell-auto/game-of-life-engine";
import { useAppSelector } from "../../../store/hooks.ts";
import { selectGridSize } from "../../../store/terminalSlice.ts";

export function PatternWizard() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(
    null,
  );
  const gridSize = useAppSelector(selectGridSize);
  const [grid, setGrid] = useState<IGrid>(new Grid({ gridSize }));

  const handleCancel = useCallback(() => {
    // TODO: implement cancel
  }, []);

  const handlePickContinue = useCallback(
    (key: string, generation: number) => {
      setSelectedKey(key);
      setSelectedGeneration(generation);
    },
    [],
  );

  const handlePlaceContinue = useCallback((grid: IGrid) => {
    setGrid(grid);
  }, []);

  const handleFinish = useCallback((grid: IGrid) => {
    setGrid(grid);
  }, []);

  const isSelectionComplete = selectedKey !== null &&
    selectedGeneration !== null;

  const visibleStep: ReactNode = isSelectionComplete
    ? (
      <PlacePattern
        patternKey={selectedKey}
        patternGeneration={selectedGeneration}
        grid={grid}
        onCancel={handleCancel}
        onSubmit={handlePlaceContinue}
        onFinish={handleFinish}
      />
    )
    : <PickPattern onCancel={handleCancel} onSubmit={handlePickContinue} />;

  return (
    <>
      {visibleStep}
    </>
  );
}
