import dotenv from "dotenv";

dotenv.config();

function getEnvVariable(name:string):string{
    const value=process.env[name];
    if(!value)
    {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const ENV_VARS={
    PORT:process.env.PORT,
    SCRAPING_DOG_API_KEY:getEnvVariable("SCRAPING_DOG_API_KEY"),
    QDRANT_URL:getEnvVariable("QDRANT_URL"),
    HUGGINGFACEHUB_ACCESS_TOKEN:getEnvVariable("HUGGINGFACEHUB_ACCESS_TOKEN"),
}