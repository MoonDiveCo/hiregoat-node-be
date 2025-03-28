import Config from "config";
import Routes from "./routes";
import Server from "./common/server";

const server = new Server()
  .router(Routes)
  .handleError()
  .configureDb(Config.get("dbUrl"))
  .then((_server) => _server.listen(Config.get("port")));
module.exports = server; 