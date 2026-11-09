# Modelo Artista — Guará Agency

Landing page demonstrativa de alto padrão para cantores, bandas e músicos, criada para o portfólio comercial da **Guará Agency**.

**Referência estrutural:** https://gusttavo-ribeiro.vercel.app/ — a arquitetura de informações do site público foi analisada. A implementação aqui é **original**, com código próprio, uma identidade fictícia ("Noah Valente"), textos adaptados e fotos ilustrativas licenciadas pelo Unsplash. Não contém o código-fonte, as fotografias oficiais ou a identidade artística de Gusttavim Ribeiro.

## Seções

1. **Hero** com retrato em destaque, chamada, gêneros musicais e ações principais.
2. **Agenda de shows** em calendário navegável, dias marcados e detalhes de eventos.
3. **Músicas / EP** com capa editorial, repertório de demonstração e botão Spotify.
4. **Vídeo** com player YouTube sob demanda (não carrega até clicar).
5. **Sobre** com biografia e destaque visual.
6. **Galeria** com grade responsiva e lightbox, navegação por setas/teclado/ESC.
7. **Contratação** com validação de campos e mensagem preenchida para WhatsApp.
8. **Press kit** com página pronta para impressão/salvamento em PDF.
9. **Rodapé** com navegação e atribuição do modelo.

## Tecnologia

- HTML5, CSS3 e JavaScript ES2020+; **sem frameworks, build ou dependências de runtime**.
- Responsivo para desktop, tablet e mobile.
- Calendário implementado com Date/Intl, sem biblioteca de terceiros.
- Animações CSS com suporte a \`prefers-reduced-motion\`.
- Navegação acessível, foco visível, campos rotulados e \`dialog\` nativo.
- SEO básico, metadados Open Graph e lazy loading das imagens secundárias.

## Personalização

Edite **\`config.js\`**:

\`\`\`js
window.ARTIST_CONFIG = {
  name: "Nome do Artista",
  type: "Artista & Cantor",
  demo: false,
  whatsappNumber: "55DDDNUMERO",
  spotifyUrl: "https://open.spotify.com/artist/...",
  spotifyEmbedUrl: "https://open.spotify.com/embed/album/...",
  youtubeVideoId: "ID_DE_11_CARACTERES",
  instagramUrl: "https://instagram.com/perfil",
  pressKitUrl: "./press-kit.html",
  shows: [
    { date: "2027-01-16", city: "Porto Alegre", state: "RS", title: "Nome do evento", type: "Show", public: true }
  ]
};
\`\`\`

**Atenção:** \`name\`, \`type\`, \`demo\` e \`instagramUrl\` são metadados reservados para a personalização. O conteúdo visual está escrito no HTML e precisa ser atualizado também, inclusive no press kit, por razões de SEO e renderização inicial. O array \`shows\`, links e número de WhatsApp são usados pela lógica do site.

- **Nome, copy, títulos, links internos e dados**: altere \`index.html\` e \`press-kit.html\`.
- **Fotos**: substitua URLs \`images.unsplash.com\` por imagens autorizadas do artista, preferencialmente hospedadas localmente em \`/assets\`.
- **Paleta**: variáveis CSS em \`:root\` de \`styles.css\`.
- **Datas**: formato \`YYYY-MM-DD\`; a agenda usa datas locais do visitante.
- **WhatsApp**: insira um número real com DDI (55) + DDD + número, somente dígitos. Sem número, o botão abre o fluxo de compartilhamento do WhatsApp sem destinatário fixo.
- **Spotify**: insira URLs oficiais; o player incorporado aparece quando houver \`spotifyEmbedUrl\` válida.
- **YouTube**: insira o ID de um vídeo oficial; o player é carregado só depois de clicar.
- **Press kit**: substitua material demonstrativo por conteúdo aprovado e confirme os direitos de uso.
- **Faixa de demonstração**: remova o elemento \`.demo-ribbon\` ao publicar a versão de um artista real.

## Executar localmente

Não requer instalação. Abra \`index.html\` no navegador ou use um servidor estático:

\`\`\`bash
python -m http.server 5173
\`\`\`

Acesse http://localhost:5173.

## Publicar

**Cloudflare Pages (recomendado para o fluxo da agência):**

1. Conecte o repositório GitHub \`guaraagency-julio/modelo-artista\` em Workers & Pages > Create > Pages > Import Git repository.
2. Framework preset: **None**.
3. Build command: deixe vazio.
4. Build output directory: **/** ou o diretório raiz conforme a interface de deploy; os arquivos estão diretamente na raiz.
5. Faça o deploy e configure o domínio personalizado, se necessário.

**Vercel:** importe o repositório e use preset "Other"; não existe comando de build.

**GitHub Pages:** o site também é compatível com deploy estático a partir da raiz da branch \`main\`, quando o Pages estiver habilitado.

## Limites e cuidados

- **Demonstração:** datas, eventos, discografia, nome e narrativa são fictícios. As fotos são *ilustrativas* e não representam um artista real.
- **Imagens de terceiros:** este repositório usa links CDN do Unsplash apenas para o modelo. Verifique os termos de licença e não atribua o retratado ao personagem fictício. Recomenda-se substituir tudo por fotos do artista.
- **Formulário:** valida localmente e redireciona para o WhatsApp; não grava dados, não confirma datas e não possui servidor.
- **Disponibilidade:** o calendário apenas exibe datas configuradas, sem verificar reservas em tempo real.
- **Mídia:** Spotify/YouTube precisam de links próprios para ficar ativos. Nenhum vídeo ou áudio do site de referência foi copiado.
- **Press kit:** o botão de impressão abre a interface do navegador para salvar como PDF.
- **Créditos:** conceito e desenvolvimento demonstrativo: Guará Agency. A fonte de inspiração é creditada acima; não há vínculo oficial com o artista da referência.

## Estrutura

\`\`\`text
modelo-artista/
├── index.html
├── styles.css
├── config.js
├── script.js
├── press-kit.html
└── README.md
\`\`\`
