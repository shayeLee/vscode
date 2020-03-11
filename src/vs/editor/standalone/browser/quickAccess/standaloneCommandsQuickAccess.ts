/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from 'vs/platform/registry/common/platform';
import { IQuickAccessRegistry, Extensions } from 'vs/platform/quickinput/common/quickAccess';
import { QuickCommandNLS } from 'vs/editor/common/standaloneStrings';
import { AbstractCommandsQuickAccessProvider } from 'vs/platform/quickinput/browser/commandsQuickAccess';

export class StandaloneCommandsQuickAccessProvider extends AbstractCommandsQuickAccessProvider {

}

Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess).registerQuickAccessProvider({
	ctor: StandaloneCommandsQuickAccessProvider,
	prefix: AbstractCommandsQuickAccessProvider.PREFIX,
	helpEntries: [{ description: QuickCommandNLS.quickCommandHelp, needsEditor: true }]
});
