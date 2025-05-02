# Requisitos funcionais

- [x] deve ser possivel se cadastrar.
- [x] deve ser possivel fazer o login.
- [x] deve ser possivel fazer o login com uam conta github
- [] deve ser possivel fazer login com uma conta google
- OBS.:(Pesquisar para saber como buscar as informações da conta github e google para salvar no banco)

- [] deve ter uma rota para alterar o perfil (avatar, nome, email senha)
- [] deve ser possivel cadastrar uma expense ou uma income os dados devem ser.: title, value, category, date, type(income, expense)
- [] deve ser possivel alterar cada um dos campos

- [] deve ser possivel listar as 10 ultimas transactions
- [] deve ser possivel ver o total de incomes/mes
- [] deve ser possivel ver o toal de expense/mes
- [] deve ser possivel ver a trsaction mais cara do mes, trazendo seu nome, value e tambem tarzer a mais cara do mes passado com um comparativo em percentual pra mais ou menos
- [] deve ser possivel listar a categoria favorita por exemplo.: se o usuario teve mais gastos com aquela categoria no mes é ela que deve aparecer trazendo o valor total gasto no mes e tambem trazer a categoria do mes passado e um comparativo percentual para mais ou menos
- [] deve ser possivel listar as transaction de acordo com um periodo por exemplo.: periodo de 7 dias, a mais cara do dia 1, a mais cara do dia 2 a mais cara do dia 3 e assim por diante
- [] deve ser possivel listar as tres transaction mais caras e quantas transactios foi feito para essa categoria.
- [] deve ser possivel listar todas as transaction e a qauntidade que eu ja de transactions que eu ja fiz para cada uma


# Estrutura de projeto 
```
/meu-projeto
│── /src
│   ├── /config          # Configurações (ex: .env, conexões)
│   ├── /controllers     # Lógica dos controladores
│   ├── /models          # Modelos da aplicação
│   ├── /repositories    # Camada de acesso ao banco de dados
│   ├── /routes          # Rotas da API
│   ├── /services        # Regras de negócio (lógica de aplicação)
│   ├── /utils           # Funções auxiliares
│   ├── /middlewares     # Middlewares globais
│   ├── server.js        # Configuração do Fastify
│── /tests               # Testes automatizados
│── /migrations          # Arquivos de migração do banco de dados
│── /seeds               # Seeds para popular o banco de dados
│── .env                 # Variáveis de ambiente
│── .gitignore           # Arquivos a serem ignorados pelo Git
│── package.json         # Dependências e scripts do projeto
│── README.md            # Documentação do projeto
```
