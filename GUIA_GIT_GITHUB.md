# Guia de Git e GitHub — Projeto PC Builder

## 1. Objetivo

Este guia apresenta os conceitos, comandos e procedimentos utilizados no projeto PC Builder (Simulador de Montagem de PC). O objetivo é ajudar os integrantes a trabalhar de forma organizada, acompanhar as alterações e colaborar sem prejudicar o trabalho dos outros grupos.

## 2. Git, GitHub e repositório

### O que é Git?

Git é um sistema de controle de versão que registra as alterações feitas nos arquivos. Ele permite acompanhar o histórico do projeto e comparar diferentes versões.

### O que é GitHub?

GitHub é uma plataforma online que hospeda repositórios Git e oferece recursos para colaboração, como branches, Issues, Pull Requests e revisão de alterações.

### O que é um repositório?

É o local onde ficam os arquivos do projeto e o histórico de alterações. O repositório local fica no computador do integrante, enquanto o remoto fica hospedado no GitHub.

### O que é um commit?

Commit é um registro de alterações selecionadas no histórico do Git. Cada commit deve possuir uma mensagem curta e clara sobre o que foi realizado.

Exemplo:

`docs: atualiza guia git github`

### O que é uma branch?

Branch é uma linha de trabalho separada que permite desenvolver uma tarefa sem modificar diretamente a versão principal do projeto.

A branch `main` representa a versão principal do repositório. As demais branches devem ser utilizadas para desenvolver e revisar tarefas específicas.

### O que é um Pull Request?

Pull Request (PR) é uma solicitação para revisar e integrar as alterações de uma branch em outra, normalmente na `main`. Ele permite verificar as mudanças, discutir melhorias e solicitar correções antes da integração.

## 3. Preparação para trabalhar no projeto

Antes de começar uma tarefa:

1. Confirme que está no repositório correto: `pc-builder`.
2. Verifique se possui acesso para contribuir.
3. Leia o `README.md` e o arquivo `PADROES_GIT.md`.
4. Confira a branch atual e se existem alterações locais pendentes.
5. Atualize a versão de trabalho antes de criar uma nova branch.

O GitHub Desktop pode ser utilizado para executar as operações mais comuns por meio de uma interface gráfica, sem precisar digitar todos os comandos no terminal.

## 4. Padrão de nomes das branches

As branches de trabalho devem seguir o padrão definido no `PADROES_GIT.md`:

`grupo-N/descricao-da-tarefa`

Regras:
- Utilizar letras minúsculas.
- Não utilizar espaços ou acentos.
- Separar palavras por hífen.
- Informar o grupo responsável e descrever a tarefa.
- Criar a branch a partir da `main` atualizada.

Exemplos:

- `grupo-1/componentes`
- `grupo-2/orcamento`
- `grupo-3/correcao-compatibilidade`

Os nomes acima são exemplos de tarefas. Antes de criar uma branch, confirme se ela corresponde à atividade realmente definida para o grupo.

## 5. Padrão das mensagens de commit

As mensagens de commit devem seguir o formato:

`tipo: descricao curta`

A descrição deve ser clara, em português, começar com um verbo no presente e representar uma alteração específica.

Tipos utilizados:

- `feat`: adicionar uma funcionalidade.
- `fix`: corrigir um erro.
- `docs`: adicionar ou atualizar documentação.
- `chore`: organizar arquivos ou realizar tarefas de manutenção.
- `refactor`: reorganizar o código sem alterar o comportamento esperado.
- `test`: adicionar ou ajustar testes.

Exemplos:

- `feat: adiciona selecao de componentes`
- `fix: corrige calculo do orcamento`
- `docs: atualiza instrucoes do projeto`
- `chore: organiza pasta de imagens`
- `test: adiciona teste de compatibilidade`

Faça commits pequenos e relacionados a uma única tarefa. Antes de registrar um commit, confira quais arquivos foram modificados.

## 6. Comandos básicos do Git

Os comandos abaixo são utilizados no terminal, dentro da pasta local do projeto.

### Clonar o repositório

`git clone URL_DO_REPOSITORIO`

Cria uma cópia local do repositório remoto. Substitua `URL_DO_REPOSITORIO` pelo endereço real do repositório `pc-builder`.

### Conferir o estado dos arquivos

`git status`

