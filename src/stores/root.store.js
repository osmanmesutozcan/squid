import React from "react";
import { observable, action, computed } from "mobx";

import { Playback } from "./playback.store";
import { Keyboard } from "./keyboard.store";
import { DockStore } from "../components/Dock";

/**
 * Encapsulate all app data.
 */
class RootImpl {
  /**
   * Single dock store of the app.
   */
  dock = null;

  constructor() {
    this.dock = new DockStore(this);
    this.playback = new Playback(this);
    this.keyboard = new Keyboard(this);
  }

  /**
   * All registered plugins
   */
  _registered = [];

  /**
   * Register plugin.
   */
  register = (component, options) => {
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
  getRegisteredById = id => {
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
  _opted = {};

  _optin = id => {
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
  use = plugin => {
    if (plugin instanceof Array) {
      for (let p in plugin) {
        this._optin(plugin[p].options.id);
      }
    } else {
      this._optin(plugin.id);
    }
  };

  /**
   * List of currently active plugins.
   */
  @observable.shallow
  _active = [];

  @computed
  get active() {
    return this._active;
  }

  /**
   * Callback to activate a plugin.
   * @param {Object} _plugin
   */
  @action
  activate = _plugin => {
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
  deactivate(uuid) {
    this._active.forEach(a => {
      if (a.component.props.model.uuid === uuid) {
        this._active.remove(a);
      }
    });
  }
}

/**
 * Define a root instance.
 */
export const Root = new RootImpl();
