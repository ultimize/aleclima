"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase/browser";

/** Carica un file nel bucket "blog" e ritorna l'URL pubblico. */
export async function uploadImmagine(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const nome = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from("blog").upload(nome, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("blog").getPublicUrl(nome);
  return data.publicUrl;
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const setLink = useCallback(() => {
    const precedente = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Indirizzo del link", precedente ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImmagine(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      window.alert(`Caricamento non riuscito: ${(err as Error).message}`);
    } finally {
      e.target.value = "";
    }
  };

  const B = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button type="button" title={title} onClick={onClick} className={active ? "active" : ""}>
      {children}
    </button>
  );

  return (
    <div className="editor-toolbar">
      <B title="Grassetto" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
        <strong>B</strong>
      </B>
      <B title="Corsivo" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
        <em>I</em>
      </B>
      <B title="Titolo di sezione" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
        H2
      </B>
      <B title="Sottotitolo" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
        H3
      </B>
      <B title="Elenco puntato" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
        • Lista
      </B>
      <B title="Elenco numerato" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
        1. Lista
      </B>
      <B title="Citazione" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
        &ldquo; &rdquo;
      </B>
      <B title="Inserisci link" onClick={setLink} active={editor.isActive("link")}>
        Link
      </B>
      <B title="Inserisci immagine" onClick={() => fileRef.current?.click()}>
        Immagine
      </B>
      <B title="Annulla" onClick={() => editor.chain().focus().undo().run()}>
        ↶
      </B>
      <B title="Ripeti" onClick={() => editor.chain().focus().redo().run()}>
        ↷
      </B>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        onChange={onFile}
      />
    </div>
  );
}

export function RichEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    // in Next il primo render e' lato server: TipTap deve montare nel browser
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return <div className="editor-shell">Caricamento editor…</div>;
  }

  return (
    <div>
      <Toolbar editor={editor} />
      <div className="editor-shell">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
