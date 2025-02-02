/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { RollingAverage } from './rollingAverage'

/**
 * A metric type useful for recording metered things like
 *  * blocks per second
 *  * bytes per second
 *
 * This metric will take a sample of how many units were
 * completd each tick cycle and record that in various
 * rolling averages.
 *
 * @TODO: Move RollingAverages to exponentially-weighted moving average (EWMA)
 * */
export class Meter {
  private _started = false
  private _rate5s: RollingAverage
  private _rate1m: RollingAverage
  private _rate5m: RollingAverage
  private _count = 0
  private _totalCount = 0
  private _sum = 0
  private _interval: NodeJS.Timeout | null = null
  private _intervalMs: number
  private _intervalLastMs: number | null = null

  constructor() {
    this._intervalMs = 1000
    this._rate5s = new RollingAverage(5000 / this._intervalMs)
    this._rate1m = new RollingAverage((1 * 60 * 1000) / this._intervalMs)
    this._rate5m = new RollingAverage((5 * 60 * 1000) / this._intervalMs)
  }

  get rate5s(): number {
    return this._rate5s.average
  }

  get rate1m(): number {
    return this._rate1m.average
  }

  get rate5m(): number {
    return this._rate5m.average
  }

  get avg(): number {
    return this._sum / this._totalCount
  }

  add(value: number): void {
    if (!this._started) return
    this._count += 1
    this._totalCount = this._totalCount + 1
    this._sum += value
  }

  start(): void {
    if (this._started) return
    this._started = true
    this._interval = setInterval(() => this.update(), this._intervalMs)
  }

  stop(): void {
    if (!this._started) return
    this._started = false

    if (this._interval) {
      clearInterval(this._interval)
    }
  }

  private update(): void {
    const now = Date.now()

    if (this._intervalLastMs === null) {
      this._intervalLastMs = now
      return
    }

    const elapsedMs = now - this._intervalLastMs
    const rate = elapsedMs === 0 ? 0 : (this._count / elapsedMs) * 1000

    this._rate5s.add(rate)
    this._rate1m.add(rate)
    this._rate5m.add(rate)
    this._count = 0
    this._intervalLastMs = now
  }
}