Mostra a branch atual e informa quais arquivos foram modificados ou estão preparados para commit.

### Listar as branches locais

`git branch`

Exibe as branches locais disponíveis.

### Mudar para a branch principal

`git switch main`

Seleciona a branch principal, desde que não existam alterações locais que impeçam a troca.

### Atualizar a main

`git pull origin main`

Busca e integra as atualizações remotas da `main` à branch local atual. Para seguir o fluxo do projeto, execute esse comando estando na `main`.

### Criar uma branch

`git switch -c grupo-1/componentes`

Cria uma branch e muda para ela. Substitua o nome pelo padrão e pela tarefa do seu grupo.

### Preparar alterações

`git add arquivo.ext`

Adiciona um arquivo específico à área de preparação do próximo commit.

O comando `git add .` prepara todas as alterações da pasta atual. Utilize-o somente depois de conferir os arquivos.

### Registrar um commit

`git commit -m "docs: atualiza instrucoes do projeto"`

Registra as alterações preparadas no histórico local.

### Enviar alterações ao GitHub

`git push -u origin grupo-1/componentes`

Envia os commits da branch para o GitHub. Adapte o nome ao da sua branch.

### Consultar o histórico

`git log --oneline`

Exibe um resumo dos commits realizados.

## 7. Push, Pull e Fetch

**Push:** envia os commits locais para o repositório remoto.

**Pull:** busca e integra as atualizações remotas à branch local atual.

**Fetch:** verifica as atualizações disponíveis no repositório remoto, sem integrá-las automaticamente à branch atual.

É importante não confundir essas operações: o commit registra a alteração no histórico local, enquanto o push envia os commits ao GitHub.

## 8. Fluxo de trabalho do projeto

Todos os grupos devem seguir o fluxo de colaboração definido pelo projeto:

1. **Atualizar a main:** obter as alterações mais recentes do repositório remoto.
2. **Criar uma branch:** iniciar uma linha de trabalho para uma tarefa específica.
3. **Realizar as alterações:** modificar somente os arquivos necessários para a tarefa.
4. **Testar:** verificar se as alterações funcionam conforme o esperado.
5. **Fazer commit:** registrar as mudanças com uma mensagem padronizada.
6. **Fazer push:** enviar a branch ao GitHub.
7. **Abrir um Pull Request:** solicitar a revisão das alterações, tendo a `main` como destino.
8. **Revisar:** verificar os arquivos, os commits, os testes e a descrição do PR.
9. **Corrigir, se necessário:** realizar os ajustes solicitados na mesma branch e enviar os novos commits.
10. **Integrar:** realizar o merge após as verificações necessárias e conforme as regras do repositório.

Não faça alterações diretamente na `main` quando a tarefa exigir o fluxo de branches e Pull Requests.

## 9. Como abrir um Pull Request

1. Envie sua branch ao GitHub com push.
2. Acesse a aba **Pull requests** do repositório.
3. Clique em **New pull request**.
4. Selecione `main` como base e sua branch como comparação.
5. Informe um título claro.
6. Descreva o que foi alterado e como foi testado.
7. Confira os arquivos em **Files changed**.
8. Crie o PR e solicite a revisão dos responsáveis.

Se forem solicitadas correções, faça-as na mesma branch e envie novos commits. O PR será atualizado automaticamente.

## 10. Revisão dos Pull Requests

Antes da integração, os responsáveis pela revisão devem conferir:

- Se o título e a descrição explicam a tarefa.
- Se o nome da branch segue o padrão definido.
- Se as mensagens de commit estão padronizadas.
- Se os arquivos modificados são os esperados.
- Se os testes necessários foram realizados.
- Se não existem senhas, tokens ou informações secretas.
- Se eventuais conflitos foram resolvidos.
- Se as regras do repositório foram respeitadas.

Caso existam problemas, solicite os ajustes antes de integrar as alterações.

## 11. Conflitos e problemas comuns

### O que é um conflito?

Um conflito acontece quando o Git não consegue combinar automaticamente alterações feitas em partes incompatíveis dos arquivos.

Para resolver:
1. Identifique os arquivos em conflito.
2. Compare as alterações realizadas.
3. Converse com os integrantes envolvidos, se necessário.
4. Combine o conteúdo correto e remova os marcadores de conflito.
5. Salve os arquivos e execute os testes necessários.
6. Confira as alterações antes de concluir a integração.

