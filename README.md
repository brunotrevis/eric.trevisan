# ERICtrevisan — Site oficial (com Orçamento Builder)

Site de fotografia e filme de casamento do Eric Trevisan. HTML, CSS e JavaScript puros, sem dependências de build. Inclui calculadora de orçamento integrada que abre o WhatsApp já com a mensagem formatada.

Pronto pra subir em qualquer hospedagem estática (Netlify Drop, Vercel, GitHub Pages).

## Estrutura

```
projeto-oficial/
├── index.html              # estrutura completa do site
├── css/styles.css          # paleta, tipografia, layout, animações + calculadora
├── js/main.js              # sliders, menu mobile, reveal on scroll
├── js/orcamento.js         # calculadora (orçamento builder + WhatsApp deeplink)
└── assets/
    ├── logo.png            # wordmark "ERICtrevisan" cream
    ├── icon-tr.png         # ícone "tr" verde petróleo (header no topo)
    ├── eric.jpg            # foto do Eric (seção Sobre)
    ├── pattern.png         # pattern cream pra fundos petróleo
    ├── pattern-dark.png    # pattern petróleo pra fundos cream
    ├── icons/              # ícones decorativos dos cards
    │   ├── CAMERA.png      # Pacote Basic
    │   ├── BRILHO.png      # Pacote Standard
    │   ├── DIAMANTE.png    # Pacote Premium
    │   ├── CLAQUETE.png    # Same Day Edit
    │   ├── DRONE.png       # Drone
    │   ├── FILMADORA.png   # Cerimônia na Íntegra
    │   └── ALIANCA.png     # Love Story
    └── fotos/
        ├── hero-01.jpg ... hero-03.jpg     # slideshow do hero
        └── foto-01.jpg ... foto-09.jpg     # galeria editorial (modo retrato)
```

## Identidade visual

**Paleta**

| Cor | Hex | Uso |
|---|---|---|
| Verde petróleo | `#122E33` | cor protagonista, fundo dominante |
| Petróleo soft | `#1F4148` | seções intermediárias (Adicionais, Sobre) |
| Petróleo deep | `#0A1F23` | footer |
| Cream | `#CEC1B2` | acento, base do logo |
| Cream-light | `#E8DFD2` | texto principal sobre petróleo |
| Cream-soft | `#F5F0E8` | seções claras de respiro (Filme, Pacotes, Depoimentos) |
| White | `#FFFFFF` | cards de contraste |
| Dourado | `#B8956A` | acento premium (badge "Mais escolhido", ornaments, estado "Adicionado") |
| Dourado soft | `#D4B896` | acento dourado em fundos escuros |

**Tipografia**

- Títulos: Playfair Display (serif editorial)
- Corpo: Inter (sans-serif)
- Logo wordmark: Italiana / Playfair (decorativa)

## Estrutura de seções

1. **Hero** — slideshow de 3 fotos com cross-fade + Ken Burns sutil, H1 "A sua história / de amor", CTA "Solicitar orçamento", setas de navegação manual
2. **Galeria** — slider editorial em proporção retrato (2/3) com 9 fotos curadas, dots e navegação
3. **Fotografia / Pacotes** — Basic R$ 2.500, Standard R$ 3.500 (Mais escolhido), Premium R$ 4.700 + botão "+ Adicionar ao orçamento" em cada
4. **Filme** — vídeo via Cloudinary + lista de entregas + R$ 3.200,00 + botão "+ Adicionar ao orçamento"
5. **Serviços Adicionais** — Same Day Edit / Drone / Cerimônia na Íntegra / Love Story (vinculados ao Filme) + botão "+ Adicionar"
6. **Depoimentos** — 2 depoimentos reais de noivas
7. **Sobre** — bio do Eric com retrato
8. **Contato** — WhatsApp, e-mail, Instagram

## Orçamento Builder (calculadora integrada)

### Como funciona

1. Visitante navega pelas seções de Pacotes, Filme e Adicionais
2. Em cada item há um botão **"+ Adicionar ao orçamento"** discreto, integrado ao design
3. Ao clicar, o botão vira dourado com ✓ "Adicionado" e uma barra fina sobe do rodapé com o total em tempo real
4. Visitante pode adicionar/remover itens livremente, conferindo o subtotal
5. Quando estiver pronto, clica em **"Ver orçamento"** na barra
6. Abre um modal com a lista detalhada, total estimado e duas ações:
   - **Enviar via WhatsApp** (CTA principal, dourado)
   - **Limpar seleção** (link discreto)
7. Ao enviar, abre o WhatsApp já com a mensagem formatada e agrupada por categoria

