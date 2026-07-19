"use client";

import { BlockNoteSchema, defaultBlockSpecs, createCodeBlockSpec } from "@blocknote/core";
import { blogCodeBlockOptions } from "@/lib/code-block-options";
import {
  BasicTextStyleButton,
  FormattingToolbar,
  FormattingToolbarController,
  getFormattingToolbarItems,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "./BlogEditor.css";
import { uploadFiles } from "@/lib/uploadthing";

async function uploadFile(file) {
  const result = await uploadFiles("postImage", { files: [file] });
  const uploaded = result?.[0];
  if (!uploaded) {
    throw new Error("Image upload failed");
  }
  return uploaded.ufsUrl || uploaded.url;
}

// 1. Extend the default schema with code block highlighting options
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    // This overwrites the default unhighlighted codeBlock with shiki-powered highlighting
    codeBlock: createCodeBlockSpec(blogCodeBlockOptions),
  },
});

function BlogFormattingToolbar() {
  const items = getFormattingToolbarItems();
  const strikeIndex = items.findIndex((item) => item.key === "strikeStyleButton");

  const withInlineCode = [
    ...items.slice(0, strikeIndex + 1),
    <BasicTextStyleButton basicTextStyle="code" key="codeStyleButton" />,
    ...items.slice(strikeIndex + 1),
  ];

  return <FormattingToolbar>{withInlineCode}</FormattingToolbar>;
}

export default function BlogEditor({
  initialContent,
  editable = true,
  onChange,
}) {
  const editor = useCreateBlockNote({
    initialContent:
      initialContent && initialContent.length > 0 ? initialContent : undefined,
    schema,
    // Image/file paste & drop: uploads via UploadThing and inserts an image block.
    uploadFile: editable ? uploadFile : undefined,
    // Markdown, HTML, plain text, VS Code snippets, and BlockNote HTML are handled
    // by BlockNote's default paste pipeline. This handler opts into rich markdown
    // parsing for plain-text clipboard content (see BlockNote paste-handling docs).
    pasteHandler: editable
      ? ({ defaultPasteHandler }) =>
          defaultPasteHandler({
            prioritizeMarkdownOverHTML: true,
            plainTextAsMarkdown: true,
          })
      : undefined,
  });

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme="light"
      formattingToolbar={false}
      onChange={() => {
        if (onChange) {
          onChange(editor.document);
        }
      }}
    >
      <FormattingToolbarController formattingToolbar={BlogFormattingToolbar} />
    </BlockNoteView>
  );
}
