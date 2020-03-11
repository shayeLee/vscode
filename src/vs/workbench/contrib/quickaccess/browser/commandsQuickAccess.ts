/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AbstractCommandsQuickAccessProvider, ICommandQuickPick } from 'vs/platform/quickinput/browser/commandsQuickAccess';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IQuickPickSeparator } from 'vs/platform/quickinput/common/quickInput';
import { IEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IMenuService } from 'vs/platform/actions/common/actions';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IExtensionService } from 'vs/workbench/services/extensions/common/extensions';
import { CancellationToken } from 'vs/base/common/cancellation';
import { timeout } from 'vs/base/common/async';

export class CommandsQuickAccessProvider extends AbstractCommandsQuickAccessProvider {

	private waitedForExtensionsRegistered: boolean | undefined;

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IMenuService private readonly menuService: IMenuService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IExtensionService private readonly extensionService: IExtensionService
	) {
		super();

		this.awaitInstalledExtensionsRegistered();
	}

	private async awaitInstalledExtensionsRegistered(): Promise<void> {
		try {
			await this.extensionService.whenInstalledExtensionsRegistered();
		} finally {
			this.waitedForExtensionsRegistered = true;
		}
	}

	protected async getPicks(filter: string, token: CancellationToken): Promise<Array<ICommandQuickPick | IQuickPickSeparator>> {
		if (this.waitedForExtensionsRegistered) {
			return this.doGetPicks(filter, token);
		}

		// If extensions are not yet registered, we wait for a little moment to give them
		// a chance to register so that the complete set of commands shows up as result
		// We do not want to delay functionality beyond that time though to keep the commands
		// functional.
		await Promise.race([timeout(800).then(), this.extensionService.whenInstalledExtensionsRegistered()]);
		this.waitedForExtensionsRegistered = true;

		return this.doGetPicks(filter, token);
	}

	protected doGetPicks(filter: string, token: CancellationToken): Array<ICommandQuickPick | IQuickPickSeparator> {
		if (token.isCancellationRequested) {
			return [];
		}

		return [];
	}
}
