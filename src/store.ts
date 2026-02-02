type Listener = () => void;

class DevToolsStore {
  // Map serialized key -> original key (for mutate)
  private keyMap: Map<string, any> = new Map();
  // Map serialized key -> current state (optional, if we want push updates)
  private listeners: Set<Listener> = new Set();
  
  // Track mutations
  private mutations: Array<{ 
    id: string; 
    key: string; 
    startTime: number; 
    endTime?: number; 
    status: string; 
    data?: any; 
    error?: any 
  }> = [];

  // Track if middleware is active
  private hasInstalledMiddleware = false;

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  activateMiddleware() {
    if (!this.hasInstalledMiddleware) {
      this.hasInstalledMiddleware = true;
      this.notify();
    }
  }

  isMiddlewareActive() {
    return this.hasInstalledMiddleware;
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  registerKey(serializedKey: string, originalKey: any) {
    if (!this.keyMap.has(serializedKey)) {
      this.keyMap.set(serializedKey, originalKey);
      this.notify();
    }
  }

  getOriginalKey(serializedKey: string) {
    return this.keyMap.get(serializedKey);
  }

  getKeys() {
    return Array.from(this.keyMap.keys());
  }
  
  addMutation(mutation: any) {
    this.mutations = [mutation, ...this.mutations].slice(0, 50); // Keep last 50
    this.notify();
  }
  
  updateMutation(id: string, update: any) {
    this.mutations = this.mutations.map(m => 
      m.id === id ? { ...m, ...update } : m
    );
    this.notify();
  }

  getMutations() {
    return this.mutations;
  }
}

export const devToolsStore = new DevToolsStore();
