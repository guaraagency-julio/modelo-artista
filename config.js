/**
 * MODELO ARTISTA — GUARÁ AGENCY
 * Arquivo de personalização. Todos os dados abaixo são DEMONSTRATIVOS.
 *
 * Para usar com um artista real:
 * 1. Substitua nome, biografia, capas e fotos do HTML.
 * 2. Insira o WhatsApp de contratação com código do país + DDD (somente dígitos).
 * 3. Configure URLs oficiais do Spotify, YouTube e redes sociais.
 * 4. Substitua o array shows pelas datas reais.
 * 5. Revise os textos e remova a faixa "site demonstrativo" após aprovação.
 */
window.ARTIST_CONFIG = {
  name: "Noah Valente",
  type: "Artista & Cantor",
  demo: true,
  whatsappNumber: "", // Exemplo de formato: "55" + DDD + número, sem +, espaços ou símbolos.
  spotifyUrl: "", // Link oficial de artista/álbum/EP, ex.: https://open.spotify.com/artist/...
  spotifyEmbedUrl: "", // Opcional: https://open.spotify.com/embed/album/...
  youtubeVideoId: "", // ID de 11 caracteres do vídeo do YouTube; carregado apenas quando o usuário clica.
  instagramUrl: "",
  pressKitUrl: "./press-kit.html",
  shows: [
    { date: "2026-11-14", city: "Porto Alegre", state: "RS", title: "Noite de música ao vivo", type: "Evento demonstrativo", public: true },
    { date: "2026-11-21", city: "Novo Hamburgo", state: "RS", title: "Show especial", type: "Evento demonstrativo", public: true },
    { date: "2026-11-27", city: "Gramado", state: "RS", title: "Celebração privada", type: "Evento demonstrativo", public: false },
    { date: "2026-12-05", city: "Caxias do Sul", state: "RS", title: "Festival de verão", type: "Evento demonstrativo", public: true },
    { date: "2026-12-19", city: "Torres", state: "RS", title: "Encontro de fim de ano", type: "Evento demonstrativo", public: true },
    { date: "2027-01-16", city: "Florianópolis", state: "SC", title: "Especial de verão", type: "Evento demonstrativo", public: true }
  ]
};