### Lógica das seleções

- **Pacotes de Fotografia** se comportam como radio — só 1 selecionado por vez (não dá pra contratar Basic e Standard juntos)
- **Filme** é independente — pode ser selecionado isoladamente ou em conjunto com pacote de fotografia
- **Adicionais** stackam livremente — múltiplos podem ser selecionados
- Se o visitante adicionar um Adicional sem Filme, o modal mostra um aviso elegante: *"💡 Os Serviços Adicionais são entregues em conjunto com o Filme de Casamento"*

### Persistência

A seleção é salva no `localStorage` do navegador. Se o visitante sair e voltar, o orçamento continua montado. Para começar limpo a cada visita, basta apagar a chamada `localStorage` em `js/orcamento.js` (constante `STORAGE_KEY`).

### Data desejada (opcional)

Antes de enviar, o visitante pode selecionar uma data prevista para o casamento usando um seletor de data nativo do navegador (com calendário automático em pt-BR). O campo é opcional e aceita apenas datas futuras.

- **Se selecionar data:** a mensagem inclui "📅 Data desejada: DD de MÊS de AAAA" + "Por favor, confirme se essa data está disponível."
- **Se NÃO selecionar:** a mensagem termina com "Ainda não defini uma data específica — por favor me informe quais datas estão disponíveis."

A verificação real de disponibilidade não é automática (exigiria integração com Google Calendar/Calendly e backend). O Eric responde manualmente após receber o WhatsApp.

### Mensagens geradas para WhatsApp

**Com data selecionada:**

```
Olá, Eric! Tenho interesse no orçamento abaixo:

📸 Fotografia
• Pacote Standard — R$ 3.500,00

🎬 Filme
• Filme de Casamento — R$ 3.200,00

✨ Serviços Adicionais
• Drone — R$ 800,00
• Same Day Edit — R$ 800,00

Total estimado: R$ 8.300,00

📅 Data desejada: 15 de outubro de 2026
Por favor, confirme se essa data está disponível.

Obrigada!
```

**Sem data selecionada:**

```
Olá, Eric! Tenho interesse no orçamento abaixo:

[mesma lista de itens e total]

Ainda não defini uma data específica — por favor me informe quais datas estão disponíveis.

Obrigada!
```

### Dois caminhos de contato preservados

- **Direto (Contato no rodapé):** botões WhatsApp/E-mail/Instagram abrem o app limpo, sem mensagem automática — pra quem só quer conversar
- **Calculadora (Pacotes/Filme/Adicionais):** seleciona itens, opcionalmente escolhe data, envia com mensagem formatada — pra quem já está pronto pra pedir orçamento

### Mobile-friendly

- Barra flutuante **só aparece após o primeiro item** — tela limpa por padrão
- Em telas <760px a barra fica em ~62px, totalmente integrada à navegação
- `body { padding-bottom }` ajustado quando a barra está ativa pra footer não ficar coberto
- Modal vira full-screen no mobile com X, ESC ou tap-fora pra fechar
- Botões "Adicionar" com 44px+ de altura (padrão de toque)
- Sem auto-popups, sem widgets sempre visíveis

## Animações implementadas

- **Slideshow do hero** com cross-fade de 1.8s + Ken Burns sutil (zoom lento de 1.04 → 1.0 durante 8s)
- **Galeria editorial** com cross-fade entre fotos (auto-avanço a cada 6.5s, prev/next manuais, dots)
- **Reveal on scroll** em todos os elementos via Intersection Observer (mobile + desktop)
- **Header** com blur e fundo petróleo translúcido ao rolar
- **Logo dinâmico**: ícone TR petróleo no topo (alto contraste sobre as fotos) → wordmark cream cross-fade ao rolar
- **Box hover** (Pacotes + Adicionais): lift de 10px, scale 1.012, borda dourada sutil
- **Botões shimmer** dourado, lift e letter-spacing animado
- **Price-tag (Investimento)** com mesma animação shimmer dos botões
- **Paralaxe sutil** no hero (8% da velocidade de scroll)
- **Pattern de fundo** (ícone "tr" repetido) em opacidade muito baixa nas seções sólidas
- **Orçamento Builder**: barra desliza suave de baixo (540ms ease-out), modal fade-in com scale, botão "Adicionar" com transição suave entre estados +/✓

## Mídias

**Fotos**: locais, otimizadas (1500px lado maior pra retrato, 1900px pra horizontal, JPG quality 82, progressive). Total ~2.7MB.

**Vídeo**: hospedado na Cloudinary, único vídeo demo:
```
https://res.cloudinary.com/dcjapqz1r/video/upload/v1777948241/VIDEO_DEMO_z2qhfs.mp4
```

