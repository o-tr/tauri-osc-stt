class PortManager {
  private readonly ports: number[];
  private index = 0;
  constructor(start: number,end:number) {
    this.ports = Array.from({length: end - start + 1}, (_, i) => start + i).sort(() => 0.5 - Math.random());
  }
  
  getPort() {
    const port = this.ports[this.index];
    this.index = (this.index + 1) % this.ports.length;
    return port;
  }
}

export { PortManager};
