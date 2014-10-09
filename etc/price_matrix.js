var base = 4999

module.exports = {
  Alpha: {
    memory: 512,
    cpus: 1,
    storage: 20,
    cents: base
  },
  Beta: {
    memory: 1024,
    cpus: 1,
    storage: 30,
    cents: base + 1000
  },
  Gamma: {
    memory: 2048,
    cpus: 2,
    storage: 40,
    cents: base + 2000
  },
  Delta: {
    memory: 4096,
    cpus: 2,
    storage: 60,
    cents: base + 4000
  },
  Epsilon: {
    memory: 8192,
    cpus: 4,
    storage: 80,
    cents: base + 8000
  }
}
