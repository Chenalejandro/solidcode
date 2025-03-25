import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
// FIXME: https://github.com/microsoft/monaco-editor/issues/2874
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { cn } from "@/lib/utils";

export type Language = "javascript" | "typescript" | "php" | "python" | "cpp";

export default function Editor(props: {
  initialValue: string;
  language: Language;
  onChange: (value: string, event: editor.IModelContentChangedEvent) => void;
  theme: "vs" | "vs-dark" | "hc-black" | "hc-light";
  setMonacoEditorMounted: Dispatch<SetStateAction<boolean>>;
  className?: string;
}) {
  const {
    initialValue,
    language,
    onChange,
    theme,
    setMonacoEditorMounted,
    className,
  } = props;
  const editorRef = useRef<HTMLDivElement>(null);

  const [monacoEditor, setMonacoEditor] =
    useState<editor.IStandaloneCodeEditor>();

  useEffect(() => {
    if (!editorRef.current) {
      throw new Error("the ref.current is null");
    }
    console.log("mounting editor");
    const model = editor.createModel(initialValue, language);
    const codeEditor = editor.create(editorRef.current, {
      model,
      smoothScrolling: true,
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
      scrollBeyondLastLine: false,
    });
    setMonacoEditor(codeEditor);
    setMonacoEditorMounted(true);
    return () => {
      setMonacoEditorMounted(false);
      codeEditor.dispose();
      model.dispose();
    };
  }, [language, initialValue, setMonacoEditorMounted]);

  useEffect(() => {
    if (monacoEditor && onChange) {
      const disposable = monacoEditor.onDidChangeModelContent((event) => {
        onChange(monacoEditor.getValue(), event);
      });
      return () => {
        disposable.dispose();
      };
    }
  }, [monacoEditor, onChange]);

  useEffect(() => {
    editor.setTheme(theme);
  }, [theme]);

  return (
    <section className={cn({ hidden: !monacoEditor }, className)}>
      <div ref={editorRef} className={"min-h-0 w-full grow"} />
    </section>
  );
}
