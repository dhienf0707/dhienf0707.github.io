import { codeBlockOptions } from "@blocknote/code-block";
import { createHighlighter } from "@/lib/shiki.bundle";

const extraLanguages = {
  bash: {
    name: "Bash",
    aliases: ["bash"],
  },
  toml: {
    name: "TOML",
    aliases: ["toml"],
  },
  powershell: {
    name: "PowerShell",
    aliases: ["powershell", "ps1", "ps"],
  },
};

export const blogCodeBlockOptions = {
  ...codeBlockOptions,
  supportedLanguages: {
    ...codeBlockOptions.supportedLanguages,
    ...extraLanguages,
    shellscript: {
      ...codeBlockOptions.supportedLanguages.shellscript,
      aliases: ["shellscript", "sh", "shell", "zsh"],
    },
  },
  createHighlighter: () =>
    createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [],
    }),
};
