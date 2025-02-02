/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { IronfishCommand } from '../../command'
import { ColorFlag, ColorFlagKey, RemoteFlags } from '../../flags'
import jsonColorizer from 'json-colorizer'
import fs from 'fs'

export class ExportCommand extends IronfishCommand {
  static description = `Export an account`

  static flags = {
    ...RemoteFlags,
    [ColorFlagKey]: ColorFlag,
  }

  static args = [
    {
      name: 'account',
      parse: (input: string): string => input.trim(),
      required: true,
      description: 'name of the account to export',
    },
    {
      name: 'path',
      parse: (input: string): string => input.trim(),
      required: false,
      description: 'a path to export the account to',
    },
  ]

  async start(): Promise<void> {
    const { flags, args } = this.parse(ExportCommand)
    const account = args.account as string
    const exportPath = args.path as string | undefined

    await this.sdk.client.connect()

    const response = await this.sdk.client.exportAccount({ account: account })

    let output = JSON.stringify(response.content.account, undefined, '   ')

    if (exportPath) {
      const resolved = this.sdk.fileSystem.resolve(exportPath)
      fs.writeFileSync(resolved, output)
      this.log(`Exported account ${account} to the file ${exportPath}`)
      return
    }

    if (flags.color) output = jsonColorizer(output)
    this.log(output)
  }
}
