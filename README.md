# Opus-Fenestra

Este projeto é um trabalho de conclusão de curso de engenharia de software no ano de 2021.

O tema escolhido foi criar uma ferramenta de auxílio ao gerente de portfólio de forma a facilitar seu trabalho.

Tecnologias utilizadas:

- ReactJs
- NodeJs
- Typescript
- JWT
- Sass
- Sqlite
- Astah para diagramas
- Lucidchart para o modelo de Entidade-Relacionamento

### Instalação <h3>
  
  Depois de clonar o repositório, com o yarn instalado na versão 1.22 e o node na versão 14.17, execute o comando "yarn" tanto no front quanto no back para baixar as dependências necessárias do projeto.
  
  Caso ainda não tenha o arquivo database.sqlite dentro da pasta backend/src/database, crie esse arquivo e rode yarn typeorm migration:run para criar as tabelas do banco de dados.
  
  Para executar o projeto, basta executar o comando "yarn dev" tanto no frontend e no backend para executar o projeto.
  Para abrir o projeto no navegador, basta entrar em localhost:3000 após executar o frontend e o backend.
  
  Caso o comando do "yarn" dê problemas de timeout durante a instalação das dependências , execute o comando: "yarn config set network-timeout 600000 -g" para aumentar o tempo de download das dependências

### Imagens <h3>
  Exemplo de listagem de projetos
![Listagem](https://user-images.githubusercontent.com/20386403/122325707-70d73100-cf01-11eb-8ee4-8634fd271f11.png)
  
  Exemplo de criação e edição de projetos
![edição](https://user-images.githubusercontent.com/20386403/122325700-6f0d6d80-cf01-11eb-9bed-220c6a4a10f7.png)

