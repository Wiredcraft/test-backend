import { DagMaker, VertexFactory } from 'dag-maker';
import { installForwards, uninstallForwards, getForwards } from 'forwardit';
import * as providers from '../providers';

export interface ContextInitializeOptions {
  providerFactories: VertexFactory<any>[];
}

export interface Context extends providers.Forwards {}

export class Context {
  private createdAt: [number, number];
  private dagMaker?: DagMaker;
  private dag?: Map<string, any>;

  constructor() {
    this.createdAt = process.hrtime();
  }

  async initialize(options: ContextInitializeOptions) {
    const dagMaker = new DagMaker(...options.providerFactories);
    const dag = await dagMaker.create();
    this.dagMaker = dagMaker;
    this.dag = dag;
    for (const vertex of dag.values()) {
      installForwards(this, vertex);
    }
    for (const provider of Object.values(providers)) {
      const forwards = getForwards(provider.prototype) || [];
      for (const forward of forwards) {
        if (!(forward.name in this)) {
          Object.defineProperty(this, forward.name, {
            configurable: true,
            enumerable: true,
            get() {
              throw new Error(`${provider.name} is not available`);
            },
          });
        }
      }
    }
  }

  async finalize() {
    if (!this.dagMaker || !this.dag) {
      return;
    }
    await this.dagMaker.destroy(this.dag);
    for (const vertex of this.dag.values()) {
      uninstallForwards(this, vertex);
    }
    for (const provider of Object.values(providers)) {
      const forwards = getForwards(provider.prototype) || [];
      for (const forward of forwards) {
        if (Object.hasOwnProperty.call(this, forward.name)) {
          const property = forward.name as keyof Context;
          delete this[property];
        }
      }
    }
    this.dagMaker = undefined;
    this.dag = undefined;
  }

  get uptime() {
    const [seconds] = process.hrtime(this.createdAt);
    return seconds;
  }
}

export const context = new Context();
