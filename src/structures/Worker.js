class Worker {
  constructor(id, config, cluster) {
    this.id = id;
    this.config = config;
    this.worker = cluster.workers[this.id];
  }

  get name() {
    return `This is ${this.id || 'Unknown'}`;
  }
}

module.exports = Worker;
