import Server from './server.js';

class JwtApplication {
  public run(): void {
    const server = new Server();

    server.start();
  }
}

const jwtApplication: JwtApplication = new JwtApplication();
jwtApplication.run();
