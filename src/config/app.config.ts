export const EnvConfiguration = () => ({
  ollamaModel: process.env.OLLAMA_MODEL || 'mistral',
  ollamaURL: process.env.OLLAMA_URL || 'http://localhost:11434',
});