### A alteração não aparece no GitHub

Confira se o arquivo foi salvo, se as alterações foram reconhecidas pelo Git, se foi realizado o commit e se a branch foi enviada com push.

### Não consigo enviar alterações

Verifique se está na conta correta, se possui acesso de escrita e se a branch foi criada corretamente. Se necessário, procure o responsável pelo repositório.

### O Pull Request mostra arquivos demais

Confira se a branch foi criada a partir da base correta e se contém apenas as alterações relacionadas à tarefa.

## 12. Boas práticas e segurança

- Trabalhe em uma branch específica para cada tarefa.
- Atualize a base antes de iniciar uma nova branch.
- Faça commits pequenos e com mensagens claras.
- Revise as alterações antes de fazer commit e push.
- Nunca envie senhas, tokens, chaves privadas ou arquivos `.env` com informações secretas.
- Evite incluir arquivos temporários ou desnecessários.
- Converse com os outros grupos antes de alterar arquivos compartilhados.
- Teste as alterações antes de solicitar a integração.
- Consulte o `PADROES_GIT.md` quando houver dúvidas sobre as regras.

## 13. README e materiais de apoio

O `README.md` é a porta de entrada do projeto. Ele deve apresentar o objetivo do PC Builder, as instruções de execução, a organização dos arquivos e as orientações para contribuir.

As apostilas e os materiais de apoio devem ficar na pasta definida pela equipe, utilizando nomes claros e uma organização que facilite a consulta. A estrutura real do repositório deve ser respeitada para evitar pastas duplicadas.

## 14. Deploy e GitHub Pages

Deploy é o processo de disponibilizar uma versão da aplicação para que outras pessoas possam acessá-la.

O GitHub Pages pode ser uma opção para aplicações estáticas desenvolvidas com HTML, CSS e JavaScript, desde que a estrutura do projeto seja compatível e a equipe configure a publicação.

O fluxo geral de publicação é:

1. Confirmar com a equipe qual plataforma será utilizada.
2. Garantir que a versão aprovada esteja integrada à branch de publicação definida.
3. Configurar a origem e os caminhos dos arquivos.
4. Aguardar a conclusão da publicação.
5. Acessar a URL gerada e testar a aplicação.
6. Corrigir problemas por meio de novas branches e Pull Requests.

**Importante:** o fato de o código estar no GitHub não significa que o site já esteja publicado. A utilização do GitHub Pages precisa ser confirmada e configurada pela equipe.

## 15. Checklist antes de abrir um Pull Request

- [ ] Estou no repositório correto.
- [ ] Minha branch segue o padrão definido pelo grupo.
- [ ] Não realizei alterações diretamente na `main`.
- [ ] Revisei os arquivos e as linhas modificadas.
- [ ] Executei os testes necessários.
- [ ] As mensagens de commit estão claras.
- [ ] Não incluí senhas ou arquivos desnecessários.
- [ ] Enviei a branch correta ao GitHub.
- [ ] O PR tem a `main` como destino.
- [ ] A descrição explica as alterações e como foram testadas.

## 16. Glossário

| Termo | Significado |
|---|---|
| Git | Sistema de controle de versões. |
| GitHub | Plataforma online de hospedagem e colaboração. |
| Repositório | Projeto acompanhado pelo Git. |
| Clone | Cópia local vinculada ao repositório remoto. |
| Commit | Registro de alterações no histórico. |
| Branch | Linha de trabalho separada. |
| `main` | Branch principal do projeto. |
| Fetch | Busca informações sobre atualizações remotas. |
| Pull | Busca e integra atualizações remotas. |
| Push | Envia commits ao repositório remoto. |
| Pull Request (PR) | Solicitação de revisão e integração de alterações. |
| Merge | Integra alterações entre branches. |
| Conflito | Alterações que precisam ser conciliadas manualmente. |
| Deploy | Publicação da aplicação em um ambiente acessível. |

## 17. Resumo do fluxo

**Atualizar a main → Criar branch → Alterar arquivos → Testar → Commit → Push → Pull Request → Revisão → Merge → Deploy, quando aplicável.**

Este guia deve ser utilizado em conjunto com o arquivo `PADROES_GIT.md` e com as decisões atualizadas da equipe do PC Builder.
