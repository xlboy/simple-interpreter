import vscode from 'vscode';

import { compile } from '../utils';

export function compileCurrentFileCmdHandler() {
  const activedEditor = vscode.window.activeTextEditor;
  const continueCompile: boolean = (() => {
    if (!activedEditor) {
      vscode.window.showErrorMessage('No active editor');

      return false;
    }

    if (activedEditor.document.isUntitled) {
      if (activedEditor.document.languageId === 'TypeZen') {
        return true;
      }

      vscode.window.showErrorMessage('The current file is not a TypeZen language');

      return false;
    }

    if (!activedEditor!.document.fileName.endsWith('.tzen')) {
      vscode.window.showErrorMessage('Current file is not TypeZen file');

      return false;
    }

    return true;
  })();

  if (!continueCompile) return;

  compile(activedEditor!);
}
