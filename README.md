<div align="center">
  <img src="Documentação/Imagens/logo-virtus.png" alt="Virtus Logo" height="200"/>
</div>

## 📋 Descrição
Sistema de moeda estudantil desenvolvido no Laboratório de Desenvolvimento de Software, que permite a gestão de moedas de bonificação virtuais entre alunos e professores em ambiente acadêmico.

Virtus  implementa um sistema de economia interna para instituições de ensino, onde professores podem distribuir moedas virtuais aos alunos como recompensa por participação, desempenho acadêmico e outras atividades. Os alunos podem acumular e trocar essas moedas por benefícios e vantagens oferecidas pela instituição ou empresas parceiras. 

## 📚 Documentação

### Diagrama de Casos de Uso
![Diagrama de Casos de Uso](Documentação/Diagramas/Diagrama%20de%20Casos%20de%20Uso.jpeg)

### Diagrama de Classes
![Diagrama de Classes](Documentação/Diagramas/Diagrama%20de%20Classes.png)

### Diagrama de Componentes
![Diagrama de Componentes](Documentação/Diagramas/Diagrama%20de%20Componentes.png)

### Diagrama de Entidade e Relacionamento
![Diagrama de Entidade e Relacionamento](Documentação/Diagramas/Diagrama%20de%20Entidade%20e%20Relacionamento.jpeg)

### Diagrama do Modelo Relacional
![Diagrama do Modelo Relacional](Documentação/Diagramas/Diagrama%20do%20Modelo%20Relacional.png)

### Diagramas de Sequência
![Diagrama de Sequência](Documentação/Diagramas/Diagrama%20de%20Sequência.jpeg)

![Diagrama de Sequência 2](Documentação/Diagramas/Diagrama%20de%20Sequência%202.jpeg)

### Histórias de Usuário
 [`Histórias de Usuário.pdf`](Documentação/Diagramas/Histórias%20de%20Usuário.pdf)

### Script do Banco de Dados PostgreSQL
[`script-postgresql.pdf`](Documentação/Scripts/script-postgresql.sql)

### Apresentação do Projeto - Primeira Versão
[`Apresentação Virtus.pdf`](Documentação/Apresentações/Apresentação%20Virtus.pdf)


## 🏗️ Arquitetura do Sistema

O **Virtus** foi desenvolvido com base na arquitetura **MVC (Model-View-Controller)**, que separa claramente as responsabilidades da aplicação, garantindo melhor organização, escalabilidade e manutenção do código.

- **Model (Modelo):** Responsável pela lógica de negócio, regras e comunicação com o banco de dados.  
- **View (Visão):** Camada de interface que exibe as informações ao usuário de forma amigável.  
- **Controller (Controlador):** Atua como intermediário entre a View e o Model, processando requisições e controlando o fluxo da aplicação.  

Além disso, adotamos o uso de **DTOs (Data Transfer Objects)** para otimizar a transferência de dados entre as camadas da aplicação. Essa prática aumenta a segurança, evitando a exposição desnecessária de entidades, e melhora a performance na comunicação entre back-end e front-end.

No front-end, foi utilizado o **App Router do Next.js**, que permite uma estrutura de rotas moderna e eficiente, com renderização híbrida (SSR e SSG), facilitando a criação de páginas dinâmicas e otimizadas para SEO.

---

## 🧩 Tecnologias Utilizadas

| Logo                                                                           | Tecnologia | Descrição |
|--------------------------------------------------------------------------------|-------------|-----------|
| <img src="Documentação/Imagens/spring.png" alt="Spring Boot" height="40"/>     | **Spring Boot** | Framework Java utilizado no back-end, responsável pela API REST, autenticação e integração com o banco de dados. |
| <img src="Documentação/Imagens/nextjs.png" alt="Next.js" height="40"/>         | **Next.js** | Framework React moderno usado no front-end, oferecendo renderização híbrida e excelente experiência do usuário. |
| <img src="Documentação/Imagens/postgreesql.png" alt="PostgreSQL" height="40"/> | **PostgreSQL** | Banco de dados relacional usado para armazenar e gerenciar as informações de alunos, professores e moedas. |



## 👥 Equipe
Projeto desenvolvido pelos alunos:
- Bernardo de Resende Marcelino
- Flávio de Souza Júnior
- João Marcelo Carvalho Pereira Araújo
- Miguel Figueiredo Diniz
