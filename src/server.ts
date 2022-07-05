import app from './app';
import Logger from './utils/Logger';

init();

async function init() {
  try {
    app.listen(3001, () => {
      Logger.info('Express App Listening on Port 3001');
    });
  } catch (error) {
    console.log(error);
    Logger.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
