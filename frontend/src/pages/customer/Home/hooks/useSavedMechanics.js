import { useState } from "react";

/**
 * 🔖 useSavedMechanics Hook
 *
 * Manages user's saved/bookmarked mechanics with toggle functionality.
 * Provides methods to save, unsave, and check saved status of mechanics.
 *
 * @returns {Object} Saved mechanics state and methods
 * @property {Array<number>} savedMechanicIds - Array of saved mechanic IDs
 * @property {Function} toggleSaveMechanic - Toggle save state for a mechanic
 * @property {Function} isMechanicSaved - Check if mechanic is saved
 *
 * @example
 * const { toggleSaveMechanic, isMechanicSaved } = useSavedMechanics();
 * <button onClick={() => toggleSaveMechanic(mechanic.id)}>
 *   {isMechanicSaved(mechanic.id) ? 'Unsave' : 'Save'}
 * </button>
 */
export const useSavedMechanics = () => {
  const [savedMechanicIds, setSavedMechanicIds] = useState([]);

  const toggleSaveMechanic = (mechanicId) => {
    setSavedMechanicIds((prev) => {
      if (prev.includes(mechanicId)) {
        return prev.filter((id) => id !== mechanicId);
      } else {
        return [...prev, mechanicId];
      }
    });
  };

  const isMechanicSaved = (mechanicId) => {
    return savedMechanicIds.includes(mechanicId);
  };

  return {
    savedMechanicIds,
    toggleSaveMechanic,
    isMechanicSaved,
  };
};
