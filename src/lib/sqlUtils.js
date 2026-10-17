// Escapa os curingas do LIKE (% e _) para que o texto do usuário seja buscado literalmente
export const escapeLike = (value) => String(value).replace(/[\\%_]/g, (char) => `\\${char}`);
