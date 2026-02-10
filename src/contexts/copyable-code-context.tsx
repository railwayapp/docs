import * as React from "react";

interface CopyableCodeContextValue {
  claimId: () => number;
  set: (id: number, markdown: string) => void;
  remove: (id: number) => void;
  getCopyableMarkdown: (rawMarkdown: string) => string;
}

const CopyableCodeContext = React.createContext<CopyableCodeContextValue | null>(
  null,
);

export const useCopyableCode = () => React.useContext(CopyableCodeContext);

export function CopyableCodeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const blocksRef = React.useRef(new Map<number, string>());
  const counterRef = React.useRef(0);

  const claimId = React.useCallback(() => counterRef.current++, []);

  const set = React.useCallback((id: number, markdown: string) => {
    blocksRef.current.set(id, markdown);
  }, []);

  const remove = React.useCallback((id: number) => {
    blocksRef.current.delete(id);
  }, []);

  const getCopyableMarkdown = React.useCallback((rawMarkdown: string) => {
    const sortedBlocks = Array.from(blocksRef.current.entries())
      .sort(([a], [b]) => a - b)
      .map(([, md]) => md);

    let i = 0;
    return rawMarkdown.replace(/<GraphQLCodeTabs[\s\S]*?\/>/g, () => {
      return sortedBlocks[i++] ?? "";
    });
  }, []);

  const value = React.useMemo(
    () => ({ claimId, set, remove, getCopyableMarkdown }),
    [claimId, set, remove, getCopyableMarkdown],
  );

  return (
    <CopyableCodeContext.Provider value={value}>
      {children}
    </CopyableCodeContext.Provider>
  );
}
