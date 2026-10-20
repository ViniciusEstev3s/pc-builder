# Padrões de Git do projeto

Estas regras valem para todos os grupos e ajudam a organizar as contribuições.

## Conceitos básicos

- **Git:** registra o histórico das alterações no seu computador.
- **GitHub:** guarda o repositório online para a equipe compartilhar as mudanças.
- **Repositório:** pasta do projeto Montar PC com seus arquivos e histórico.
- **Commit:** ponto de salvamento de uma mudança pequena e bem definida.
- **Push:** envio dos commits locais para o GitHub.

O fluxo da equipe é: **criar branch → alterar arquivos → fazer commit → enviar com push → abrir PR → revisar → integrar à `main`**.

## 1. Nomes das branches

Uma branch é uma área separada para trabalhar nas alterações. Crie uma branch a partir da `main` atualizada para cada tarefa. O nome deve começar com o grupo, seguido de uma barra e do assunto da tarefa, como `grupo-1/componentes`.

Use letras minúsculas, sem espaços e sem acentos; separe as palavras com hífen.

Exemplos:

- `grupo-1/componentes`
- `grupo-2/orcamento`
- `grupo-3/correcao-compatibilidade`

Não envie alterações diretamente para a `main`. Ela reúne as contribuições já revisadas.

## 2. Mensagens de commit

Um commit registra um conjunto de alterações. Faça commits pequenos, relacionados à mesma tarefa. Comece a mensagem com o tipo da alteração, seguido de dois-pontos e de uma descrição clara, como neste exemplo:

```text
docs: adiciona lista de componentes
```

Escreva a descrição em português, começando com um verbo no presente, como `adiciona`, `corrige` ou `atualiza`. Use o tipo em letras minúsculas e um espaço depois dos dois-pontos.

| Tipo | Quando usar | Exemplo |
| --- | --- | --- |
| `docs` | Documentação, listas e explicações | `docs: adiciona lista de componentes` |
| `feat` | Nova funcionalidade | `feat: adiciona calculadora de custo do PC` |
| `fix` | Correção de erro | `fix: corrige soma dos preços` |
| `chore` | Organização e manutenção | `chore: organiza pastas dos grupos` |

Evite mensagens vagas como `alterações`, `ajustes` ou `finalizado`. A mensagem deve explicar o que mudou.

## 3. Como enviar um Pull Request (PR)

Um PR é um pedido para revisar e juntar as alterações da sua branch à `main`.

1. Antes de começar, atualize a `main` local e crie a branch da tarefa:

   Se ainda não tem o projeto no computador, execute uma vez:

   ```bash
   git clone https://github.com/ath4yde/projeto-montar-pc.git
   cd projeto-montar-pc
   ```

   Dentro da pasta do projeto, com as alterações anteriores já salvas em commits:

   ```bash
   git switch main
   git pull origin main
   git switch -c grupo-1/componentes
   ```

   Troque `grupo-1/componentes` pela branch do seu grupo e da sua tarefa.

2. Faça as alterações, confira os arquivos e teste o que for necessário. Para documentação, revise o texto, os links e a formatação.
3. Confira o que mudou e registre os arquivos da tarefa em um commit:

   ```bash
   git status
   git diff
   git add componentes.md
   git commit -m "docs: adiciona lista de componentes"
   ```

   Neste exemplo, o grupo criou o arquivo `componentes.md`. Troque esse nome pelos arquivos que você alterou e adapte a mensagem ao trabalho realizado. O commit salva a mudança no computador; o próximo passo a envia ao GitHub.

4. Envie a branch para o GitHub:

   ```bash
   git push -u origin grupo-1/componentes
   ```

5. No GitHub, abra o repositório e clique em **Compare & pull request**. Se o botão não aparecer, vá em **Pull requests → New pull request**.
6. Escolha `main` como **base** (destino) e a branch da tarefa como **compare** (origem).
7. Use um título claro, por exemplo: `Grupo 1: adiciona lista de componentes`. Na descrição, informe:
   - Qual grupo fez a alteração.
   - O que mudou e por quê.
   - Como vocês conferiram ou testaram o resultado.
8. Confira a aba **Files changed**, clique em **Create pull request** e solicite a revisão de outro integrante ou do responsável pelo projeto.
9. Se houver pedidos de ajuste, faça novos commits e envie com `git push` na mesma branch. O PR será atualizado automaticamente; não precisa abrir outro.
10. Se houver conflitos, combine a resolução com quem alterou os mesmos arquivos. Aguarde a revisão, a aprovação e as verificações automáticas, caso existam. Depois, o responsável pelo projeto faz o **merge**, que junta as alterações à `main`.

## 4. Cuidados de todos os grupos

- Mantenha cada PR focado em uma tarefa.
- Combine com os outros grupos antes de alterar arquivos compartilhados.
- Não inclua senhas, tokens ou arquivos pessoais nos commits.
- Revise sua contribuição antes de pedir a revisão de outra pessoa.

## 5. Publicação do simulador (deploy)

Deploy é publicar o simulador como site para outras pessoas acessarem. Fazer commit, enviar com push ou integrar um PR não significa, por si só, publicar o site; isso depende da configuração do projeto.

Conforme a apresentação de referência, o GitHub Pages é uma possibilidade de publicação e ainda não estava configurado no material. A publicação deve seguir o que for combinado pela equipe.

Referência: apresentação **Git e GitHub: Guia Básico de Versionamento e Colaboração em Projetos**, de Vinícius Henrique Simões Esteves, Victoria Arine Esposito Lourencini e Vinícius Athayde Silva.
