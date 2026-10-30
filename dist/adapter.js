import {makeData,AS_OF,SYNC} from './data.js';
/** Normalized read boundary. No credentials or undocumented endpoints are used. */
export class DemoAdapter {
  mode='demo';
  createInitialSnapshot(){return makeData()}
  async readSnapshot(){return {data:this.createInitialSnapshot(),mode:this.mode,asOf:AS_OF,lastSuccessfulSync:SYNC}}
}
export class SunnybrookAdapter {
  mode='unconfigured';
  async readSnapshot(){throw new Error('Sunnybrook integration is not configured. A verified server-side API contract and authorized tenant mapping are required.')}
}
export const demoAdapter=new DemoAdapter();
