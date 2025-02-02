/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { IronfishCommand } from '../../command'
import { RemoteFlags } from '../../flags'

export class UseCommand extends IronfishCommand {
  static description = 'Change the default account used by all commands'

  static args = [
    {
      name: 'name',
      required: true,
      description: 'name of the account',
    },
  ]

  static flags = {
    ...RemoteFlags,
  }

  async start(): Promise<void> {
    const { args } = this.parse(UseCommand)
    const name = (args.name as string).trim()

    await this.sdk.client.connect()
    await this.sdk.client.useAccount({ name })
    this.log(`The default account is now: ${name}`)
  }
}