## Contato (já preenchido)

- WhatsApp: (42) 99861-7310 → `https://wa.me/5542998617310`
- E-mail: `eric.henriquetrevisan@gmail.com`
- Instagram: `@eric.trevisan` → `https://www.instagram.com/eric.trevisan/`

## Como editar

| O que | Onde |
|---|---|
| Trocar telefone do WhatsApp (botão Contato + calculadora) | `js/orcamento.js` → constante `WHATSAPP_NUMBER` no topo + `index.html` → seção Contato |
| Trocar e-mail / Instagram | `index.html` → seção `<section class="section contato">` |
| Editar bio do Eric | `index.html` → seção `<section class="section sobre">` |
| Trocar depoimentos | `index.html` → seção `<section class="section depoimentos">` |
| Mudar preços | `index.html` → procurar `R$` em pacotes, filme e adicionais. **Atenção:** o atributo `data-price` no botão "Adicionar" também deve ser atualizado pra calculadora bater. |
| Ajustar mensagem do WhatsApp | `js/orcamento.js` → função `sendToWhatsApp()` |
| Adicionar novo serviço | `index.html` → criar novo card com `<button class="add-to-orcamento" data-add-item data-id="..." data-name="..." data-price="..." data-group="adicional">` |
| Substituir foto da galeria | colocar nova foto em `assets/fotos/` e atualizar `<img src>` correspondente |
| Trocar paleta de cores | `css/styles.css` → bloco `:root` no topo |
| Ajustar intervalo do slideshow | `js/main.js` → `interval: 6500` (em ms) |
| Desligar persistência (localStorage) | `js/orcamento.js` → comentar bloco `localStorage.getItem` no início |

## Como visualizar localmente

Duplo clique no `index.html` ou abre com seu navegador. Tudo funciona sem servidor (file:// roda direto, incluindo a calculadora).

## Como subir o site

**Opção mais rápida — Netlify Drop**

1. Vá em <https://app.netlify.com/drop>
2. Arraste a pasta inteira pra área de upload
3. Site no ar com URL `*.netlify.app` em segundos
4. Pode adicionar domínio próprio depois nas configurações

**Vercel**

1. <https://vercel.com> → New Project → Import folder
2. Mesmo princípio

**GitHub Pages**

1. Suba a pasta num repositório
2. Settings → Pages → Source: deploy from branch → main / root

## Para usar este modelo em outros clientes (revenda)

Se quiser adaptar este site pra outros profissionais (fotógrafos, videomakers, prestadores de serviço com pacotes), os pontos a trocar são:

1. **Identidade visual** — `:root` em `css/styles.css` (paleta) + Google Fonts no `<head>` do HTML
2. **Logos** — substituir `assets/logo.png` e `assets/icon-tr.png`
3. **Textos** — todas as seções no `index.html`
4. **Pacotes e preços** — HTML + atributos `data-id`, `data-name`, `data-price` dos botões "Adicionar"
5. **WhatsApp** — `WHATSAPP_NUMBER` em `js/orcamento.js`
6. **Mensagem do WhatsApp** — categorias e emojis em `sendToWhatsApp()` no `js/orcamento.js`
7. **Fotos e ícones** — `assets/fotos/` e `assets/icons/`
8. **Vídeo** — substituir URL do Cloudinary no `<video src>` da seção Filme

Tempo estimado de adaptação por cliente: 6–12h dependendo do volume de mídias.

## Acessibilidade

- Animações respeitam `prefers-reduced-motion` (usuários com preferência por menos movimento veem a versão sem animações de scroll/slide)
- Todas as imagens têm `alt` descritivo
- Botões e links têm `aria-label` quando necessário
- Modal tem `role="dialog"` e fecha com ESC
- Botões "Adicionar" têm `aria-pressed` que reflete o estado
- Estrutura semântica com `header`, `main`, `section`, `footer`, `nav`, `aside`

## Performance

- Total de assets ~7MB (fotos + ícones + pattern)
- Vídeo do Filme servido via Cloudinary (CDN)
- Imagens com `loading="lazy"` na galeria
- Sliders pausam quando saem da viewport (poupa CPU/bateria)
- Calculadora é puro JavaScript (~200 linhas), sem libraries externas
- CSS e JS minificáveis se quiser otimizar mais (não obrigatório)

## Browsers suportados

Chrome, Safari, Firefox, Edge — versões dos últimos 2 anos. CSS usa `aspect-ratio`, `backdrop-filter`, custom properties e `clamp()` (todos com bom suporte moderno). `localStorage` para persistência da calculadora.
