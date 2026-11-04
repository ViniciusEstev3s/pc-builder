# Konoha Hardware

Site para quem quer entender as peças de um computador e montar um PC sem errar. Une dois projetos anteriores:

- **Anatomia do PC** (Next.js): guia educativo com um PC em 3D que se desmonta com a rolagem, comparativos, diagrama de conexões, glossário, FAQ e artigos.
- **Konoha Hardware** (HTML/JS): montador com catálogo real, verificação de compatibilidade, preços, PCs prontos, relatório de desempenho e quiz de Arquitetura da Computação.

## Rodar

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # site estático em out/ (hospedagem na raiz do domínio)
npm run build:relativo   # site estático com caminhos relativos (subpasta, artefato, GitHub Pages)
npm run test:fluxos      # testes de ponta a ponta (precisa de um build e do Playwright)
```

Login com Google é opcional: defina `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (ID do cliente OAuth "Aplicativo da Web", com a origem do site autorizada no Google Cloud Console) antes do build. Sem essa variável, o botão não aparece.

## Telas

Uma página só, com seis telas trocadas pelo `#` do endereço. Voltar/Avançar do navegador e links salvos funcionam em qualquer hospedagem estática.

| Endereço | Tela | De onde veio |
|---|---|---|
| `#inicio` | Proposta do site e os quatro caminhos | novo |
| `#aprender` | PC 3D que se desmonta, 12 peças, comparativos, conexões | Anatomia |
| `#montar` | Montador por etapas e aba "Conferir minhas peças" | Konoha + verificador do Anatomia |
| `#resultado` | Preço, nível, FPS estimado, limitações, divisão do orçamento | Konoha + gráfico do Anatomia |
| `#prontos` | 6 PCs prontos e "Pronto ou montado?" | Konoha + Anatomia |
| `#quiz` | 12 temas de Arquitetura da Computação | Konoha |
| `#duvidas` | Glossário, perguntas frequentes e artigos | Anatomia (+ termos do Konoha) |
| `#equipe` | Integrantes | Konoha |

## Estrutura

```
app/                      layout, página (troca de telas) e estilos globais
components/telas/         uma tela por arquivo (Início, Aprender, Montar, Prontos, Quiz, Dúvidas, Equipe)
components/montador/      Montador, Resultado e ConferirPecas
components/sections/      seções do guia 3D (Hero, peças, comparativos, diagrama, glossário, FAQ...)
components/three/         cena 3D (React Three Fiber)
components/ui/            Modal, Confirmação, Avisos, Termo, Contador
lib/konoha/               dados e motores do Konoha em TypeScript: catálogo, PCs prontos,
                          compatibilidade, desempenho e quiz
lib/montagem.ts           montagem do usuário (salva no navegador)
lib/rotas.ts              navegação por # entre as telas
lib/parts.ts, lib/site.ts conteúdo do guia, glossário, FAQ e artigos
public/img/pecas/         fotos das peças (WebP, 480 px)
scripts/                  ajuste de caminhos das fontes no build relativo
tests/fluxos.mjs          testes de ponta a ponta
```

Para mudar preços ou especificações, edite `lib/konoha/pecas.ts`; totais, compatibilidade e PCs prontos se recalculam sozinhos.

## Principais decisões

- **Base Next.js do Anatomia**: código tipado e em componentes. A lógica do Konoha (catálogo, compatibilidade, desempenho, quiz) foi portada sem mudar as regras.
- **Um montador só**: o verificador manual do Anatomia virou a aba "Conferir minhas peças", para peças de outras lojas. O catálogo do Anatomia, que só levava de volta às explicações, foi removido; cada etapa do montador agora tem o link "Entenda esta peça", que abre a explicação 3D.
- **PC de referência**: a seção sem preços deu lugar aos PCs prontos com preços reais, e o gráfico "Para onde vai o dinheiro" agora usa os preços das peças.
- **Contato removido**: os dados de contato eram fictícios ("seudominio", "(00) 00000-0000"). No lugar, a tela "Sobre a equipe".
- **Visualizador 3D único**: o visualizador do Konoha (aba Gamer) foi substituído pela cena 3D do Anatomia, mais completa.
- **Login opcional**: antes, o site pedia ao visitante um "Client ID" do Google. Agora o ID é configurado por quem publica.
- **Menos ruído**: avisos só quando algo sai da montagem (sempre com "Desfazer"); peças incompatíveis escondidas por padrão; detalhes secundários recolhidos.

## Testes

`tests/fluxos.mjs` abre o site num navegador real e confere 44 pontos: montar as 8 peças, resultado, Voltar do navegador, remover e desfazer, limpar com confirmação, persistência após recarregar, incompatibilidades com motivo, busca de peças e termos, PCs prontos com confirmação de substituição, "Conferir minhas peças", quiz pelo teclado, ajuda contextual, atalhos, link do montador para a explicação 3D, e celular (barra fixa, menu, nada passando da largura da tela).

## Limitações conhecidas

- Preços são de referência, cadastrados à mão; o FPS é estimativa.
- As fotos dos PCs prontos (222 px) e da tela inicial (390 px) têm baixa resolução; trocar por fotos maiores melhora a nitidez.
- A cena 3D exige WebGL; sem ele, ou com "reduzir movimento" ativo, aparece uma ilustração 2D.
