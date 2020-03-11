/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IQuickPickSeparator } from 'vs/platform/quickinput/common/quickInput';
import { PickerQuickAccessProvider, IPickerQuickAccessItem } from 'vs/platform/quickinput/common/quickAccess';
import { distinct } from 'vs/base/common/arrays';
import { CancellationToken } from 'vs/base/common/cancellation';

export interface ICommandQuickPick extends IPickerQuickAccessItem {
	commandId: string;
}

export abstract class AbstractCommandsQuickAccessProvider extends PickerQuickAccessProvider<ICommandQuickPick> {

	static PREFIX = '>';

	constructor() {
		super(AbstractCommandsQuickAccessProvider.PREFIX);
	}

	protected async getPicks(filter: string, token: CancellationToken): Promise<Array<ICommandQuickPick | IQuickPickSeparator>> {

		// Remove duplicates
		const distinctCommandPicks = distinct(await this.getCommandPicks(filter, token), pick => `${pick.label}${pick.commandId}`);

		// Add description to commands that have duplicate labels
		const mapLabelToCommand = new Map<string, ICommandQuickPick>();
		for (const commandPick of distinctCommandPicks) {
			const existingCommandForLabel = mapLabelToCommand.get(commandPick.label);
			if (existingCommandForLabel) {
				commandPick.description = commandPick.commandId;
				existingCommandForLabel.description = existingCommandForLabel.commandId;
			} else {
				mapLabelToCommand.set(commandPick.label, commandPick);
			}
		}

		return distinctCommandPicks;
	}

	protected abstract getCommandPicks(filter: string, token: CancellationToken): Promise<Array<ICommandQuickPick>>;
}

