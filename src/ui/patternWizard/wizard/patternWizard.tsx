import { type ReactNode, useCallback, useMemo, useState } from "react";
import { PickPattern } from "../pick/pick/pickPattern.tsx";
import { PlacePattern } from "../place/place/placePattern.tsx";
import type { IGrid } from "@cell-auto/game-of-life-engine";
import type { Props } from "./types.ts";
import { genErrPatternNotFound } from "../../../constants/messages.ts";
import { usePatternLib } from "../../../context/pattern/pattern.tsx";

export function PatternWizard({ onCancel, onSubmit }: Props) {
  const [key, setKey] = useState<string | null>(null);
  const [generationIndex, setGenerationIndex] = useState<number | null>(
    null,
  );
  const patternLib = usePatternLib();

  const isSelectionComplete = key !== null &&
    generationIndex !== null;

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handlePickSubmit = useCallback(
    (key: string, generation: number) => {
      setKey(key);
      setGenerationIndex(generation);
    },
    [],
  );

  const handlePlaceSubmit = useCallback((grid: IGrid) => {
    onSubmit(grid);
  }, [onSubmit]);

  const patternPlacementFragment = useMemo(() => {
    if (!isSelectionComplete) {
      return null;
    }

    const pattern = patternLib.getPatternByKey(key);
    if (pattern === null) {
      throw new Error(genErrPatternNotFound(key));
    }

    const generation = pattern.generations[generationIndex];

    return (
      <PlacePattern
        inner={generation}
        onCancel={handleCancel}
        onSubmit={handlePlaceSubmit}
      />
    );
  }, [key, generationIndex, patternLib, handleCancel, handlePlaceSubmit]);

  const visibleStep: ReactNode = isSelectionComplete
    ? patternPlacementFragment
    : <PickPattern onCancel={handleCancel} onSubmit={handlePickSubmit} />;

  return (
    <>
      {visibleStep}
    </>
  );
}
