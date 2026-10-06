import { useEffect, useRef, useState } from "react";
import { loadList, saveList } from "../services/storage";
import { ShoppingList } from "../types/shopping";

export function useShoppingList() {
  const [list, setList] = useState<ShoppingList>({
    budgetInCents: 0,
    items: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const queue = useRef(Promise.resolve());
  const revision = useRef(0);

  async function reload() {
    setLoading(true);
    setLoadError(false);
    try {
      setList(await loadList());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  useEffect(() => {
    if (loading || loadError) return;
    const current = ++revision.current;
    setSaving(true);
    // Serializa as gravações para uma alteração rápida não salvar uma versão antiga.
    queue.current = queue.current
      .then(() => saveList(list))
      .then(() => {
        if (current === revision.current) setSaveError(false);
      })
      .catch(() => {
        if (current === revision.current) setSaveError(true);
      })
      .finally(() => {
        if (current === revision.current) setSaving(false);
      });
  }, [list, loading, loadError]);

  return {
    list,
    setList,
    loading,
    loadError,
    saveError,
    saving,
    reload,
    retrySave: () => setList((previous) => ({ ...previous })),
  };
}
