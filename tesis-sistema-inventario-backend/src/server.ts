import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import { createApp } from "./app";
import { env } from "./config/environment";

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    createApp().listen(env.PORT, () => console.log(`Servidor escuchando en el puerto ${env.PORT}`));
  } catch (error) {
    console.error("No se pudo iniciar el servidor", error);
    process.exit(1);
  }
}
bootstrap();
