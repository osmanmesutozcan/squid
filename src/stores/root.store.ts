import * as React from "react";
import { observable, action, computed } from "mobx";

import { DockStore } from "../components/Dock";

import { Playback } from "./playback.store";
import { Keyboard } from "./keyboard.store";

interface IPluginOptions {
  id: string;
  name: string;
  model: any;
}

/**
 * Encapsulate all app data.
 */
class RootImpl {
  /**
   * Single dock store of the app.
   */
  dock: DockStore;
  playback: Playback;
  keyboard: Keyboard;

  constructor() {
    this.dock = new DockStore(this);
    this.playback = new Playback(this);
    this.keyboard = new Keyboard(this);
  }

  /**
   * All registered plugins
   */
  _registered: any[] = [];

  /**
   * Register plugin.
   */
  register = (component: any, options: IPluginOptions) => {
    let entry = {
      options,
      component
    };

    this._registered.push(entry);
    return entry;
  };
  get registered() {
    return this._registered;
  }

  /**
   * Find a plugin by its identifier.
   */
  getRegisteredById = (id: string) => {
    let plugin = null;
    this._registered.forEach(p => {
      if (p.id === id) {
        plugin = p;
      }
    });

    return plugin;
  };

  /**
   * List of plugins that are opt in.
   */
  _opted: { [key: string]: any } = {};

  _optin = (id: string) => {
    const plugins = this._registered;
    for (let p in plugins) {
      if (plugins[p].options.id === id) {
        this._opted[id] = plugins[p];
      }
    }
  };
  get opted() {
    return this._opted;
  }

  /**
   * Activate a plugin via its unique id.
   */
  use = (plugin: any[]) => {
    for (let p in plugin) {
      this._optin(plugin[p].default.options.id);
    }
  };

  /**
   * List of currently active plugins.
   */
  @observable.shallow
  _active: any[] = [];

  @computed
  get active() {
    return this._active;
  }

  /**
   * Callback to activate a plugin.
   * @param {Object} _plugin
   */
  @action
  activate = (_plugin: any) => {
    const { options } = _plugin;
    const model = new options.model(this.dock);

    let entry = Object.assign(
      {
        component: React.createElement(_plugin.component, {
          ...options,
          model
        })
      },
      options
    );

    this._active.push(entry);
  };

  /**
   * Callback to deactivate a plugin.
   * @param {Object} plugin
   */
  @action
  deactivate(uuid: string) {
    this._active.forEach(a => {
      if (a.component.props.model.store.id === uuid) {
        (this._active as any).remove(a);
      }
    });
  }
}

/**
 * Define a root instance.
 */
export const Root = new RootImpl();
